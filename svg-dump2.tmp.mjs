import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
const readFont = (file) => fs.readFileSync(path.join(process.cwd(), 'scripts/og-fonts', file));
const FONTS = [
  {name: 'Noto Sans CJK SC', data: readFont('NotoSansCJKsc-Regular.otf'), weight: 400, style: 'normal'},
  {name: 'Noto Sans CJK SC', data: readFont('NotoSansCJKsc-Bold.otf'), weight: 700, style: 'normal'},
];
const h = (type, props = {}, ...children) => {
  const flat = children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false);
  const kids = flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat;
  return {type, props: {...props, children: kids}};
};
const jsx = h('div', {
  style: {width: 1200, height: 630, display: 'flex', position: 'relative', background: 'linear-gradient(118deg, #E8F0FE 0%, #EFEBFB 46%, #DFF3EF 100%)'},
}, [
  // 色块直接作为 root children（absolute 相对 root 定位）
  h('div', {style: {position: 'absolute', right: 100, top: 66, width: 320, height: 320, borderRadius: 64, background: '#4F46E5', transform: 'rotate(8deg)', boxShadow: '0 28px 56px rgba(79,70,229,0.30)'}}),
  h('div', {style: {position: 'absolute', right: 250, bottom: 74, width: 160, height: 160, borderRadius: 34, background: '#0D9488'}}),
]);
const svg = await satori(jsx, {width: 1200, height: 630, fonts: FONTS});
console.log('SVG 长度:', svg.length);
// 打印所有 path/transform/filter 关键片段
console.log((svg.match(/<path[^>]*>/g) || []).map(p => p.slice(0, 200)).join('\n---\n'));
console.log('---filter/transform---');
console.log((svg.match(/transform="[^"]*"/g) || []).slice(0, 5).join('\n'));
console.log((svg.match(/<filter[^>]*>/g) || []).slice(0, 3).join('\n'));
