// Copies the distributable TSX files into an isolated React page with no site stylesheet.
import fs from 'node:fs';
import path from 'node:path';
import { buildCopyableSources } from './build-copyable-sources.mjs';
await buildCopyableSources();
const directory = '.verification';
fs.mkdirSync(path.join(directory,'components'),{recursive:true});
const files=fs.readdirSync('src/library/distribution').filter(file=>file.endsWith('.tsx'));
for(const file of files)fs.copyFileSync(path.join('src/library/distribution',file),path.join(directory,'components',file));
fs.writeFileSync(path.join(directory,'index.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Standalone React component verification</title></head><body style="margin:24px;font-family:system-ui"><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>');
fs.copyFileSync('src/library/foundation.txt',path.join(directory,'foundation.css'));
const imports=files.map((file,i)=>`import C${i} from './components/${file}';`).join('\n');
const entries=files.map((file,i)=>`<section key="${file}" data-verification-id="${file.replace('.tsx','')}"><h2 style={{fontSize:14,fontWeight:500}}>${file.replace('.tsx','')}</h2><C${i}/></section>`).join('\n');
fs.writeFileSync(path.join(directory,'main.tsx'),`import './foundation.css';\nimport { createRoot } from 'react-dom/client';\n${imports}\ncreateRoot(document.getElementById('root')!).render(<><h1>Copied TSX · React + Tailwind foundation · No site CSS</h1><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:24}}>${entries}</div></>);`);
console.log(`Prepared ${files.length} copied components at /.verification/index.html`);
