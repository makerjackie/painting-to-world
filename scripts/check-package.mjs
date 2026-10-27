#!/usr/bin/env node
/** Package/static validation only. Browser evidence lives in each example QA directory. */
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let results=[];const check=(name,pass,detail='')=>results.push({name,pass:!!pass,detail});
const text=async p=>fs.readFile(path.join(root,p),'utf8');
async function exists(p){return fs.stat(path.join(root,p)).then(s=>s.isFile()&&s.size>0).catch(()=>false);}
async function walk(dir){let all=[];for(const d of await fs.readdir(dir,{withFileTypes:true})){let p=path.join(dir,d.name);if(d.isSymbolicLink())all.push(p);else if(d.isDirectory())all.push(...await walk(p));else all.push(p);}return all;}
try{
 for(const loc of ['zh-CN','en']){
  const base=`skills/${loc}/painting-to-world`;
  for(const f of ['SKILL.md','scripts/init.mjs','scripts/audit.mjs','assets/starter/src/engine.js','assets/starter/src/world.js','assets/starter/src/app.js','assets/starter/scripts/build.mjs'])check(`Exists ${base}/${f}`,await exists(`${base}/${f}`));
  let skill=await text(`${base}/SKILL.md`);
  check(`${loc} frontmatter and canonical name`,skill.startsWith('---\n')&&/^name: painting-to-world$/m.test(skill)&&/^description: .+/m.test(skill));
  check(`${loc} main instructions under 500 lines`,skill.split('\n').length<500);
  for(const f of ['GUIDE','PRODUCT','PROMPTS','DEVELOPMENT','PROVENANCE','QA'])check(`Bilingual document ${loc}/${f}`,await exists(`docs/${loc}/${f}.md`));
  for(const f of ['01-hero','02-guide','03-product','04-case'])for(const ext of ['html','png'])check(`Marketing ${loc}/${f}.${ext}`,await exists(`marketing/${loc}/${f}.${ext}`));
 }
 for(const scene of ['cafe-terrace','the-scream']){
  for(const locale of ['','en.']){
   const fn=`examples/${scene}/index.${locale}html`;check(`Exists ${fn}`,await exists(fn));const html=await text(fn);
   check(`${fn} full offline renderer`,html.length>45000&&/getContext\(['"]webgl2['"]/.test(html)&&/DEPTH_TEST/.test(html));
   check(`${fn} no unfilled slots`,!/\/\*(STYLE|ENGINE|TEXTURES|WORLD|AUDIO|APP)\*\//.test(html));
   check(`${fn} no remote scripts`,!/<script[^>]+src\s*=/i.test(html));
   check(`${fn} no external stylesheet`,!/<link[^>]+rel=["']stylesheet/i.test(html));
   check(`${fn} requested language`,html.includes(locale?'lang="en"':'lang="zh-CN"'));
   let n=0;for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){new vm.Script(m[1]);n++;}check(`${fn} inline JS syntax`,n>0);
  }
  check(`${scene} portable builder`,(await text(`examples/${scene}/scripts/build.mjs`)).includes('import.meta.url')&&!(await text(`examples/${scene}/scripts/build.mjs`)).includes('/mnt/data/'));
 }
 check('Offline package portal',await exists('START-HERE.html'));
 const files=await walk(root);
 const banned=files.filter(p=>/\.(ttf|otf|woff2?|ttc)$/i.test(p)||p.split(path.sep).some(s=>['node_modules','.git','__pycache__'].includes(s)));
 check('No font binaries, dependency trees or caches',banned.length===0,banned.map(p=>path.relative(root,p)).join(', '));
 console.log(JSON.stringify({scope:'static package checks, not visual QA',results},null,2));
 process.exitCode=results.every(r=>r.pass)?0:1;
}catch(e){console.error(e.stack);process.exitCode=1;}
