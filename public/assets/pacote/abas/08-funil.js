(function () {
  const D = window.FUNIL_DADOS;
  const ico = n => `<svg class="ico"${n === 'pencil' ? ' data-anima' : ''} aria-hidden="true"><use href="#${n}"/></svg>`;
  const ETAPA = { novo: 'novo', qualificacao: 'qualificacao', reuniao: 'reuniao', faltou: 'nao-compareceu', negociacao: 'negociacao', followup: 'follow' };
  const MAX = 10;
  const RESP = [{ id: 'natham', nome: 'Natham Monteiro', av: 'homem' }, { id: 'larissa', nome: 'Larissa Prado', av: 'mulher' }];
  const FAIXAS = [['ferro', 'Ferro até R$ 20 mil'], ['bronze', 'Bronze R$ 20 a 50 mil'], ['prata', 'Prata R$ 50 a 100 mil'], ['ouro', 'Ouro R$ 100 a 300 mil'], ['platina', 'Platina R$ 300 a 500 mil'], ['diamante', 'Diamante acima de R$ 500 mil'], ['sem', 'Sem faixa (não apurado)']];
  // exemplo: responsável e dias desde a entrada do lead (30/10/2026)
  D.leads.forEach(l => { l.resp = l.resp || RESP[l.id % 2].id; l.dias = l.dias ?? (l.id * 3) % 40; l.faixa = l.faixa || FAIXAS[(l.id * 5) % 7][0]; });
  const ORIGENS = { meta: 'Meta', google: 'Google', 'google-organico': 'Google orgânico', whatsapp: 'WhatsApp', site: 'Site', bio: 'Bio', indicacao: 'Indicação' };
  const PERIODOS = [['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias']];
  const filtro = { faixa: new Set(), origem: new Set(), periodo: new Set(), busca: '' };
  const passa = l => (!filtro.origem.size || filtro.origem.has(l.origem)) && (!filtro.faixa.size || filtro.faixa.has(l.faixa)) && (!filtro.periodo.size || [...filtro.periodo].some(p => l.dias <= +p))
    && (!filtro.busca || l.nome.toLowerCase().includes(filtro.busca));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const brl = n => n.toLocaleString('pt-BR');

  function avatar(l) {
    return l.avatar
      ? `<span class="avatar avatar-m"><img src="../icones/avatares/${l.avatar}.svg" alt=""></span>`
      : `<span class="avatar avatar-m">${esc(l.iniciais || l.nome.slice(0, 2).toUpperCase())}</span>`;
  }
  function card(l) {
    const info = l.reuniao ? `<div class="fn-info">${ico('clock')}Reunião: ${esc(l.reuniao)}</div>` : '';
    const fu = l.ultima ? `<div class="fn-info">Última: ${l.ultima} · Próxima: <span class="${l.atrasada ? 'fn-atrasada' : ''}">${l.proxima}${l.atrasada ? ' (atrasada)' : ''}</span></div>` : '';
    return `<article class="fn-card${l.destaque ? ' fn-destaque' : ''}" data-id="${l.id}">
      <div class="fn-card-topo">${avatar(l)}<span class="fn-nome" title="${esc(l.nome)}">${esc(l.nome)}</span><span class="avatar avatar-p" title="Responsável: ${RESP.find(r => r.id === l.resp).nome}"><img src="../icones/avatares/${RESP.find(r => r.id === l.resp).av}.svg" alt=""></span></div>
      <div class="fn-valor">R$ ${brl(l.valor)}<small>/mês</small></div>${info}${fu}
      <div class="contador"><span class="contador-rotulo">Contatos: <b>${l.contatos}</b>/${MAX}</span>
        <button class="contador-btn" type="button" data-acao="menos" aria-label="Menos um contato"${l.contatos <= 0 ? ' disabled' : ''}>${ico('minus')}</button>
        <button class="contador-btn" type="button" data-acao="mais" aria-label="Mais um contato"${l.contatos >= MAX ? ' disabled' : ''}>${ico('plus')}</button></div>
      <div class="fn-pe"><img src="../icones/origens/${l.origem}.svg" alt="Origem: ${l.origem}"><a class="lnk" href="#" data-acao="ficha">Ver ficha</a><button class="btn btn-fantasma btn-icone" type="button" aria-label="Editar lead">${ico('pencil')}</button></div>
    </article>`;
  }
  function coluna(e, leads) {
    const corpo = leads.length ? leads.map(card).join('') : '<div class="fn-vazio">Nenhum lead nesta etapa.<br>Arraste um card para cá.</div>';
    return `<section class="fn-col" data-etapa="${ETAPA[e.id]}" data-col="${e.id}"><header class="fn-col-cab"><span class="fn-col-nome">${esc(e.nome)}</span><span class="fn-col-n">${leads.length}</span></header><div class="fn-col-corpo">${corpo}</div></section>`;
  }

  const quadro = document.getElementById('fn-quadro');
  function render() {
    quadro.innerHTML = D.etapas.map(e => coluna(e, D.leads.filter(l => l.etapa === e.id && passa(l)))).join('');
    document.getElementById('fn-resumo').textContent = `${D.total.abertos} negócios em aberto · R$ ${brl(D.total.mes)}/mês no funil (${D.leads.filter(passa).length} de ${D.leads.length} leads de exemplo na tela)`;
  }
  render();

  // lista do filtro: seleção múltipla da base, um grupo por critério; a lista fica aberta enquanto se marca
  const GRUPOS = [
    ['faixa', 'Faturamento', FAIXAS],
    ['origem', 'Origem', Object.entries(ORIGENS)],
    ['periodo', 'Período', PERIODOS]
  ];
  const lista = document.getElementById('fn-filtro-lista');
  // faixa: etiqueta da base; origem: logo ao lado do nome
  const rotulo = (k, v, t) => {
    if (k === 'faixa') { const [nome, ...resto] = t.split(' '); return `<span class="faixa" data-faixa="${v}">${nome}${v === 'sem' ? ' ' + resto.join(' ') : ` <small>${esc(resto.join(' '))}</small>`}</span>`; }
    if (k === 'origem') return `<span class="fn-forigem"><img src="../icones/origens/${v}.svg" alt="">${esc(t)}</span>`;
    return esc(t);
  };
  function renderFiltro() {
    const n = GRUPOS.reduce((t, g) => t + filtro[g[0]].size, 0);
    lista.innerHTML = GRUPOS.map(([k, nome, ops]) => `<div class="fn-fgrupo">${nome}</div>` + ops.map(([v, t]) => `<button class="selecao-opcao" type="button" data-g="${k}" data-v="${v}" aria-pressed="${filtro[k].has(v)}"><span class="selecao-marca"></span><span class="selecao-opcao-rotulo">${rotulo(k, v, t)}</span></button>`).join('')).join('')
      + `<button class="selecao-opcao selecao-acao" type="button" data-limpar${n ? '' : ' disabled'}>Limpar filtros</button>`;
    const c = document.getElementById('fn-filtro-n'); c.hidden = !n; c.textContent = n;
  }
  lista.addEventListener('click', ev => {
    const b = ev.target.closest('button'); if (!b) return;
    if ('limpar' in b.dataset) GRUPOS.forEach(g => filtro[g[0]].clear());
    else { const set = filtro[b.dataset.g]; set.has(b.dataset.v) ? set.delete(b.dataset.v) : set.add(b.dataset.v); }
    renderFiltro(); render();
  });
  document.getElementById('fn-busca').addEventListener('input', ev => { filtro.busca = ev.target.value.trim().toLowerCase(); render(); });
  renderFiltro();

  quadro.addEventListener('click', ev => {
    const b = ev.target.closest('[data-acao]'); if (!b) return;
    if (b.dataset.acao === 'ficha') return ev.preventDefault();
    const l = D.leads.find(x => x.id == b.closest('.fn-card').dataset.id);
    l.contatos = Math.max(0, Math.min(MAX, l.contatos + (b.dataset.acao === 'mais' ? 1 : -1)));
    render();
  });

  // arrastar com ponteiro: o card fica um fantasma e uma cópia com sombra segue o mouse
  let arr = null;
  const colSob = ev => document.elementsFromPoint(ev.clientX, ev.clientY).find(e => e.classList.contains('fn-col') && e.dataset.col);
  quadro.addEventListener('pointerdown', ev => {
    const c = ev.target.closest('.fn-card'); if (!c || ev.target.closest('button,a') || ev.button) return;
    const r = c.getBoundingClientRect();
    arr = { c, dx: ev.clientX - r.left, dy: ev.clientY - r.top, x: ev.clientX, y: ev.clientY, clone: null };
  });
  window.addEventListener('pointermove', ev => {
    if (!arr) return;
    if (!arr.clone) {
      if (Math.hypot(ev.clientX - arr.x, ev.clientY - arr.y) < 5) return;
      arr.clone = arr.c.cloneNode(true); arr.clone.classList.add('fn-arrastando'); document.body.appendChild(arr.clone); arr.c.classList.add('fn-fantasma');
    }
    arr.clone.style.left = ev.clientX - arr.dx + 'px'; arr.clone.style.top = ev.clientY - arr.dy + 'px';
    const alvo = colSob(ev);
    quadro.querySelectorAll('.fn-col').forEach(x => x.classList.toggle('fn-alvo', x === alvo));
  });
  window.addEventListener('pointerup', ev => {
    if (!arr) return;
    const a = arr; arr = null; if (!a.clone) return;
    a.clone.remove();
    const alvo = colSob(ev);
    if (alvo) D.leads.find(x => x.id == a.c.dataset.id).etapa = alvo.dataset.col;
    render();
  });

  // peças isoladas
  const L = id => D.leads.find(l => l.id === id);
  const put = (id, html) => { document.getElementById(id).innerHTML = html; };
  put('p-normal', card(L(3)));
  put('p-destaque', card(L(2)));
  put('p-reuniao', card(L(5)));
  put('p-follow', card(L(10)));
  put('p-arrasto', card(L(4)));
  put('p-vazia', coluna(D.etapas[3], []));
  put('p-contador', card({ ...L(1), id: 101, contatos: 0 }) + card({ ...L(1), id: 102, contatos: 10 }));
  put('p-cabecas', D.etapas.map((e, i) => `<section class="fn-col" data-etapa="${ETAPA[e.id]}"><header class="fn-col-cab"><span class="fn-col-nome">${esc(e.nome)}</span><span class="fn-col-n">${[17, 38, 6, 1, 9, 80][i]}</span></header></section>`).join(''));
  document.querySelectorAll('.fn-peca .fn-card').forEach(c => { c.style.cursor = 'default'; });
})();
