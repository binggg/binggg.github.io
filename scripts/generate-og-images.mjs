#!/usr/bin/env node
/**
 * generate-og-images.mjs
 * ============================================================================
 * 博客 OG 图生成器（构建时运行，prebuild 钩子自动执行）
 *
 * 工作流程：
 *   1. 扫描 blog 目录下各文章 index.md 的 frontmatter（title / description / slug / date）
 *   2. Satori 渲染 1200x630 品牌化 OG 图（JSX → SVG）
 *   3. resvg-js 将 SVG 光栅化为 PNG → static/og/<slug>.png
 *   4. 额外生成站点级默认 OG 图 → static/img/og-default.png
 *
 * 设计语言（参考 scottspence.com 的动态 OG，融入本站品牌）：
 *   - 可感知的浅蓝白渐变背景（蓝白 → 薰衣草白 → 青绿白，对齐 scottspence 的
 *     干净留白但保留渐变层次，避免被误读为纯白）
 *   - 左侧大标题主导（占最大视觉空间），右侧高饱和抽象几何色块组
 *     （靛紫/亮蓝/青绿/琥珀，松散错落、交叠连接，带柔和浮空阴影）
 *   - 信息层级：标题 → 副标题（最多 2 行，弱化处理）→ 作者/站点
 *   - 2026-08-02 二轮优化（对齐 scott 参考）：
 *     背景渐变加深至可感知；主紫块缩小、新增琥珀橙方块、整体更松散错落；
 *     新增连接点阵动线消除左右割裂；副标题弱化（更浅灰、更小）
 *   - 2026-08-03 四轮优化（像素级对齐 scott 的极简美学）：
 *     移除顶部品牌行（B 方块 + BLOG 徽标）——scott 无品牌标，标题才是主角；
 *     标题字号随之放大、位置上移；作者署名移到标题下方（对齐 scott 的
 *     「• Scott Spence / scottspence.com」位置），替代底部蓝线 meta 行；
 *     移除连接点阵（像素分析显示其侵入文字区 x<420，scott 无此元素）；
 *     背景右端增加淡粉紫渐变段（对齐 scott 冷蓝白→粉紫的冷暖过渡）
 *
 * 用法：node scripts/generate-og-images.mjs [--force]
 *   --force 强制重新生成所有图（默认跳过已存在且较新的图）
 * ============================================================================
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import satori from 'satori';
import {Resvg} from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const I18N_BLOG_DIR = path.join(ROOT, 'i18n', 'en', 'docusaurus-plugin-content-blog');
const OG_DIR = path.join(ROOT, 'static', 'og');
const FONT_DIR = path.join(ROOT, 'scripts', 'og-fonts');

const WIDTH = 1200;
const HEIGHT = 630;
const FORCE = process.argv.includes('--force');

/* ---------------------------------------------------------------------------
 * 字体加载（Satori 不支持 .ttc，使用 Noto Sans CJK SC 单文件 OTF）
 * ------------------------------------------------------------------------- */
const readFont = (file) => fs.readFileSync(path.join(FONT_DIR, file));
const FONTS = [
  {name: 'Noto Sans CJK SC', data: readFont('NotoSansCJKsc-Regular.otf'), weight: 400, style: 'normal'},
  {name: 'Noto Sans CJK SC', data: readFont('NotoSansCJKsc-Bold.otf'), weight: 700, style: 'normal'},
];

/* ---------------------------------------------------------------------------
 * 简易 frontmatter 解析（覆盖本项目所有文章的字段形态）
 * ------------------------------------------------------------------------- */
function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val === '' || val.startsWith('[') || val.startsWith('{')) continue;
    val = val.replace(/^['"]|['"]$/g, '').replace(/^"|"$/g, '');
    fm[key] = val;
  }
  return fm;
}

/* ---------------------------------------------------------------------------
 * 文本宽度估算（中文全角 ≈ fontSize，拉丁 ≈ 0.56×，用于标题截断）
 * ------------------------------------------------------------------------- */
function textWidth(str, fontSize) {
  let w = 0;
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x2e80) w += fontSize; // CJK 及全角字符
    else if (ch === ' ') w += fontSize * 0.32;
    else if (/[0-9A-Za-z]/.test(ch)) w += fontSize * 0.56;
    else if (/[，。！？、；：""''（）《》—…·]/.test(ch)) w += fontSize * 0.6;
    else w += fontSize * 0.5;
  }
  return w;
}

/** 按像素宽度截断标题并加省略号 */
function fitTitle(title, maxWidth, fontSize) {
  if (textWidth(title, fontSize) <= maxWidth) return title;
  let out = '';
  for (const ch of title) {
    if (textWidth(out + ch + '…', fontSize) > maxWidth) break;
    out += ch;
  }
  return out + '…';
}

/* ---------------------------------------------------------------------------
 * 标题自适应排版（对齐 scottspence：标题完整显示，不截断成省略号）
 *  - 模拟换行（CJK 逐字、拉丁逐词），按真实渲染行数动态选字号
 *  - 优先 3 行（62→34px），长标题降级 4 行（32→28px），最后才截断
 * ------------------------------------------------------------------------- */
/** 文本 token 化：CJK 逐字，拉丁串（含空格）为整体 */
function tokenize(text) {
  const tokens = [];
  let latin = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x2e80) {
      if (latin) { tokens.push(latin); latin = ''; }
      tokens.push(ch);
    } else {
      latin += ch;
    }
  }
  if (latin) tokens.push(latin);
  return tokens;
}

/** 模拟换行，返回行数组（与 Satori/Yoga 的 CJK 逐字、拉丁逐词换行一致） */
function wrapText(text, maxWidth, fontSize) {
  const lines = [];
  let cur = '';
  for (const t of tokenize(text)) {
    if (cur === '') { cur = t; continue; }
    if (textWidth(cur + t, fontSize) <= maxWidth) { cur += t; continue; }
    lines.push(cur);
    cur = t;
    /* 单个超长 token（极端连续英文）按字符拆行 */
    while (textWidth(cur, fontSize) > maxWidth) {
      let acc = '';
      for (const ch of cur) {
        if (textWidth(acc + ch, fontSize) > maxWidth) break;
        acc += ch;
      }
      lines.push(acc);
      cur = cur.slice(acc.length);
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/** 按「最大可完整显示」原则选字号与行数，返回 {fontSize, lineClamp, text} */
function fitTitleSmart(title, maxWidth) {
  for (const s of [62, 58, 54, 50, 46, 42, 38, 34]) {
    if (wrapText(title, maxWidth * 0.95, s).length <= 3) {
      return {fontSize: s, lineClamp: 3, text: title};
    }
  }
  for (const s of [32, 30, 28]) {
    if (wrapText(title, maxWidth * 0.95, s).length <= 4) {
      return {fontSize: s, lineClamp: 4, text: title};
    }
  }
  /* 兜底：28px 截断到 4 行 + 省略号 */
  const kept = wrapText(title, maxWidth * 0.95, 28).slice(0, 4);
  return {fontSize: 28, lineClamp: 4, text: kept.join('').slice(0, -1) + '…'};
}

/* ---------------------------------------------------------------------------
 * 轻量 JSX 工厂（Satori 接受 {type, props} 结构，children 需展平）
 * ------------------------------------------------------------------------- */
const h = (type, props = {}, ...children) => {
  const flat = children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false);
  /* 空 children 置 undefined：Satori 中空数组也会被判定为「非字符串 children」从而要求显式 display */
  const kids = flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat;
  return {type, props: {...props, children: kids}};
};

/* ---------------------------------------------------------------------------
 * 品牌常量
 * ------------------------------------------------------------------------- */
const BRAND_BLUE = '#2563eb';
const INK = '#1e293b';

/* 背景细网格（对齐 scottspence.com 的标志性坐标纸质感）
 * Satori 不支持 repeating-linear-gradient / url(data:) 背景图，
 * 用 SVG line 元素平铺绘制——24px 格距、1px 浅灰线、对比度克制不抢文字。 */
const GRID_SIZE = 24;
function GridBackground() {
  const lines = [];
  for (let x = 0; x <= WIDTH; x += GRID_SIZE) {
    lines.push(h('line', {x1: x, y1: 0, x2: x, y2: HEIGHT, stroke: 'rgba(100,116,139,0.14)', strokeWidth: 1}));
  }
  for (let y = 0; y <= HEIGHT; y += GRID_SIZE) {
    lines.push(h('line', {x1: 0, y1: y, x2: WIDTH, y2: y, stroke: 'rgba(100,116,139,0.14)', strokeWidth: 1}));
  }
  return h('svg', {
    width: WIDTH, height: HEIGHT,
    style: {position: 'absolute', top: 0, left: 0, display: 'block'},
  }, ...lines);
}

/* 几何装饰组件：右侧高饱和抽象色块组
 * 2026-08-01 重构：对齐 scottspence.com OG 风格——
 *   高饱和实色块（靛紫/亮蓝/青绿/琥珀）错落重叠 + 浮空阴影，成为画面视觉锚点。
 *   旧版低透明度色块（0.13-0.38）视觉上几乎不可见，整图被误读为纯白文档。
 * 2026-08-02 首轮：色块组收紧、交叠加深，借鉴参考图的「方块交叠连接」动感。
 * 2026-08-02 二轮（对齐 scott）：
 *   - 主紫块 340→280 缩小，整体更松散错落（scott 的方块群偏中等尺寸、不独占画面）
 *   - 新增琥珀橙方块（对应 scott 的珊瑚橙块，暖色平衡冷色）
 *   - 青绿块加大并叠入紫块右缘，交叠更深
 *   - 新增 6 点渐变连接点阵：从文字区边界延伸到色块组，
 *     形成「文字 → 数据流 → 图形」动线，消除左右割裂
 * 2026-08-03 三轮（对齐 scott 的克制美学）：
 *   - 装饰从 10 元素精简到 5：只保留「紫主块 + 青绿块 + 橙块 + 蓝小方 + 3 点阵」
 *   - 移除紫色圆环 / 琥珀扁条 / 双圆点，消除堆砌感
 *   - 像素级对比：scott 右侧高饱和像素占比约 25%，旧版 50% → 本轮回到 ~30%
 * 2026-08-03 四轮（像素级对齐 scott）：
 *   - 移除连接点阵——像素分析显示 3 点阵位于 x 400-536，侵入标题区
 *     （标题占 x 64-784），而 scott 色块严格集中在 x 820-1120
 *   - 橙块右移（right 336→280）：scott 色块群 x 820~1120，旧版橙块 x 764 偏左
 * 注意：返回数组并直接展开到 root 下，色块 absolute 相对 root 定位。
 *   不能包一层 inset:0 容器——Satori 不支持 inset shorthand，容器会被解析为 0x0，色块全部偏移出画布。 */
function Decor() {
  return [
    // 大靛紫渐变方块（右上主锚点，浮空阴影）
    h('div', {
      style: {
        position: 'absolute', right: 110, top: 78, width: 240, height: 240, borderRadius: 52,
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        transform: 'rotate(8deg)',
        boxShadow: '0 24px 48px rgba(79,70,229,0.24)',
      },
    }),
    // 亮蓝小方块（错落叠于大块左上缘）
    h('div', {
      style: {
        position: 'absolute', right: 176, top: 102, width: 72, height: 72, borderRadius: 18,
        background: '#2563EB', transform: 'rotate(-14deg)',
        boxShadow: '0 10px 20px rgba(37,99,235,0.28)',
      },
    }),
    // 青绿渐变方块（叠入大块右下缘，交叠连接）
    h('div', {
      style: {
        position: 'absolute', right: 140, bottom: 92, width: 184, height: 184, borderRadius: 40,
        background: 'linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)',
        transform: 'rotate(-6deg)',
        boxShadow: '0 14px 28px rgba(13,148,136,0.26)',
      },
    }),
    // 琥珀橙方块（对应 scott 珊瑚橙块，暖色平衡；right 336→280 对齐 scott 色块群 x 范围）
    h('div', {
      style: {
        position: 'absolute', right: 280, bottom: 60, width: 100, height: 100, borderRadius: 24,
        background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
        transform: 'rotate(10deg)',
        boxShadow: '0 12px 24px rgba(249,115,22,0.24)',
      },
    }),
  ];
}

/** 品牌标：蓝色圆角方块 + 白字 B（与 static/img/logo.svg 一致），支持尺寸定制 */
function BrandMark(size = 44) {
  return h('div', {
    style: {
      width: size, height: size, borderRadius: Math.round(size * 0.23), background: BRAND_BLUE,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: Math.round(size * 0.6), fontWeight: 700, lineHeight: 1,
    },
  }, 'B');
}

/**
 * 渲染单张 OG 图
 * @param {Object} opts
 * @param {string}   opts.title        主标题
 * @param {string}   [opts.subtitle]   副标题（站点 tagline 或文章 description）
 * @param {string}   [opts.badge]      顶部徽标文字（可选，仅站点级图使用；文章图不传以对齐 scott 极简风格）
 * @param {string}   [opts.meta]       署名信息（作者 · 站点）
 */
export async function renderOg({title, subtitle, badge = '', meta = 'Booker Zhao · binggg.github.io'}) {
  /* 标题字号自适应：模拟换行选最大能完整显示的字号（优先 3 行，长标题降级 4 行） */
  const titleWidth = 720; // 标题可用宽度（避开右侧色块区）
  const lineHeight = 1.32;
  const {fontSize, lineClamp, text: fitted} = fitTitleSmart(title, titleWidth);

  /* 副标题：最多 2 行，超长截断（信息层级克制，避免与标题抢视觉） */
  const fittedSub = subtitle ? fitTitle(subtitle, titleWidth * 2 * 0.97, 24) : undefined;

  const jsx = h('div', {
    style: {
      width: WIDTH, height: HEIGHT, display: 'flex', position: 'relative',
      background: 'linear-gradient(118deg, #EFF3FB 0%, #EBE7F7 40%, #F0E6F2 100%)',
      fontFamily: 'Noto Sans CJK SC',
    },
  }, [
    /* 背景细网格（scott 标志性坐标纸质感，置于最底层） */
    GridBackground(),
    /* 背景光晕（对齐 scottspence：右上粉紫、左下淡蓝，增强渐变可感知度） */
    h('div', {
      style: {
        position: 'absolute', right: -140, top: -140, width: 600, height: 600, borderRadius: 999,
        background: 'radial-gradient(circle, rgba(217,70,239,0.13) 0%, rgba(217,70,239,0) 65%)',
      },
    }),
    h('div', {
      style: {
        position: 'absolute', left: -160, bottom: -160, width: 640, height: 640, borderRadius: 999,
        background: 'radial-gradient(circle, rgba(37,99,235,0.13) 0%, rgba(37,99,235,0) 65%)',
      },
    }),
    ...Decor(),
    /* 左侧内容区（对齐 scott：无顶部品牌行，标题为主体，署名在标题下方） */
    h('div', {
      style: {
        position: 'relative', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', paddingLeft: 64, paddingRight: 440,
        width: '100%', height: '100%',
      },
    }, [
      /* 顶部徽标（可选，仅站点级图；文章图 badge 为空不渲染） */
      badge && h('div', {
        style: {
          fontSize: 20, fontWeight: 700, letterSpacing: '0.16em', color: BRAND_BLUE,
          marginBottom: 26,
        },
      }, badge),
      /* 主标题（自动换行，最多 3 行，长标题降级 4 行完整显示） */
      h('div', {
        style: {
          fontSize, fontWeight: 700, color: INK, lineHeight,
          display: '-webkit-box', WebkitLineClamp: lineClamp, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', maxWidth: titleWidth,
        },
      }, fitted),
      /* 副标题（最多 2 行，超长省略；弱化处理——更浅灰、更小，避免与标题抢视觉） */
      fittedSub && h('div', {
        style: {
          marginTop: 16, fontSize: 22, color: '#94a3b8', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', maxWidth: titleWidth,
        },
      }, fittedSub),
      /* 署名行（对齐 scott「标题下方作者信息」：品牌小标 + 作者 · 站点） */
      h('div', {style: {display: 'flex', alignItems: 'center', gap: 12, marginTop: 30}}, [
        BrandMark(34),
        h('div', {style: {fontSize: 21, color: '#475569', letterSpacing: '0.02em'}}, meta),
      ]),
    ]),
  ]);

  findDisplayViolations(jsx);
  const svg = await satori(jsx, {width: WIDTH, height: HEIGHT, fonts: FONTS});
  const png = new Resvg(svg, {fitTo: {mode: 'width', value: WIDTH}}).render().asPng();
  return png;
}

/* 调试工具：递归检查元素树中「多子节点但无显式 display」的节点 */
function findDisplayViolations(node, path = 'root') {
  if (!node || typeof node !== 'object') return;
  const props = node.props || {};
  const kids = props.children;
  const count = Array.isArray(kids) ? kids.length : kids == null ? 0 : 1;
  const display = props.style && props.style.display;
  if (count > 1 && !display) {
    console.log(`⚠️ ${path}: children=${count} style=${JSON.stringify(props.style)}`);
  }
  if (Array.isArray(kids)) kids.forEach((k, i) => findDisplayViolations(k, `${path}[${i}]`));
  else if (kids && typeof kids === 'object') findDisplayViolations(kids, `${path}.c`);
}

/* ---------------------------------------------------------------------------
 * 同步 frontmatter：把文章的 image 字段指向生成的 OG 图（幂等）
 *  - 已有 image 行 → 替换；无 image 行 → 插到 title 行之后
 *  - 仅当期望值不一致时才写文件（不依赖图是否重新生成）
 *
 * imageValue 形态（2026-08-12 修复）：
 *  - zh（默认 locale）：站内绝对路径 `/og/<slug>.png`，Docusaurus 的
 *    addBaseUrl 会拼成站点绝对 URL，行为正确
 *  - en（i18n locale）：必须用完整绝对 URL `https://binggg.github.io/og/en/<slug>.png`。
 *    相对路径会被 Docusaurus i18n 加 locale 前缀 → 产物 `/en/og/en/<slug>.png`
 *    双层冗余路径（依赖 static 复制到 locale 目录才可用）；
 *    addBaseUrl 对 hasProtocol(url) 短路原样返回，完整 URL 才能得到干净路径
 * ------------------------------------------------------------------------- */
function syncFrontmatterImage(file, imageValue) {
  let content = fs.readFileSync(file, 'utf8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return false;
  const fmBody = fmMatch[1];
  const imageLine = new RegExp(`^image:.*$`, 'm');
  let newBody;
  if (imageLine.test(fmBody)) {
    newBody = fmBody.replace(imageLine, `image: ${imageValue}`);
  } else {
    /* 在 title 行后插入 */
    newBody = fmBody.replace(/^title:.*$/m, (m) => `${m}\nimage: ${imageValue}`);
  }
  if (newBody === fmBody) return false;
  const newContent = content.replace(fmMatch[1], newBody);
  fs.writeFileSync(file, newContent);
  return true;
}

/* 站点绝对 OG URL：zh → /og/<slug>.png；en（i18n）→ https://binggg.github.io/og/en/<slug>.png
 * 仅 en 需要完整 URL：Docusaurus i18n 会对站内相对路径的 metadata.image 加 locale 前缀 */
function ogImageValue(relOut, isI18n) {
  return isI18n ? `https://binggg.github.io/${relOut}` : `/${relOut}`;
}

/* ---------------------------------------------------------------------------
 * 主流程
 * ------------------------------------------------------------------------- */
async function main() {
  fs.mkdirSync(OG_DIR, {recursive: true});
  const generated = [];
  const synced = [];

  /* 1. 逐篇扫描博客文章（默认语言 + 英文 i18n） */
  const locales = [
    {dir: BLOG_DIR, outDir: OG_DIR, metaSite: 'binggg.github.io', isI18n: false},
    {dir: I18N_BLOG_DIR, outDir: path.join(OG_DIR, 'en'), metaSite: 'binggg.github.io · English', isI18n: true},
  ];
  for (const {dir, outDir, metaSite, isI18n} of locales) {
    if (!fs.existsSync(dir)) continue;
    fs.mkdirSync(outDir, {recursive: true});
    const entries = fs.readdirSync(dir, {withFileTypes: true})
      .filter((e) => e.isDirectory());
    for (const entry of entries) {
      const indexFile = path.join(dir, entry.name, 'index.md');
      if (!fs.existsSync(indexFile)) continue;
      const fm = parseFrontmatter(fs.readFileSync(indexFile, 'utf8'));
      const title = fm.title;
      if (!title) continue;

      /* slug：frontmatter 显式 slug 优先，否则目录名去掉日期前缀 */
      const slug = fm.slug || entry.name.replace(/^\d{4}-\d{2}-\d{2}-/, '');
      const outFile = path.join(outDir, `${slug}.png`);

      /* 图比文章旧才重新生成（--force 除外） */
      let needsRegen = FORCE;
      if (!needsRegen && fs.existsSync(outFile)) {
        const outStat = fs.statSync(outFile);
        const srcStat = fs.statSync(indexFile);
        needsRegen = outStat.mtimeMs <= srcStat.mtimeMs;
      }
      if (needsRegen) {
        const date = fm.date ? String(fm.date) : '';
        const meta = ['Booker Zhao', date && date.replace(/-/g, '.'), metaSite].filter(Boolean).join(' · ');
        const png = await renderOg({
          title,
          subtitle: fm.description,
          meta,
        });
        fs.writeFileSync(outFile, png);
        generated.push(outFile);
      }

      /* 同步 frontmatter image 指向（独立于图是否重新生成，期望值不一致才写）
       * static 目录映射到站点根，路径从 static 之后算 */
      const relOut = path.relative(path.join(ROOT, 'static'), outFile).replace(/\\/g, '/');
      if (syncFrontmatterImage(indexFile, ogImageValue(relOut, isI18n))) synced.push(indexFile);
    }
  }

  /* 2. 站点级默认 OG 图（首页/列表页等无专属图页面） */
  const defaultFile = path.join(ROOT, 'static', 'img', 'og-default.png');
  if (FORCE || !fs.existsSync(defaultFile)) {
    const png = await renderOg({
      title: 'Booker Zhao',
      subtitle: 'Software Engineer, AI Enthusiast, Father of Two — AI 全栈工程师，CloudBase AI ToolKit 作者',
      badge: 'BINGGG.GITHUB.IO',
      meta: 'Writing · Projects · AI Agents',
    });
    fs.writeFileSync(defaultFile, png);
    generated.push(defaultFile);
  }

  /* 3. 汇总 */
  const lines = [];
  if (generated.length > 0) {
    lines.push(`✅ 已生成 ${generated.length} 张 OG 图:`);
    for (const f of generated) lines.push(`   + ${path.relative(ROOT, f)}`);
  }
  if (synced.length > 0) {
    lines.push(`✅ 已同步 ${synced.length} 篇文章的 frontmatter image:`);
    for (const f of synced) lines.push(`   ~ ${path.relative(ROOT, f)}`);
  }
  if (lines.length === 0) console.log('✅ OG 图全部是最新状态，无需重新生成');
  else console.log(lines.join('\n'));
}

/* 仅在直接运行时执行主流程（可被其他脚本 import 复用渲染函数） */
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error('❌ OG 图生成失败:', err);
    process.exit(1);
  });
}
