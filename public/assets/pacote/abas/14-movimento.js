// Aba 14 Movimento: mini CRM com a troca de tela e os efeitos aplicados.
// Os efeitos em si vêm de base/movimento.js (data-entra, data-conta, .card-sobe, .seg, .dica, crmTroca); aqui só se monta a tela e se chama.
(function () {
  var html = document.documentElement;
  function ic(n, c) { return '<svg class="' + (c || 'ico') + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + n + '"/></svg>'; }
  document.querySelectorAll('[data-ico-btn]').forEach(function (b) { b.insertAdjacentHTML('afterbegin', ic(b.dataset.icoBtn)); });

  var NAV = [['dashboard', 'layout-dashboard', 'Dashboard'], ['funil', 'funnel', 'Funil'], ['clientes', 'users', 'Clientes']];

  function menuMini(ativo, comDica) {
    return '<aside class="mn mn-A mn-rec" aria-label="Menu"><div class="mn-topo"><img class="mn-logo" data-forma="icone" alt="Logo da empresa" height="26"></div><nav class="mn-nav" aria-label="Principal">' +
      NAV.map(function (n) {
        return '<a class="mn-item' + (comDica ? ' dica dica-lado' : '') + '" href="#" data-ir="' + n[0] + '"' + (comDica ? ' data-dica="' + n[2] + '"' : '') + ' aria-label="' + n[2] + '"' + (n[0] === ativo ? ' aria-current="page"' : '') + '>' + ic(n[1]) + '</a>';
      }).join('') + '</nav></aside>';
  }
  function tela(nome, v) {
    var d = document.createElement('div');
    d.className = 'mv-tela'; d.dataset.view = nome; d.setAttribute('data-entra', v.toLowerCase());
    d.innerHTML = window.MV.telas[nome](); return d;
  }

  // troca de uma peça por outra com a animação da base (o depois entra no mesmo pai antes); o antes sai do DOM ao terminar
  function trocar(antes, depois) {
    antes.parentNode.appendChild(depois);
    return window.crmTroca(antes, depois).then(function () { antes.remove(); });
  }

  // mini CRMs A, B, C
  document.querySelectorAll('.mv-crm').forEach(function (crm) {
    crm.innerHTML = menuMini('dashboard', false) + '<div class="mv-area"></div>';
    crm.querySelector('.mv-area').appendChild(tela('dashboard', crm.dataset.var));
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-ir]'); if (!a) return;
    e.preventDefault();
    var crm = a.closest('.mv-crm'); if (!crm) return;       // o menu da dica (14.6) só mostra a dica
    var area = crm.querySelector('.mv-area'), atual = area.querySelector('.mv-tela');
    if (atual.dataset.view === a.dataset.ir) return;
    crm.querySelectorAll('.mn-item').forEach(function (x) { x.removeAttribute('aria-current'); });
    a.setAttribute('aria-current', 'page');
    trocar(atual, tela(a.dataset.ir, crm.dataset.var));
  });

  // 14.2 números
  var nums = document.getElementById('numeros');
  function desenharNumeros() {
    var d = document.createElement('div'); d.className = 'mv-numeros'; d.setAttribute('data-entra', '');
    d.innerHTML = [['137', 'Leads novos no período'], ['R$ 98.150,00', 'Valor no funil'], ['6,6%', 'Taxa de conversão'], ['1.248', 'Mensagens trocadas'], ['9h29min', 'Tempo médio de resposta']].map(function (n) {
      return '<div class="bloco-destaque"><p class="bloco-numero" data-conta="' + n[0] + '">' + n[0] + '</p><p class="bloco-fraco">' + n[1] + '</p></div>';
    }).join('');
    return d;
  }
  nums.replaceWith(desenharNumeros());

  // 14.3 lista
  function desenharLista() {
    var d = document.createElement('div'); d.className = 'mv-lista-host';
    d.innerHTML = '<ul class="mv-linhas" data-entra>' + window.MV.clientes.map(function (c) {
      return '<li class="mv-linha"><b>' + c[0] + '</b><span class="card-fraco">' + c[1] + '</span><span class="mv-valor">' + c[2] + '</span><span class="etiqueta" data-etapa="' + c[3] + '">' + c[4] + '</span></li>';
    }).join('') + '</ul>';
    return d;
  }
  document.getElementById('lista').replaceWith(desenharLista());

  // 14.4 cards
  document.getElementById('cards-sobe').innerHTML = window.MV.kpis.map(function (k) {
    return '<div class="card card-sobe mv-kpi"><b class="mv-n numero">' + k[0] + '</b><span>' + k[1] + '</span><small class="selo' + (k[3] ? ' selo-sobe' : '') + '">' + k[2] + '</small></div>';
  }).join('');

  // repetir
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.mv-repetir'); if (!b) return;
    var alvo = b.dataset.alvo;
    if (alvo === 'numeros') trocar(document.querySelector('.mv-numeros:not([hidden])'), desenharNumeros());
    else if (alvo === 'lista') trocar(document.querySelector('.mv-lista-host:not([hidden])'), desenharLista());
    else {
      var area = document.querySelector('.mv-crm[data-var="' + alvo + '"] .mv-area'), atual = area.querySelector('.mv-tela');
      trocar(atual, tela(atual.dataset.view, alvo));
    }
  });

  // 14.5 segmentado (o indicador que desliza vem da base) e abas
  document.querySelectorAll('.mv-indicadores .seg').forEach(function (s) {
    s.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      s.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });
  // 14.5: as abas de linha, como foram aprovadas
  var barra = document.getElementById('abas-mv');
  barra.setAttribute('data-indicador', 'linha');
  barra.innerHTML = ['Visão geral', 'Por canal', 'Por etapa', 'Motivos de perda'].map(function (t, i) {
    return '<button class="cs-aba" role="tab" type="button" aria-selected="' + (i === 0) + '">' + t + '</button>';
  }).join('');
  barra.addEventListener('click', function (e) {
    var b = e.target.closest('.cs-aba'); if (!b) return;
    barra.querySelectorAll('.cs-aba').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
  });
  // 14.7 a 14.10: as 4 opções novas de abas com luz (peça .abas-luz da base)
  document.querySelectorAll('.abas-luz').forEach(function (g) {
    g.innerHTML = ['Visão geral', 'Por canal', 'Por etapa', 'Motivos de perda'].map(function (t, i) { return '<button role="tab" type="button" aria-selected="' + (i === 0) + '">' + t + '</button>'; }).join('');
    g.addEventListener('click', function (e) {
      var b = e.target.closest('[role="tab"]'); if (!b) return;
      g.querySelectorAll('[role="tab"]').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
    });
  });

  // 14.6 menu recolhido com dica
  document.getElementById('menu-dica').innerHTML = menuMini('dashboard', true).replace('<nav class="mn-nav"', '<nav class="mn-nav"') +
    '<p class="card-fraco">O nome aparece ao lado do ícone. No celular e no teclado a dica também abre com o foco.</p>';

  // logo da empresa (a Beec roxa some no escuro: usa a versão clara)
  function logos() {
    var emp = html.dataset.empresa === 'beec' ? 'beec' : 'you';
    document.querySelectorAll('.mn-logo').forEach(function (img) {
      var esc = !!img.closest('[data-tema="escuro"]') || html.dataset.tema === 'escuro';
      img.src = '../icones/empresas/' + (esc ? emp + '-icone-claro' : emp) + '.svg';
    });
  }
  logos(); document.addEventListener('crm:tema', logos);
  // peças montadas por JS: liga a entrada e a contagem da base
  function ligar() { if (window.crmMovimento) window.crmMovimento.ligar(document); }
  ligar(); window.addEventListener('load', ligar);
})();
