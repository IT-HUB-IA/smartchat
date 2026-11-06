import {build} from 'esbuild';
import {readFile,writeFile,copyFile} from 'node:fs/promises';
import path from 'node:path';
const result=await build({entryPoints:['src/main.jsx'],tsconfigRaw:{},bundle:true,outfile:'public/app.js',minify:true,jsx:'automatic',metafile:true,alias:{'@':path.resolve('vendor/tarefas'),react:path.resolve('node_modules/react'),'react-dom':path.resolve('node_modules/react-dom')},define:{'process.env.NODE_ENV':'"production"'}});
await writeFile('public/app.css',(await readFile('public/app.css','utf8'))+'\n'+await readFile('src/pacote-layout.css','utf8'));
await copyFile('src/smartchat-tokens.css','public/assets/smartchat-tokens.css');
await writeFile('public/origem-componentes.json',JSON.stringify(result.metafile,null,2));
console.log('Interface web compilada. API e worker permanecem na VPS.');
