#!/usr/bin/env node
/** Copy a working baseline; does NOT convert an image to geometry. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const skill=path.resolve(here,'..');
try {
 const args=process.argv.slice(2); const destArg=args[0];
 if(!destArg || destArg.startsWith('--')) throw new Error('Usage: node scripts/init.mjs NEW_PROJECT [--reference IMAGE]');
 const dest=path.resolve(destArg);
 const existing=await fs.stat(dest).catch(()=>null);
 if(existing && (!existing.isDirectory() || (await fs.readdir(dest)).length)) throw new Error('Destination must be absent or empty. Existing work will not be overwritten.');
 let reference=null;
 if(args.length>1){if(args.length!==3||args[1]!=='--reference') throw new Error('Unknown arguments. Use --reference IMAGE.');reference=path.resolve(args[2]);const st=await fs.stat(reference);if(!st.isFile())throw new Error('Reference must be a file.');if(!/\.(png|jpe?g|webp)$/i.test(reference))throw new Error('Use PNG, JPG or WEBP.');}
 await fs.mkdir(dest,{recursive:true});
 await fs.cp(path.join(skill,'assets/starter'),dest,{recursive:true});
 await fs.mkdir(path.join(dest,'design'),{recursive:true});
 await fs.copyFile(path.join(skill,'references/analysis-template.md'),path.join(dest,'design/painting-analysis.md'));
 if(reference){await fs.mkdir(path.join(dest,'reference'),{recursive:true});await fs.copyFile(reference,path.join(dest,'reference',path.basename(reference)));}
 await fs.writeFile(path.join(dest,'TASK.md'),'# Required next step / 下一步\n\nThis scaffold is the café baseline, not a conversion of the supplied image. Read the painting-to-world SKILL.md and reauthor the scene, textures, camera, copy and source notes before claiming completion.\n\n此脚手架仍为咖啡座底座，不是上传图的重建结果。必须按 Skill 分析并重新实现。\n');
 console.log(`Created ${dest}\nNext: have your image-capable coding agent read SKILL.md and TASK.md.\nBuild: node "${path.join(dest,'scripts/build.mjs')}"`);
} catch(error){console.error(error.message);process.exitCode=1;}
