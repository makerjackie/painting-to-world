#!/usr/bin/env node
/** Static checks only. No assertion about artistic quality or browser behavior. */
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(process.argv[2]||'.');
const results=[];const check=(name,pass,details='')=>results.push({name,pass:!!pass,details});
try{
 for(const f of ['index.html','src/engine.js','src/textures.js','src/world.js','src/audio.js','src/app.js','src/index.template.html','src/style.css','scripts/build.mjs'])check('exists '+f,await fs.stat(path.join(root,f)).then(s=>s.isFile()).catch(()=>false));
 const html=await fs.readFile(path.join(root,'index.html'),'utf8');
 check('no unresolved template slots',!html.match(/\/\*(STYLE|ENGINE|TEXTURES|WORLD|AUDIO|APP)\*\//));
 check('no remote script tag',!/<script[^>]+src\s*=\s*["']https?:/i.test(html));
 check('no remote CSS import',!/@import\s+(url\()?\s*["']?https?:/i.test(html));
 check('WebGL2 renderer requested',/getContext\(['"]webgl2['"]/.test(html));
 check('depth buffer enabled',/DEPTH_TEST/.test(html));
 let i=0;for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){i++;try{new vm.Script(m[1]);check('inline script syntax '+i,true);}catch(e){check('inline script syntax '+i,false,e.message);}}
 check('inline application present',i>0);
 const build=await fs.readFile(path.join(root,'scripts/build.mjs'),'utf8');
 check('relocatable build',!build.includes('/mnt/data/')&&build.includes('import.meta.url'));
 console.log(JSON.stringify({scope:'static only; not visual/runtime QA',results},null,2));
 if(results.some(r=>!r.pass))process.exitCode=1;
}catch(e){console.error(e.message);process.exitCode=1;}
