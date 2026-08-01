import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import {Resvg} from '@resvg/resvg-js';
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

function Decor() {
  return [
    h('div', {style: {position: 'absolute', right: 100, top: 66, width: 320, height: 320, borderRadius: 64, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', transform: 'rotate(8deg)', boxShadow: '0 28px 56px rgba(79,70,229,0.30)'}}),
    h('div', {style: {position: 'absolute', right: 176, top: 96, width: 88, height: 88, borderRadius: 18, background: '#2563EB', transform: 'rotate(-14deg)', boxShadow: '0 12px 24px rgba(37,99,235,0.35)'}}),
    h('div', {style: {position: 'absolute', right: 250, bottom: 74, width: 160, height: 160, borderRadius: 34, background: 'linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)', transform: 'rotate(-6deg)', boxShadow: '0 16px 32px rgba(13,148,136,0.32)'}}),
    h('div', {style: {position: 'absolute', right: 436, top: 140, width: 96, height: 96, borderRadius: 48, border: '20px solid rgba(124,58,237,0.32)'}}),
    h('div', {style: {position: 'absolute', right: 44, bottom: 74, width: 210, height: 26, borderRadius: 13, background: 'linear-gradient(90deg, #F59E0B 0%, #F97316 100%)', transform: 'rotate(-4deg)'}}),
    h('div', {style: {position: 'absolute', right: 116, top: 428, width: 30, height: 30, borderRadius: 15, background: '#F97316'}}),
    h('div', {style: {position: 'absolute', right: 322, bottom: 148, width: 24, height: 24, borderRadius: 12, background: '#06B6D4'}}),
  ];
}

const jsx = h('div', {
  style: {width: 1200, height: 630, display: 'flex', position: 'relative', background: 'linear-gradient(118deg, #E8F0FE 0%, #EFEBFB 46%, #DFF3EF 100%)'},
}, [
  ...Decor(),
  h('div', {style: {position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 64, paddingRight: 440, width: '100%', height: '100%'}}, [
    h('div', {style: {fontSize: 60, fontWeight: 700, color: '#1e293b', lineHeight: 1.38, maxWidth: 720}}),
  ]),
]);
const svg = await satori(jsx, {width: 1200, height: 630, fonts: FONTS});
const png = new Resvg(svg, {fitTo: {mode: 'width', value: 1200}}).render().asPng();
fs.writeFileSync('/tmp/og-analysis/t6-full-decor.png', png);
console.log('t6 OK');
