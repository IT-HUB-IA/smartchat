const FAIXAS = [
  ['ferro', 'Ferro', 'Até R$ 20 mil', 'Até 20k', 1, 50],
  ['bronze', 'Bronze', 'R$ 20 a 50 mil', '20k-50k', 1, 22],
  ['prata', 'Prata', 'R$ 50 a 100 mil', '50k-100k', 2, 21],
  ['ouro', 'Ouro', 'R$ 100 a 300 mil', '100k-300k', 2, 21],
  ['platina', 'Platina', 'R$ 300 a 500 mil', '300k-500k', 3, 3],
  ['diamante', 'Diamante', 'Acima de R$ 500 mil', 'Acima de 500k', 3, 3],
  ['sem', 'Sem faixa', 'Faturamento não apurado', 'Faturamento não apurado', 0, 12],
];
document.getElementById('faixas-etq').innerHTML = FAIXAS.map(([id, nome, faixa, , nivel]) =>
  `<span class="faixa" data-faixa="${id}">${nome} <small>${faixa}</small></span>`).join('');

const linhas = escolhida => FAIXAS.map(([id, nome, , curta, , qtd]) =>
  `<button class="selecao-opcao c4-fx" type="button" data-faixa="${id}" aria-pressed="${id === escolhida}"><span class="selecao-marca"></span><span class="c4-fx-nome"><b>${nome}</b><small>${curta}</small></span>
  <span class="c4-fx-qtd"><i class="c4-fx-ponto"></i><svg class="ico" data-anima aria-hidden="true"><use href="#user"/></svg><b class="numero">${id === 'sem' ? '' : qtd}</b></span></button>`).join('')
  + '<button class="selecao-opcao selecao-acao c4-fx-limpar" type="button" data-limpar>Limpar filtro</button><button class="btn btn-p" type="button" data-aplicar>Aplicar</button>';

function ligar(raiz, escolhida) {
  raiz.innerHTML = linhas(escolhida);
  raiz.addEventListener('click', e => {
    const o = e.target.closest('.c4-fx');
    if (o) { raiz.querySelectorAll('.c4-fx').forEach(x => x.setAttribute('aria-pressed', x === o)); return; }
    if (e.target.closest('[data-limpar]')) raiz.querySelectorAll('.c4-fx').forEach(x => x.setAttribute('aria-pressed', 'false'));
    if (e.target.closest('[data-aplicar]') && raiz.parentElement.matches('[popover]')) {
      const on = raiz.querySelector('.c4-fx[aria-pressed="true"] b');
      document.getElementById('fx-rotulo').textContent = on ? on.textContent : 'Faixa';
      raiz.parentElement.hidePopover();
    }
  });
}
ligar(document.getElementById('fx-viva'), null);
ligar(document.getElementById('fx-estatica'), 'ouro');
