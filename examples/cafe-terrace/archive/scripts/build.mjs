/* No package installation required. Node.js >= 18. */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let html=await readFile(path.join(root,'src/index.template.html'),'utf8');
for(const [token,file] of Object.entries({STYLE:'style.css',ENGINE:'engine.js',TEXTURES:'textures.js',WORLD:'world.js',AUDIO:'audio.js',APP:'app.js'})){
 const src=await readFile(path.join(root,'src',file),'utf8');html=html.replace(`/*${token}*/`,()=>src.replaceAll('</script','<\\/script'));
}
await writeFile(path.join(root,'index.html'),html);
console.log(`Built index.html (${(Buffer.byteLength(html)/1024).toFixed(1)} KB), zero runtime dependencies.`);
