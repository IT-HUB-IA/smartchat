const clientes = [
  ['Junior', 'whatsapp', '17/08/2026', 13, 15],
  ['Alexandre Martins Rosangela Pace', 'meta', '01/10/2026', 5, 17],
  ['Vânia Souza', 'indicacao', '02/10/2026', 5, 17],
  ['Nicolas', 'bio', '08/10/2026', 4, 17],
  ['Julio Cotting', 'site', '09/10/2026', 4, 17],
  ['Vinicius Brindo', 'meta', '23/10/2026', 1, 17],
  ['Juliane Rodrigues', 'google', '29/10/2026', 0, 17],
].map(([nome, origem, fechamento, pct, faltam]) => ({ nome, origem, fechamento, pct, faltam, data: fechamento.split('/').reverse().join('') }));
const sufixo = { whatsapp: 'WhatsApp', meta: 'Meta', indicacao: 'Indicação', bio: 'Bio', site: 'Site', google: 'Google' };
const tbody = document.querySelector('#tabela-clientes tbody');
const chave = { nome: c => c.nome.toLowerCase(), fechamento: c => c.data, pct: c => c.pct };
let ord = { col: null, dir: 1 };

function desenhar() {
  const lista = clientes.map((c, i) => [c, i]);
  if (ord.col) lista.sort(([a], [b]) => (chave[ord.col](a) > chave[ord.col](b) ? 1 : -1) * ord.dir);
  tbody.innerHTML = lista.map(([c]) => `<tr>
    <td><span class="t10-cli">${avatarHTML(c.nome)}<a class="lnk-texto" href="#">${c.nome}</a></span></td>
    <td class="t10-centro"><img class="t10-origem" src="../icones/origens/${c.origem}.svg" alt="${sufixo[c.origem]}" title="${sufixo[c.origem]}"></td>
    <td class="t10-centro">${c.fechamento}</td>
    <td><div class="t10-contrato"><div class="t10-barra" role="img" aria-label="${c.pct}%"><i style="width:${Math.max(c.pct, 2)}%"></i></div><span class="card-fraco">${c.pct}% · Faltam ${c.faltam} meses</span></div></td>
    <td class="t10-dir"><span class="t10-acoes">
      <button class="btn btn-2 btn-icone btn-p" type="button" aria-label="Convidar ${c.nome} pelo WhatsApp"><svg class="ico" data-anima aria-hidden="true"><use href="#message-circle"/></svg></button>
      <button class="btn btn-2 btn-icone btn-p" type="button" aria-label="Criar lead indicado por ${c.nome}"><svg class="ico" data-anima aria-hidden="true"><use href="#plus"/></svg></button>
    </span></td></tr>`).join('');
}
document.querySelectorAll('.t10-ord').forEach(b => b.addEventListener('click', () => {
  ord = { col: b.dataset.col, dir: ord.col === b.dataset.col ? -ord.dir : 1 };
  document.querySelectorAll('#tabela-clientes th[aria-sort]').forEach(th => th.setAttribute('aria-sort', 'none'));
  b.closest('th').setAttribute('aria-sort', ord.dir === 1 ? 'ascending' : 'descending');
  desenhar();
}));
desenhar();
