// Gera base/icones.js a partir de icones/ui/*.svg. Rodar de novo ao pôr ícone novo: node base/gerar-icones.js
// O sprite vai dentro do JS (e não lido com fetch) para funcionar também abrindo o arquivo direto (file://).
const fs = require('fs'), path = require('path');
const pasta = path.join(__dirname, '..', 'icones', 'ui');
const simbolos = fs.readdirSync(pasta).filter(f => f.endsWith('.svg')).sort().map(f => {
  const svg = fs.readFileSync(path.join(pasta, f), 'utf8');
  const vb = (svg.match(/viewBox="([^"]+)"/) || [, '0 0 24 24'])[1];
  const miolo = svg.replace(/<!--[\s\S]*?-->/g, '').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s+/g, ' ').trim();
  return `<symbol id="${f.replace('.svg', '')}" viewBox="${vb}">${miolo}</symbol>`;
});
const js = `/* CRM padrão · base/icones.js · GERADO por base/gerar-icones.js (não editar à mão). Dono: Alicerce
   Põe no começo do <body> um sprite com os ${simbolos.length} ícones de icones/ui/. Uso: <svg class="ico" aria-hidden="true"><use href="#nome"/></svg>
   (nome = arquivo sem .svg). Cor herdada (currentColor); traço e tamanho vêm do .ico. Carregar no <head> ou no <body>. */
(function () {
  var s = ${JSON.stringify('<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' + simbolos.join('') + '</svg>')};
  function por() { if (!document.getElementById('crm-icones')) { document.body.insertAdjacentHTML('afterbegin', s); document.body.firstElementChild.id = 'crm-icones'; } }
  if (document.body) por(); else document.addEventListener('DOMContentLoaded', por);
})();
`;
fs.writeFileSync(path.join(__dirname, 'icones.js'), js);
console.log(simbolos.length + ' ícones');
