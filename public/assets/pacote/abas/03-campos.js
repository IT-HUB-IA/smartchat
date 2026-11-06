/* Aba 3 Campos: monta seleções, calendário e hora (todas com .selecao-* da base), máscaras e cópia. Dados de exemplo. */
(function () {
  var n = 0;
  /* cada card vai num invólucro para a barra Aprovado/Ajustar ficar colada nele, sem ocupar uma célula da grade */
  document.querySelectorAll('.cp-grade > [data-item]').forEach(function (c) { var w = document.createElement('div'); w.className = 'cp-item'; c.replaceWith(w); w.appendChild(c); });
  var SETA = '<svg class="selecao-seta" aria-hidden="true"><use href="#chevron-down"/></svg>';
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var HOJE = new Date(2026, 9, 30);
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function p2(x) { return (x < 10 ? '0' : '') + x; }

  /* fotos (responsável), logos (empresa) e ícones (origem): arquivo em ../icones; sem arquivo, iniciais (regra do avatar) */
  /* fotos reais: ponha icones/pessoas/<nome-sobrenome>.jpg (sem acento, minúsculas, hífen) e acrescente o nome aqui; sem foto, vale o avatar por gênero */
  var FOTO = [];
  /* arquivos que existem em icones/empresas (BL ainda sem logo: cai nas iniciais, sem pedir arquivo que não há) */
  var LOGO = { 'you': 'you.svg', 'beec': 'beec.svg', 'realizze': 'realizze.png', 'tu-ecom': 'tu-ecom.svg', 'winny': 'winny.svg', 'lavoro-piu': 'lavoro-piu-logo.png', 'neowear': 'neowear-logo.png' };
  /* no escuro a logo escura some: usa a variante clara quando existe */
  var LOGO_ESCURO = { 'you': 'you-icone-claro.svg', 'beec': 'beec-icone-claro.svg', 'winny': 'winny-icone-claro.svg' };
  function logoSrc(s) { var esc = document.documentElement.dataset.tema === 'escuro'; return '../icones/empresas/' + ((esc && LOGO_ESCURO[s]) || LOGO[s]); }
  document.addEventListener('crm:tema', function () { document.querySelectorAll('img[data-logo]').forEach(function (i) { i.src = logoSrc(i.dataset.logo); }); });
  function slug(t) { return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-'); }
  function iniciais(t) { var p = t.split(' '); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); }
  window.cpFalha = function (img) { var s = document.createElement('span'); s.className = img.className + ' cp-ini'; s.textContent = iniciais(img.alt); img.replaceWith(s); };
  function figura(tipo, nome) {
    if (!tipo) return '';
    if (tipo === 'responsavel' && FOTO.indexOf(slug(nome)) > -1) return '<img class="cp-foto" src="../icones/pessoas/' + slug(nome) + '.jpg" alt="' + nome + '" onerror="cpFalha(this)">';
    if (tipo === 'responsavel') return avatarHTML(nome, 'p');
    if (tipo === 'empresa' && !LOGO[slug(nome)]) return '<span class="cp-logo cp-ini">' + iniciais(nome) + '</span>';
    var arq = tipo === 'empresa' ? 'empresas/' + LOGO[slug(nome)] : 'origens/' + slug(nome);
    if (tipo === 'empresa') return '<img class="cp-logo" data-logo="' + slug(nome) + '" src="' + logoSrc(slug(nome)) + '" alt="' + nome + '" onerror="cpFalha(this)">';
    return '<img class="cp-logo" src="../icones/' + arq + '.svg' + '" alt="' + nome + '" onerror="cpFalha(this)">';
  }
  function dm(d) { return p2(d.getDate()) + '/' + p2(d.getMonth() + 1); }
  function dmy(d) { return dm(d) + '/' + d.getFullYear(); }

  /* botão + lista (o par que toda seleção usa) */
  function par(raiz, conteudoBotao, aoAbrir) {
    var id = 'cp' + (++n);
    var b = el('button', 'selecao-botao', conteudoBotao);
    b.type = 'button'; b.setAttribute('popovertarget', id); b.style.anchorName = '--' + id;
    var pop = el('div', 'selecao-pop'); pop.id = id; pop.setAttribute('popover', ''); pop.style.positionAnchor = '--' + id;
    var lista = el('div', 'selecao-lista');
    pop.appendChild(lista);
    raiz.appendChild(b); raiz.appendChild(pop);
    if (aoAbrir) pop.addEventListener('toggle', function (e) { if (e.newState === 'open') aoAbrir(); });
    return { botao: b, pop: pop, lista: lista };
  }

  /* seleção única, múltipla e filtro */
  document.querySelectorAll('[data-selecao]').forEach(function (raiz) {
    var modo = raiz.dataset.selecao, ops = raiz.dataset.opcoes.split('|'), rot = raiz.dataset.rotulo;
    var vazio = raiz.dataset.vazio || 'Selecione';
    var sel = (raiz.dataset.padrao || '').split(',').filter(Boolean).map(Number);
    var multi = modo !== 'unica', tipo = raiz.dataset.tipo;
    var o = par(raiz, '');
    ops.forEach(function (t, i) {
      var b = el('button', 'selecao-opcao'); b.type = 'button';
      if (multi) b.appendChild(el('span', 'selecao-marca'));
      if (tipo) b.insertAdjacentHTML('beforeend', figura(tipo, t));
      b.appendChild(el('span', 'selecao-opcao-rotulo', t));
      b.addEventListener('click', function () {
        var k = sel.indexOf(i);
        if (multi) { if (k < 0) sel.push(i); else sel.splice(k, 1); }
        else { sel = [i]; o.pop.hidePopover(); }
        desenhar();
      });
      o.lista.appendChild(b);
    });
    function desenhar() {
      o.lista.querySelectorAll('.selecao-opcao').forEach(function (b, i) { b.setAttribute('aria-pressed', sel.indexOf(i) >= 0); });
      var h = '';
      if (modo === 'unica') h = sel.length ? figura(tipo, ops[sel[0]]) + '<span class="selecao-escolha">' + ops[sel[0]] + '</span>' : '<span class="selecao-escolha-vazio">' + vazio + '</span>';
      else if (modo === 'filtro') h = '<span>' + rot + '</span>' + (sel.length ? '<span class="selecao-contador">' + sel.length + '</span>' : '');
      else if (!sel.length) h = '<span class="selecao-escolha-vazio">' + vazio + '</span>';
      else h = '<span class="selecao-chips">' + sel.map(function (i) { return '<span class="selecao-chip"><span class="selo cp-chip">' + figura(tipo, ops[i]) + ops[i] + '</span></span>'; }).join('') + '</span><span class="selecao-mais" hidden></span>';
      o.botao.innerHTML = h + SETA;
      if (modo === 'multi') requestAnimationFrame(recolher);
    }
    /* o que não cabe no campo vira +N */
    function recolher() {
      var cx = o.botao.querySelector('.selecao-chips'), mais = o.botao.querySelector('.selecao-mais');
      if (!cx) return;
      var chips = Array.prototype.slice.call(cx.children), fora = 0;
      chips.forEach(function (c) { c.hidden = false; }); mais.hidden = true;
      function cabe() { return cx.scrollWidth <= cx.clientWidth + 1; }
      while (!cabe() && fora < chips.length - 1) {
        fora++; chips[chips.length - fora].hidden = true; mais.hidden = false; mais.textContent = '+' + fora;
      }
    }
    desenhar();
    if (modo === 'multi') window.addEventListener('resize', recolher);
  });

  /* calendário (data e período) */
  function calendario(lista, estado, aoEscolher) {
    var topo = el('div', 'cal-topo'), mes = el('span', 'cal-mes');
    var ant = el('button', 'cal-seta', '<svg class="ico" aria-hidden="true"><use href="#chevron-left"/></svg>'), prox = el('button', 'cal-seta', '<svg class="ico" aria-hidden="true"><use href="#chevron-right"/></svg>');
    ant.type = prox.type = 'button'; ant.setAttribute('aria-label', 'Mês anterior'); prox.setAttribute('aria-label', 'Próximo mês');
    topo.appendChild(mes); topo.appendChild(ant); topo.appendChild(prox);
    var grade = el('div', 'cal-grade');
    lista.appendChild(topo); lista.appendChild(grade);
    function desenhar() {
      var ref = estado.ref;
      mes.textContent = MESES[ref.getMonth()].charAt(0).toUpperCase() + MESES[ref.getMonth()].slice(1) + ' de ' + ref.getFullYear();
      grade.innerHTML = '';
      'DSTQQSS'.split('').forEach(function (s) { grade.appendChild(el('span', 'cal-semana', s)); });
      var ini = new Date(ref.getFullYear(), ref.getMonth(), 1 - new Date(ref.getFullYear(), ref.getMonth(), 1).getDay());
      for (var i = 0; i < 42; i++) {
        var d = new Date(ini.getFullYear(), ini.getMonth(), ini.getDate() + i), b = el('button', 'cal-dia', d.getDate());
        b.type = 'button';
        b.setAttribute('aria-label', dmy(d));
        if (d.getMonth() !== ref.getMonth()) b.dataset.fora = '';
        if (+d === +HOJE) b.dataset.hoje = '';
        var a = estado.de, z = estado.ate;
        if (a && ((+d === +a) || (z && +d === +z))) b.setAttribute('aria-pressed', 'true');
        else if (a && z && d > a && d < z) b.dataset.entre = '';
        b.addEventListener('click', (function (dd) { return function () { aoEscolher(dd); desenhar(); }; })(d));
        grade.appendChild(b);
      }
    }
    ant.addEventListener('click', function () { estado.ref = new Date(estado.ref.getFullYear(), estado.ref.getMonth() - 1, 1); desenhar(); });
    prox.addEventListener('click', function () { estado.ref = new Date(estado.ref.getFullYear(), estado.ref.getMonth() + 1, 1); desenhar(); });
    desenhar();
    return desenhar;
  }
  var ICO_CAL = '<svg class="ico" data-anima aria-hidden="true"><use href="#calendar"/></svg>';

  /* data */
  document.querySelectorAll('[data-data]').forEach(function (raiz) {
    var p = raiz.dataset.data.split('-'), est = { de: new Date(+p[0], p[1] - 1, +p[2]), ate: null, ref: new Date(+p[0], p[1] - 1, 1) };
    var o = par(raiz, ''); o.pop.classList.add('cal-pop'); o.lista.classList.add('cal-painel');
    function botao() { o.botao.innerHTML = ICO_CAL + '<span class="selecao-escolha">' + dmy(est.de) + '</span>' + SETA; }
    calendario(o.lista, est, function (d) { est.de = d; botao(); o.pop.hidePopover(); });
    botao();
  });

  /* período: atalhos + calendário em intervalo */
  document.querySelectorAll('[data-periodo]').forEach(function (raiz) {
    var est = { de: new Date(2026, 9, 1), ate: new Date(2026, 9, 30), ref: new Date(2026, 9, 1) }, nome = 'Últimos 30 dias', ancora = null;
    var o = par(raiz, ''); o.pop.classList.add('cal-pop'); o.lista.classList.add('cal-painel');
    var dupla = el('div', 'cal-duplo'), at = el('div', 'cal-atalhos'), cal = el('div');
    dupla.appendChild(at); dupla.appendChild(cal); o.lista.appendChild(dupla);
    var redesenhar = calendario(cal, est, function (d) {
      nome = 'Personalizado';
      if (!ancora) { ancora = d; est.de = d; est.ate = null; }
      else { est.de = d < ancora ? d : ancora; est.ate = d < ancora ? ancora : d; ancora = null; }
      botao(); marcar();
    });
    function botao() {
      var v = est.ate ? dm(est.de) + ' a ' + dm(est.ate) : dm(est.de) + ' (escolha o fim)';
      o.botao.innerHTML = '<span class="selecao-escolha">' + nome + '</span><span class="cp-valor">' + v + '</span>' + SETA;
    }
    function atalho(txt, dias) {
      var b = el('button', 'selecao-opcao'); b.type = 'button'; b.appendChild(el('span', 'selecao-opcao-rotulo', txt));
      b.addEventListener('click', function () {
        nome = txt; ancora = null;
        if (dias === 'mes') { est.de = new Date(2026, 9, 1); est.ate = new Date(2026, 9, 31); }
        else if (dias === 'ant') { est.de = new Date(2026, 8, 1); est.ate = new Date(2026, 8, 30); }
        else { est.ate = HOJE; est.de = new Date(2026, 9, 30 - dias + 1); }
        est.ref = new Date(est.de.getFullYear(), est.de.getMonth(), 1);
        botao(); marcar(); redesenhar(); o.pop.hidePopover();
      });
      at.appendChild(b);
    }
    atalho('Hoje', 1); atalho('Últimos 7 dias', 7); atalho('Últimos 30 dias', 30); atalho('Este mês', 'mes'); atalho('Mês anterior', 'ant');
    function marcar() { at.querySelectorAll('.selecao-opcao').forEach(function (b) { b.setAttribute('aria-pressed', b.textContent === nome); }); redesenhar(); }
    botao(); marcar();
  });

  document.querySelectorAll('[data-hora]').forEach(function (raiz) {
    var q = raiz.dataset.hora.split(':'), h = +q[0], m = +q[1];
    var o = par(raiz, ''); o.pop.classList.add('cal-pop'); o.lista.classList.add('cal-painel');
    /* as rodas vêm de base/rodas.js, que a casca carrega depois deste arquivo: montam na primeira abertura */
    var pe = el('div', 'cal-pe'), ok = el('button', 'btn btn-p', 'Pronto'); ok.type = 'button';
    ok.addEventListener('click', function () { o.pop.hidePopover(); }); pe.appendChild(ok); o.lista.appendChild(pe);
    o.pop.addEventListener('toggle', function (e) { if (e.newState === 'open' && !o.lista.querySelector('.campo-rodas')) o.lista.insertBefore(crmRodaHora(h, m, function (nh, nm) { h = nh; m = nm; botao(); }), pe); });
    function botao() { o.botao.innerHTML = '<svg class="ico" data-anima aria-hidden="true"><use href="#clock"/></svg><span class="selecao-escolha">' + p2(h) + ':' + p2(m) + '</span>' + SETA; }
    botao();
  });

  /* máscaras */
  document.querySelectorAll('[data-mascara="moeda"]').forEach(function (i) {
    i.addEventListener('input', function () {
      var d = i.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
      if (!d) { i.value = ''; return; }
      d = d.padStart(3, '0');
      i.value = d.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + d.slice(-2);
    });
  });
  document.querySelectorAll('[data-mascara="telefone"]').forEach(function (i) {
    i.addEventListener('input', function () {
      var d = i.value.replace(/\D/g, '').replace(/^55/, '').slice(0, 11);
      if (!d) { i.value = ''; return; }
      var r = '+55 (' + d.slice(0, 2);
      if (d.length > 2) r += ') ' + d.slice(2, d.length > 10 ? 7 : 6);
      if (d.length > (d.length > 10 ? 7 : 6)) r += '-' + d.slice(d.length > 10 ? 7 : 6);
      i.value = r;
    });
  });

  /* copiar */
  document.querySelectorAll('[data-copiar]').forEach(function (b) {
    b.addEventListener('click', function () {
      var campo = document.getElementById(b.dataset.copiar), aviso = b.closest('.campo').querySelector('.cp-aviso');
      function feito(ok) { aviso.textContent = ok ? 'Número copiado.' : 'Não deu para copiar. Selecione e use Ctrl+C.'; if (ok) aviso.dataset.ok = ''; }
      if (navigator.clipboard) navigator.clipboard.writeText(campo.value).then(function () { feito(true); }, function () { feito(false); });
      else feito(false);
    });
  });

  /* contagem da área de texto */
  document.querySelectorAll('[data-contar]').forEach(function (c) {
    var t = document.getElementById(c.dataset.contar);
    function atualizar() { c.textContent = t.value.length + '/' + t.maxLength; }
    t.addEventListener('input', atualizar); atualizar();
  });
})();
