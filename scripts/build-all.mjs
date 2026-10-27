#!/usr/bin/env node
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const name of ['cafe-terrace','the-scream']){
 const result=spawnSync(process.execPath,[path.join(root,'examples',name,'scripts/build.mjs')],{cwd:root,stdio:'inherit'});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status||1);
}
console.log('Built both worlds in Chinese and English. / 两个案例的中英文页面已构建。');
