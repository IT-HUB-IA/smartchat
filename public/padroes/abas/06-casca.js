// Aba 6 Casca: monta menus (A vidro claro, B escuro fixo), topo, abas, migalha e paginação com dados fictícios de out/2026.
(function () {
  var html = document.documentElement, uid = 0;
  function ic(n, c) { return '<svg class="' + (c || 'ico') + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + n + '"/></svg>'; }
  var ITENS = [['dashboard', 'layout-dashboard', 'Dashboard'], ['agenda', 'calendar-days', 'Agenda'], ['funil', 'funnel', 'Funil'], ['clientes', 'users', 'Clientes'], ['whatsapp', 'message-circle', 'WhatsApp', '12']];

  // ---------- menu ----------
  function menu(v, rec, ativo) {
    var navs = ITENS.map(function (i) {
      return '<a class="mn-item" href="#" data-id="' + i[0] + '" title="' + i[2] + '"' + (i[0] === ativo ? ' aria-current="page"' : '') + '>' + ic(i[1]) +
        '<span class="mn-rotulo">' + i[2] + '</span>' + (i[3] ? '<span class="mn-badge" aria-label="' + i[3] + ' novas">' + i[3] + '</span>' : '') + '</a>';
    }).join('');
    return '<aside class="mn mn-' + v + (rec ? ' mn-rec' : '') + '"' + (v === 'B' ? ' data-tema="escuro"' : '') + ' aria-label="Menu">' +
      '<div class="mn-topo"><img class="mn-logo" data-forma="' + (rec ? 'icone' : 'logo') + '" alt="Logo da empresa" height="26"><span class="mn-sep" aria-hidden="true"></span><span class="mn-crm">CRM</span></div>' +
      '<button class="mn-recolher" type="button" aria-label="' + (rec ? 'Abrir menu' : 'Recolher menu') + '" aria-expanded="' + (!rec) + '">' + ic('chevron-left') + '</button>' +
      '<p class="mn-secao">Operação</p><nav class="mn-nav" aria-label="Principal">' + navs + '</nav>' +
      '<div class="mn-pe">' +
        '<label class="interruptor mn-modo"><input type="checkbox" role="switch" aria-label="Modo escuro"><span class="interruptor-trilho"></span><span class="mn-rotulo">Modo escuro</span></label>' +
        '<div class="mn-pessoa"><span class="avatar avatar-p" aria-hidden="true">NM</span><b class="mn-rotulo">Natham Monteiro</b></div>' +
        '<a class="mn-item mn-item-p" href="#" title="Trocar senha">' + ic('lock') + '<span class="mn-rotulo">Trocar senha</span></a>' +
        '<a class="mn-item mn-item-p" href="#" title="Sair da conta">' + ic('log-out') + '<span class="mn-rotulo">Sair da conta</span></a>' +
        '<p class="mn-rodape">Grupo You · uso interno</p>' +
      '</div></aside>';
  }
  function palco(el, v, rec) {
    el.innerHTML = menu(v, rec, 'dashboard') + '<div class="cs-fundo" aria-hidden="true"><i></i><i></i><i></i><i></i></div>';
  }
  document.querySelectorAll('[data-menu]').forEach(function (p) { palco(p, p.dataset.menu, p.hasAttribute('data-recolhido')); });

  document.addEventListener('click', function (e) {
    var mn = e.target.closest('.mn'); if (!mn) return;
    if (e.target.closest('.mn-recolher')) {
      var rec = mn.classList.toggle('mn-rec'), b = mn.querySelector('.mn-recolher');
      b.setAttribute('aria-expanded', String(!rec)); b.setAttribute('aria-label', rec ? 'Abrir menu' : 'Recolher menu');
      mn.querySelector('.mn-logo').dataset.forma = rec ? 'icone' : 'logo'; logos();
    } else if (e.target.closest('.mn-nav .mn-item')) {
      e.preventDefault(); var it = e.target.closest('.mn-item');
      mn.querySelectorAll('.mn-nav .mn-item').forEach(function (x) { x.removeAttribute('aria-current'); });
      it.setAttribute('aria-current', 'page');
    } else if (e.target.closest('.mn-item')) e.preventDefault();
  });

  // logo da empresa + versão para fundo escuro (a Beec roxa some no escuro)
  function logos() {
    var emp = html.dataset.empresa === 'beec' ? 'beec' : 'you';
    document.querySelectorAll('.mn-logo').forEach(function (img) {
      var esc = !!img.closest('[data-tema="escuro"]');
      var forma = img.dataset.forma;
      var arq = forma === 'icone' ? (esc ? (emp === 'beec' ? 'beec-icone-claro' : 'you-icone-claro') : emp) : emp + '-logo' + (esc ? '-claro' : '');
      img.src = '../icones/empresas/' + arq + '.svg';
    });
    document.querySelectorAll('.mn-B').forEach(function (m) { m.dataset.empresa = html.dataset.empresa || 'nevoa'; });
  }
  document.addEventListener('crm:tema', logos);
  // o interruptor do menu liga o modo escuro pela chave do topo da página e acompanha ela
  document.addEventListener('change', function (e) {
    if (!e.target.closest('.mn-modo')) return;
    var alvo = document.querySelector('.casca-chave button[data-valor="' + (e.target.checked ? 'escuro' : 'claro') + '"]'); if (alvo) alvo.click();
  });
  function modos() { document.querySelectorAll('.mn-modo input').forEach(function (i) { i.checked = html.dataset.tema === 'escuro'; }); }
  document.addEventListener('crm:tema', modos);


  // ---------- topo ----------
  var ATIV = [['user-plus', 'Novo lead: Delma Souza (Meta)', 'há 3 min'], ['calendar-days', 'Reunião hoje 14h30 com Ótica São Benedito', 'em 2 h'], ['message-circle', 'Juliana Rodrigues respondeu no WhatsApp', 'há 12 min'], ['clock', 'Marcos Lima sem resposta há 2 dias', 'ontem'], ['tag', 'Contrato da Padaria Pão Dourado vence em 5 dias', '25/10']];
  function popNotif(id) {
    return '<div id="' + id + '" popover class="selecao-pop" style="position-anchor:--' + id + '"><div class="selecao-lista">' +
      ATIV.map(function (a) { return '<button class="selecao-opcao cs-ativ" type="button">' + ic(a[0]) + '<span class="selecao-opcao-rotulo">' + a[1] + '</span><span class="card-fraco">' + a[2] + '</span></button>'; }).join('') +
      '<button class="selecao-opcao selecao-acao" type="button">Ver todas as atividades</button></div></div>';
  }
  function topo(cel) {
    var n = 'pn' + (++uid), m = 'pm' + uid;
    var tit = '<div class="cs-tit"><h2>Dashboard</h2><p class="card-fraco">You Contabilidade · 01/10/2026 a 30/10/2026 (30 dias)</p></div>';
    var som = '<button class="btn btn-2 btn-icone cs-som" type="button" aria-label="Som das notificações ligado" aria-pressed="true">' + ic('volume-2') + '</button>';
    if (cel) {
      return tit + '<div class="cs-acoes">' +
        '<button class="btn btn-2 cs-notif" type="button" popovertarget="' + n + '" style="anchor-name:--' + n + '" aria-label="154 novas atividades">' + ic('bell') + '<b class="numero">154</b></button>' + popNotif(n) + som +
        '<button class="btn btn-2 btn-icone" type="button" popovertarget="' + m + '" style="anchor-name:--' + m + '" aria-label="Mais ações">' + ic('ellipsis') + '</button>' +
        '<div id="' + m + '" popover class="selecao-pop" style="position-anchor:--' + m + '"><div class="selecao-lista"><button class="selecao-opcao" type="button">Dores dos leads</button><button class="selecao-opcao" type="button">Ver agenda</button><button class="selecao-opcao selecao-acao" type="button">Abrir funil</button></div></div></div>';
    }
    return tit + '<div class="cs-acoes">' +
      '<button class="btn btn-2 cs-notif" type="button" popovertarget="' + n + '" style="anchor-name:--' + n + '" aria-label="154 novas atividades">' + ic('bell') + '<b class="numero">154</b></button>' + popNotif(n) + som +
      '<button class="btn btn-2" type="button">Dores dos leads</button><button class="btn btn-2" type="button">Ver agenda</button><button class="btn" type="button">Abrir funil</button></div>';
  }
  document.getElementById('topo-tela').innerHTML = topo(false);
  document.getElementById('topo-cel').innerHTML = topo(true);
  document.addEventListener('click', function (e) {
    var s = e.target.closest('.cs-som'); if (!s) return;
    var lig = s.getAttribute('aria-pressed') !== 'true';
    s.setAttribute('aria-pressed', String(lig)); s.setAttribute('aria-label', 'Som das notificações ' + (lig ? 'ligado' : 'desligado'));
    s.innerHTML = ic(lig ? 'volume-2' : 'volume-x');
  });

  // ---------- abas ----------
  var ABAS = [['Visão geral', '', 'Leads, reuniões, ganhos e taxa de conversão do período.'], ['Por canal', '7', 'Meta, Google, WhatsApp, Site, Bio, Indicação e Google orgânico.'], ['Por etapa', '8', 'De Lead novo até Cliente You, com o percentual que avança.'], ['Motivos de perda', '25', 'Outro 40%, sumiu 24%, sem perfil 20%, concorrente 16%.']];
  var barra = document.getElementById('abas-tela'), txt = document.getElementById('abas-texto');
  barra.setAttribute('data-indicador', 'linha');
  barra.innerHTML = ABAS.map(function (a, i) {
    return '<button class="cs-aba" role="tab" type="button" id="aba' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + a[0] + (a[1] ? '<span class="cs-aba-n">' + a[1] + '</span>' : '') + '</button>';
  }).join('');
  function abrirAba(i) {
    barra.querySelectorAll('.cs-aba').forEach(function (b, j) { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
    txt.textContent = ABAS[i][2]; txt.setAttribute('aria-labelledby', 'aba' + i);
  }
  abrirAba(0);
  barra.addEventListener('click', function (e) { var b = e.target.closest('.cs-aba'); if (b) abrirAba([].indexOf.call(barra.children, b)); });
  barra.addEventListener('keydown', function (e) {
    var k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k) return;
    var at = [].findIndex.call(barra.children, function (b) { return b.getAttribute('aria-selected') === 'true'; });
    var i = (at + k + ABAS.length) % ABAS.length; abrirAba(i); barra.children[i].focus(); e.preventDefault();
  });

  // ---------- migalha ----------
  document.getElementById('migalha').innerHTML = '<ol class="cs-migalha"><li><a class="lnk" href="#">Clientes</a></li><li>' + ic('chevron-right') + '<a class="lnk" href="#">Padaria Pão Dourado</a></li><li>' + ic('chevron-right') + '<span aria-current="page">Ficha do cliente</span></li></ol>';

  // ---------- paginação ----------
  var TOTAL = 137, pag = 1, por = 20, host = document.getElementById('paginacao');
  function numeros(t) {
    if (t <= 7) return Array.from({ length: t }, function (_, i) { return i + 1; });
    var s = [1]; if (pag > 3) s.push('…');
    for (var i = Math.max(2, pag - 1); i <= Math.min(t - 1, pag + 1); i++) s.push(i);
    if (pag < t - 2) s.push('…'); s.push(t); return s;
  }
  function desenhar() {
    var t = Math.ceil(TOTAL / por), ini = (pag - 1) * por + 1, fim = Math.min(TOTAL, pag * por);
    host.innerHTML = '<p class="card-fraco cs-pag-info" aria-live="polite">Mostrando <b>' + ini + ' a ' + fim + '</b> de ' + TOTAL + ' clientes</p>' +
      '<nav class="cs-pag-nav" aria-label="Paginação"><button class="btn btn-2 btn-p btn-icone" data-p="' + (pag - 1) + '" aria-label="Página anterior"' + (pag === 1 ? ' disabled' : '') + '>' + ic('chevron-left') + '</button>' +
      numeros(t).map(function (n) { return n === '…' ? '<span class="cs-pag-reticencias" aria-hidden="true">…</span>' : '<button class="btn btn-p ' + (n === pag ? '' : 'btn-fantasma ') + 'cs-pag-n" data-p="' + n + '"' + (n === pag ? ' aria-current="page"' : '') + ' aria-label="Página ' + n + '">' + n + '</button>'; }).join('') +
      '<button class="btn btn-2 btn-p btn-icone" data-p="' + (pag + 1) + '" aria-label="Próxima página"' + (pag === t ? ' disabled' : '') + '>' + ic('chevron-right') + '</button></nav>' +
      '<div class="cs-pag-por"><span class="card-fraco">Linhas por página</span><button class="selecao-botao" type="button" popovertarget="pp" style="anchor-name:--pp"><span class="selecao-escolha">' + por + '</span>' + ic('chevron-down', 'selecao-seta') + '</button>' +
      '<div id="pp" popover class="selecao-pop" style="position-anchor:--pp"><div class="selecao-lista">' + [10, 20, 50].map(function (n) { return '<button class="selecao-opcao" type="button" data-por="' + n + '" aria-pressed="' + (n === por) + '"><span class="selecao-marca"></span>' + n + ' por página</button>'; }).join('') + '</div></div></div>';
  }
  host.addEventListener('click', function (e) {
    var p = e.target.closest('[data-p]'), o = e.target.closest('[data-por]');
    if (p && !p.disabled) { pag = +p.dataset.p; desenhar(); var f = host.querySelector('[aria-current="page"]'); if (f) f.focus(); }
    if (o) { por = +o.dataset.por; pag = 1; desenhar(); }
  });
  desenhar();

  // ---------- tela montada ----------
  var kpis = [['137', 'Leads novos no período', '▲ 154% vs 54 anteriores', 'sobe'], ['40', 'Reuniões do período', '29% dos leads', ''], ['9', 'Ganhos no período', 'R$ 5.900', 'sobe'], ['6,6%', 'Taxa de conversão', '9 ganhos ÷ 137 leads', '']];
  document.getElementById('tela-montada').innerHTML = menu('A', false, 'dashboard') +
    '<div class="cs-tela"><header class="cs-topo cs-topo-tela">' + topo(false) + '</header><div class="cs-kpis">' +
    kpis.map(function (k) { return '<div class="card cs-kpi"><b class="cs-kpi-n numero">' + k[0] + '</b><span>' + k[1] + '</span><small class="selo' + (k[3] ? ' selo-sobe' : '') + '">' + k[2] + '</small></div>'; }).join('') +
    '</div><div class="card cs-vazio"><h3 class="card-titulo">Leads por dia e canal <span class="card-fraco">137 leads nos 7 canais</span></h3><div class="cs-linha-g"></div></div></div>';
  var tm = document.getElementById('tela-montada'); tm.innerHTML = tm.innerHTML.replace('<header class="cs-topo cs-topo-tela">', '<header class="cs-topo">');

  logos(); modos();
})();
