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
 *   - 极淡近白渐变背景（蓝白 → 薰衣草白 → 青绿白，借鉴 scottspence 的干净留白）
 *   - 左侧大标题主导（占最大视觉空间），右侧高饱和抽象几何色块组
 *     （靛紫/亮蓝/青绿/琥珀，紧凑交叠、错落连接，带浮空阴影）
 *   - 信息层级：品牌标 → 标题 → 副标题（最多 2 行）→ 作者/站点
 *   - 2026-08-02 优化：副标题截断至 2 行消除密集感；色块组收紧交错增强动感；
 *     背景减淡至近白提升极简质感（对齐 scottspence 参考）
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
const MUTED = '#64748b';

/* 几何装饰组件：右侧高饱和抽象色块组
 * 2026-08-01 重构：对齐 scottspence.com OG 风格——
 *   高饱和实色块（靛紫/亮蓝/青绿/琥珀）错落重叠 + 浮空阴影，成为画面视觉锚点。
 *   旧版低透明度色块（0.13-0.38）视觉上几乎不可见，整图被误读为纯白文档。
 * 2026-08-02 优化：色块组收紧、交叠加深（青绿块上移叠入紫块右缘、新增浅蓝小块、
 *   琥珀条加长延伸），借鉴参考图的「方块交叠连接」动感。
 * 注意：返回数组并直接展开到 root 下，色块 absolute 相对 root 定位。
 *   不能包一层 inset:0 容器——Satori 不支持 inset shorthand，容器会被解析为 0x0，色块全部偏移出画布。 */
function Decor() {
  return [
    // 大靛紫渐变方块（右上主锚点，浮空阴影）
    h('div', {
      style: {
        position: 'absolute', right: 92, top: 60, width: 340, height: 340, borderRadius: 68,
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        transform: 'rotate(8deg)',
        boxShadow: '0 28px 56px rgba(79,70,229,0.30)',
      },
    }),
    // 亮蓝小方块（错落叠于大块左上缘）
    h('div', {
      style: {
        position: 'absolute', right: 168, top: 88, width: 92, height: 92, borderRadius: 20,
        background: '#2563EB', transform: 'rotate(-14deg)',
        boxShadow: '0 12px 24px rgba(37,99,235,0.35)',
      },
    }),
    // 青绿渐变方块（叠入大块右下缘，交叠连接）
    h('div', {
      style: {
        position: 'absolute', right: 150, bottom: 92, width: 170, height: 170, borderRadius: 36,
        background: 'linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)',
        transform: 'rotate(-6deg)',
        boxShadow: '0 16px 32px rgba(13,148,136,0.32)',
      },
    }),
    // 浅蓝小方块（叠于紫块右下角，点睛连接）
    h('div', {
      style: {
        position: 'absolute', right: 96, top: 320, width: 64, height: 64, borderRadius: 16,
        background: '#60A5FA', transform: 'rotate(12deg)',
        boxShadow: '0 10px 20px rgba(96,165,250,0.35)',
      },
    }),
    // 紫色圆环（装饰间隙）
    h('div', {
      style: {
        position: 'absolute', right: 424, top: 132, width: 96, height: 96, borderRadius: 48,
        border: '20px solid rgba(124,58,237,0.30)',
      },
    }),
    // 琥珀渐变扁条（底部延伸，呼应暖色连接感）
    h('div', {
      style: {
        position: 'absolute', right: 40, bottom: 66, width: 250, height: 24, borderRadius: 12,
        background: 'linear-gradient(90deg, #F59E0B 0%, #F97316 100%)',
        transform: 'rotate(-4deg)',
      },
    }),
    // 橙色圆点（提亮）
    h('div', {
      style: {position: 'absolute', right: 108, top: 436, width: 30, height: 30, borderRadius: 15, background: '#F97316'},
    }),
    // 青色小圆点（叠于青绿块上沿）
    h('div', {
      style: {position: 'absolute', right: 300, bottom: 172, width: 26, height: 26, borderRadius: 13, background: '#06B6D4'},
    }),
  ];
}

/** 品牌标：蓝色圆角方块 + 白字 B（与 static/img/logo.svg 一致） */
function BrandMark() {
  return h('div', {
    style: {
      width: 44, height: 44, borderRadius: 10, background: BRAND_BLUE,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: 26, fontWeight: 700, lineHeight: 1,
    },
  }, 'B');
}

/**
 * 渲染单张 OG 图
 * @param {Object} opts
 * @param {string}   opts.title        主标题
 * @param {string}   [opts.subtitle]   副标题（站点 tagline 或文章 description）
 * @param {string}   [opts.badge]      顶部徽标文字
 * @param {string}   [opts.meta]       底部元信息（作者 · 站点）
 */
export async function renderOg({title, subtitle, badge = 'BLOG', meta = 'Booker Zhao · binggg.github.io'}) {
  /* 标题字号自适应：越长字号越小，最多 3 行（标题是画面主角，占最大视觉空间） */
  const len = title.length;
  const fontSize = len <= 16 ? 62 : len <= 24 ? 56 : len <= 32 ? 50 : 46;
  const lineHeight = 1.32;
  const titleWidth = 720; // 标题可用宽度（避开右侧色块区）
  const maxLines = 3;
  const fitted = fitTitle(title, titleWidth * maxLines * 0.97, fontSize);

  /* 副标题：最多 2 行，超长截断（信息层级克制，避免与标题抢视觉） */
  const fittedSub = subtitle ? fitTitle(subtitle, titleWidth * 2 * 0.97, 24) : undefined;

  const jsx = h('div', {
    style: {
      width: WIDTH, height: HEIGHT, display: 'flex', position: 'relative',
      background: 'linear-gradient(118deg, #F7FAFE 0%, #F5F3FC 46%, #F0FAF7 100%)',
      fontFamily: 'Noto Sans CJK SC',
    },
  }, [
    ...Decor(),
    /* 左侧内容区 */
    h('div', {
      style: {
        position: 'relative', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', paddingLeft: 64, paddingRight: 440,
        width: '100%', height: '100%',
      },
    }, [
      /* 顶部品牌行 */
      h('div', {style: {display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28}}, [
        BrandMark(),
        h('div', {
          style: {
            fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: BRAND_BLUE,
          },
        }, badge),
      ]),
      /* 主标题（自动换行，最多 3 行） */
      h('div', {
        style: {
          fontSize, fontWeight: 700, color: INK, lineHeight,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', maxWidth: titleWidth,
        },
      }, fitted),
      /* 副标题（最多 2 行，超长省略） */
      fittedSub && h('div', {
        style: {
          marginTop: 18, fontSize: 24, color: MUTED, lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', maxWidth: titleWidth,
        },
      }, fittedSub),
      /* 底部元信息 */
      h('div', {style: {display: 'flex', alignItems: 'center', gap: 12, marginTop: 34}}, [
        h('div', {style: {width: 30, height: 3, borderRadius: 2, background: BRAND_BLUE}}),
        h('div', {style: {fontSize: 22, color: '#475569', letterSpacing: '0.02em'}}, meta),
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
 *  - 已有 image 行 → 替换
 *  - 无 image 行 → 插到 title 行之后
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

/* ---------------------------------------------------------------------------
 * 主流程
 * ------------------------------------------------------------------------- */
async function main() {
  fs.mkdirSync(OG_DIR, {recursive: true});
  const generated = [];
  const synced = [];

  /* 1. 逐篇扫描博客文章（默认语言 + 英文 i18n） */
  const locales = [
    {dir: BLOG_DIR, outDir: OG_DIR, metaSite: 'binggg.github.io'},
    {dir: I18N_BLOG_DIR, outDir: path.join(OG_DIR, 'en'), metaSite: 'binggg.github.io · English'},
  ];
  for (const {dir, outDir, metaSite} of locales) {
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

      /* 已生成且比文章新则跳过（--force 除外） */
      if (!FORCE && fs.existsSync(outFile)) {
        const outStat = fs.statSync(outFile);
        const srcStat = fs.statSync(indexFile);
        if (outStat.mtimeMs > srcStat.mtimeMs) continue;
      }

      const date = fm.date ? String(fm.date) : '';
      const meta = ['Booker Zhao', date && date.replace(/-/g, '.'), metaSite].filter(Boolean).join(' · ');
      const png = await renderOg({
        title,
        subtitle: fm.description,
        meta,
      });
      fs.writeFileSync(outFile, png);
      generated.push(outFile);

      /* 同步 frontmatter image 指向（static 目录映射到站点根，路径从 static 之后算） */
      const relOut = path.relative(path.join(ROOT, 'static'), outFile).replace(/\\/g, '/');
      if (syncFrontmatterImage(indexFile, `/${relOut}`)) synced.push(indexFile);
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
