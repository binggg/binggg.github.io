import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import satori from 'satori';
import {Resvg} from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = '/Users/bookerzhao/Projects/AI-Workspace/binggg.github.io/scripts/og-fonts';
const readFont = (file) => fs.readFileSync(path.join(FONT_DIR, file));
const FONTS = [
  {name: 'Noto Sans CJK SC', data: readFont('NotoSansCJKsc-Regular.otf'), weight: 400, style: 'normal'},
  {name: 'Noto Sans CJK SC', data: readFont('NotoSansCJKsc-Bold.otf'), weight: 700, style: 'normal'},
];
const h = (type, props = {}, ...children) => {
  const flat = children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false);
  const kids = flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat;
  return {type, props: {...props, children: kids}};
};

async function test(name, Decor) {
  const jsx = h('div', {
    style: {
      width: 1200, height: 630, display: 'flex', position: 'relative',
      background: 'linear-gradient(118deg, #E8F0FE 0%, #EFEBFB 46%, #DFF3EF 100%)',
    },
  }, [
    h('div', {style: {position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex'}}, Decor()),
  ]);
  try {
    const svg = await satori(jsx, {width: 1200, height: 630, fonts: FONTS});
    const png = new Resvg(svg, {fitTo: {mode: 'width', value: 1200}}).render().asPng();
    fs.writeFileSync(`/tmp/og-analysis/${name}.png`, png);
    console.log(name, 'OK');
  } catch (e) { console.log(name, 'FAIL:', e.message.slice(0, 300)); }
}

// A: 纯色块无 transform/shadow
await test('A-plain', () => h('div', {style: {position: 'absolute', right: 100, top: 66, width: 320, height: 320, borderRadius: 64, background: '#4F46E5'}}));
// B: + transform
await test('B-transform', () => h('div', {style: {position: 'absolute', right: 100, top: 66, width: 320, height: 320, borderRadius: 64, background: '#4F46E5', transform: 'rotate(8deg)'}}));
// C: + boxShadow
await test('C-shadow', () => h('div', {style: {position: 'absolute', right: 100, top: 66, width: 320, height: 320, borderRadius: 64, background: '#4F46E5', boxShadow: '0 28px 56px rgba(79,70,229,0.30)'}}));
