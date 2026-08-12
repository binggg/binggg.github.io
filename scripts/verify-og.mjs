#!/usr/bin/env node
/**
 * verify-og.mjs
 * ============================================================================
 * OG 卡片链路核验器（发布前预热 / 部署后体检）
 *
 * 背景：X 对 URL 首次抓取后缓存卡片约 1 周；若发帖早于 GitHub Pages 部署
 * 完成，X 会缓存失败结果导致卡片带不出来。本脚本一键核验：
 *
 *   1. 页面 URL 可访问（跟随重定向，最终 200）
 *   2. og:title / og:description / og:image / twitter:card 齐全
 *   3. og:image 为绝对 URL 且 HTTP 200、格式 PNG、尺寸 1200x630、< 5MB
 *   4. robots.txt 放行（静态头检查）
 *
 * 用法：
 *   node scripts/verify-og.mjs                     # 核验全部博客文章（zh+en）
 *   node scripts/verify-og.mjs <slug>              # 核验单篇（zh，自动带日期前缀）
 *   node scripts/verify-og.mjs <slug> --en         # 核验单篇英文
 *   node scripts/verify-og.mjs <full-url>          # 核验任意 URL
 *
 * 退出码：全部通过 0；任一失败 1（可供 CI / 发布前检查接入）
 * ============================================================================
 */
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://binggg.github.io';
const ROOT = path.resolve(import.meta.dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const I18N_DIR = path.join(ROOT, 'i18n', 'en', 'docusaurus-plugin-content-blog');
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // X 要求 og:image < 5MB

/* ---------------------------------------------------------------------------
 * 工具
 * ------------------------------------------------------------------------- */
const log = (ok, msg) => {
  console.log(`${ok ? '✅' : '❌'} ${msg}`);
  return ok;
};

async function fetchWithRedirects(url, {ua = 'Twitterbot/1.0', timeout = 15000} = {}) {
  const res = await fetch(url, {
    headers: {accept: '*/*', 'user-agent': ua},
    redirect: 'follow',
    signal: AbortSignal.timeout(timeout),
  });
  const body = await res.text();
  return {status: res.status, finalUrl: res.url, body};
}

/** 提取 meta 标签值（属性名支持 property/name/rel，值可有引号也可无引号，如
 *  Docusaurus 输出的 <meta property=og:image content=https://...>） */
function metaValue(html, key) {
  const re = new RegExp(`<(?:meta|link)[^>]*(?:property|name|rel)=["']?${key}["']?[^>]*(?:content|href)=["']?([^"'>\\s]+)`, 'i');
  const m = html.match(re);
  return m ? m[1] : undefined;
}

/* ---------------------------------------------------------------------------
 * 单 URL 核验
 * ------------------------------------------------------------------------- */
async function verifyUrl(url, label) {
  const issues = [];
  let page;
  try {
    page = await fetchWithRedirects(url);
  } catch (e) {
    log(false, `${label}: 页面抓取失败 (${e.message})`);
    return false;
  }

  /* 1. 页面可达性 */
  if (page.status !== 200) issues.push(`页面 HTTP ${page.status}`);
  if (page.body.length < 1000) issues.push('页面内容过短，疑似错误页');

  /* 2. meta 齐全性 */
  const ogTitle = metaValue(page.body, 'og:title');
  const ogDesc = metaValue(page.body, 'og:description');
  const ogImage = metaValue(page.body, 'og:image');
  const ogUrl = metaValue(page.body, 'og:url');
  const twitterCard = metaValue(page.body, 'twitter:card');
  if (!ogTitle) issues.push('缺 og:title');
  if (!ogDesc) issues.push('缺 og:description');
  if (!ogImage) issues.push('缺 og:image');
  if (!twitterCard) issues.push('缺 twitter:card');
  if (!twitterCard?.includes('summary_large_image')) issues.push(`twitter:card 非 large: ${twitterCard}`);

  /* 3. og:url 与请求 URL 归属一致（防止爬到别的页面） */
  if (ogUrl && !url.replace(/\/$/, '').includes(new URL(ogUrl).pathname.replace(/\/$/, ''))) {
    issues.push(`og:url 与页面路径不一致: ${ogUrl}`);
  }

  /* 4. og:image 可达性与合规性 */
  if (ogImage) {
    if (!/^https?:\/\//.test(ogImage)) {
      issues.push(`og:image 非绝对 URL: ${ogImage}`);
    } else {
      try {
        const imgRes = await fetch(ogImage, {
          headers: {'user-agent': 'Twitterbot/1.0'},
          redirect: 'follow',
          signal: AbortSignal.timeout(15000),
        });
        const buf = Buffer.from(await imgRes.arrayBuffer());
        if (imgRes.status !== 200) issues.push(`og:image HTTP ${imgRes.status}`);
        if (buf.length > MAX_IMAGE_BYTES) issues.push(`og:image 超 5MB (${(buf.length / 1024 / 1024).toFixed(1)}MB)`);
        /* PNG 头 + IHDR 尺寸（offset 16-24，big-endian） */
        const isPng = buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47;
        if (isPng) {
          const w = buf.readUInt32BE(16);
          const h = buf.readUInt32BE(20);
          if (w !== 1200 || h !== 630) issues.push(`og:image 尺寸 ${w}x${h}（X 推荐 1200x630）`);
        } else {
          issues.push('og:image 非 PNG 格式（X 支持 png/jpg/webp）');
        }
      } catch (e) {
        issues.push(`og:image 抓取失败 (${e.message})`);
      }
    }
  }

  /* 5. robots.txt 放行 */
  try {
    const robots = await fetchWithRedirects(`${SITE}/robots.txt`, {ua: 'Twitterbot/1.0'});
    if (!/User-agent:\s*\*\s*Allow:\s*\//.test(robots.body)) issues.push('robots.txt 可能屏蔽抓取');
  } catch {
    issues.push('robots.txt 不可达');
  }

  if (issues.length === 0) {
    log(true, `${label}: ${url}`);
    log(true, `   og:title=${ogTitle?.slice(0, 40)}…`);
    log(true, `   og:image=${ogImage}`);
    return true;
  }
  log(false, `${label}: ${url}`);
  issues.forEach((i) => log(false, `   - ${i}`));
  return false;
}

/* ---------------------------------------------------------------------------
 * 博客文章 → URL 解析（匹配 Docusaurus 3 默认 permalink 规则：
 *   显式 slug → /blog/<slug>；否则 → /blog/<YYYY>/<MM>/<DD>/<title>）
 * ------------------------------------------------------------------------- */
function resolveBlogUrls(slugArg) {
  const collect = (dir, base) => {
    const out = [];
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      if (!entry.isDirectory()) continue;
      const indexFile = path.join(dir, entry.name, 'index.md');
      if (!fs.existsSync(indexFile)) continue;
      const fm = fs.readFileSync(indexFile, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const fmObj = {};
      for (const line of (fm ? fm[1] : '').split('\n')) {
        const idx = line.indexOf(':');
        if (idx > 0 && !line.trim().startsWith('#')) fmObj[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      }
      const slug = fmObj.slug?.replace(/^\/+|\/+$/g, '') || entry.name.replace(/^\d{4}-\d{2}-\d{2}-/, '');
      const dateMatch = entry.name.match(/^(\d{4})-(\d{2})-(\d{2})-/);
      const url = fmObj.slug
        ? `${base}/${slug}`
        : dateMatch
          ? `${base}/${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}/${slug}`
          : `${base}/${slug}`;
      out.push({slug, url});
    }
    return out;
  };
  const zh = collect(BLOG_DIR, `${SITE}/blog`);
  const en = collect(I18N_DIR, `${SITE}/en/blog`);
  return {zh, en};
}

/* ---------------------------------------------------------------------------
 * 主流程
 * ------------------------------------------------------------------------- */
async function main() {
  const args = process.argv.slice(2);
  let targets = [];

  if (args.length === 0) {
    const {zh, en} = resolveBlogUrls();
    targets = [...zh.map((t) => ({url: t.url, label: t.slug})), ...en.map((t) => ({url: t.url, label: `${t.slug} (en)`}))];
  } else if (/^https?:\/\//.test(args[0])) {
    targets = [{url: args[0], label: 'URL'}];
  } else {
    const isEn = args.includes('--en');
    const {zh, en} = resolveBlogUrls();
    const pool = isEn ? en : zh;
    const hits = pool.filter((t) => t.slug.includes(args[0]));
    if (hits.length === 0) {
      console.error(`❌ 未找到匹配 slug「${args[0]}」的文章`);
      process.exit(2);
    }
    targets = hits.map((t) => ({url: t.url, label: isEn ? `${t.slug} (en)` : t.slug}));
  }

  console.log(`🔍 OG 卡片链路核验 ${targets.length} 个页面\n`);
  let pass = 0;
  for (const t of targets) {
    if (await verifyUrl(t.url, t.label)) pass++;
  }
  console.log(`\n📊 结果: ${pass}/${targets.length} 通过`);
  process.exit(pass === targets.length ? 0 : 1);
}

main().catch((e) => {
  console.error('❌ 核验器异常:', e);
  process.exit(1);
});
