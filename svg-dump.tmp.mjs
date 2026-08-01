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
  h('div', {style: {position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex'}}, [
    h('div', {style: {position: 'absolute', right: 100, top: 66, width: 320, height: 320, borderRadius: 64, background: '#4F46E5'}}),
  ]),
]);
const svg = await satori(jsx, {width: 1200, height: 630, fonts: FONTS});
console.log('SVG 长度:', svg.length);
console.log(svg.slice(0, 3000));
