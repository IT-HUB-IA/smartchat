/* Aba 2 · Botões: comportamento de demonstração (grupo segmentado, contador, interruptor, copiar, carregando). */
(function () {
  // Links de exemplo não saem da página
  document.querySelectorAll('[data-sem-ir]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });

  // Seleção: escolher uma opção troca o texto do botão e fecha a lista
  document.querySelectorAll('.selecao-pop').forEach(function (pop) {
    var txt = document.querySelector('[popovertarget="' + pop.id + '"] .selecao-escolha');
    pop.addEventListener('click', function (e) {
      var o = e.target.closest('.selecao-opcao'); if (!o) return;
      pop.querySelectorAll('.selecao-opcao').forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); });
      txt.textContent = o.textContent; pop.hidePopover();
    });
  });

  // Segmentado: uma escolha; setas do teclado trocam
  document.querySelectorAll('[data-seg]').forEach(function (g) {
    var bs = Array.prototype.slice.call(g.querySelectorAll('button'));
    function escolher(b) { bs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }
    bs.forEach(function (b, i) {
      b.addEventListener('click', function () { escolher(b); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = bs[(i + d + bs.length) % bs.length]; n.focus(); escolher(n); e.preventDefault();
      });
    });
  });

  // Contador: trava o botão no limite
  document.querySelectorAll('[data-contador]').forEach(function (c) {
    var min = +c.dataset.min, max = +c.dataset.max, v = +c.dataset.valor;
    var out = c.querySelector('[data-v]'), menos = c.querySelector('[data-passo="-1"]'), mais = c.querySelector('[data-passo="1"]');
    function pintar() { out.textContent = v; menos.disabled = v <= min; mais.disabled = v >= max; }
    c.addEventListener('click', function (e) {
      var b = e.target.closest('[data-passo]'); if (!b || b.disabled) return;
      v = Math.min(max, Math.max(min, v + +b.dataset.passo)); pintar();
    });
    pintar();
  });

  // Interruptor do modo escuro: usa a chave real do topo (casca.js) para guardar a escolha
  var ct = document.querySelector('[data-chave-tema]');
  if (ct) {
    var html = document.documentElement;
    var sincronizar = function () { ct.checked = html.dataset.tema === 'escuro'; };
    sincronizar();
    ct.addEventListener('change', function () {
      var alvo = ct.checked ? 'Escuro' : 'Claro';
      var real = Array.prototype.find.call(document.querySelectorAll('.casca-chave button'), function (x) { return x.textContent.trim() === alvo; });
      if (real) real.click(); else html.dataset.tema = alvo.toLowerCase();
    });
    new MutationObserver(sincronizar).observe(html, { attributes: true, attributeFilter: ['data-tema'] });
  }

  // Carregando: 1,6 s
  document.querySelectorAll('[data-carregar]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-busy') === 'true') return;
      b.setAttribute('aria-busy', 'true'); b.setAttribute('aria-label', 'Carregando');
      setTimeout(function () { b.removeAttribute('aria-busy'); b.removeAttribute('aria-label'); }, 1600);
    });
  });

  // Copiar: vira "Copiado" por 1,5 s (mesmo sem permissão da área de transferência, o aviso aparece)
  document.querySelectorAll('[data-copiar]').forEach(function (b) {
    var txt = b.querySelector('[data-copiar-txt]'), antes = txt && txt.textContent, u = b.querySelector('use');
    b.addEventListener('click', function () {
      if (b.classList.contains('copiado')) return;
      try { navigator.clipboard.writeText(b.dataset.copiar).catch(function () {}); } catch (e) {}
      b.classList.add('copiado');
      if (txt) txt.textContent = 'Copiado';
      if (u) u.setAttribute('href', '#check');
      b.setAttribute('aria-label', 'Copiado');
      setTimeout(function () {
        b.classList.remove('copiado');
        if (txt) txt.textContent = antes;
        if (u) u.setAttribute('href', '#copy');
        if (!txt) b.setAttribute('aria-label', b.title || 'Copiar'); else b.removeAttribute('aria-label');
      }, 1500);
    });
  });
})();
