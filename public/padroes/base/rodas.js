/* CRM padrão · base/rodas.js · Dono: Alicerce (promovido da aba 3, Campo, R2). O base/casca.js já carrega.
   Hora em duas rodas (como o campo-data da Névoa): arrastar, rolar o mouse, setas ou clicar; a linha do meio é a escolhida.
   Uso: var el = crmRodaHora(14, 30, function (h, m) { ... }); painel.appendChild(el);   (minuto de 5 em 5; passo opcional no 4º argumento) */
(function () {
  function p2(n) { return String(n).padStart(2, '0'); }
  function roda(rotulo, total, passo, valor, aoMudar) {
    var r = document.createElement('div'), n = total / passo, v = Math.round(valor / passo) % n, itens = [], acum = 0;
    r.className = 'roda'; r.tabIndex = 0; r.setAttribute('role', 'spinbutton'); r.setAttribute('aria-label', rotulo);
    r.setAttribute('aria-valuemin', 0); r.setAttribute('aria-valuemax', total - passo);
    for (var i = 0; i < n; i++) { var it = document.createElement('div'); it.className = 'roda-item'; it.textContent = p2(i * passo); it.dataset.i = i; r.appendChild(it); itens.push(it); }
    function desenhar(anim) {
      itens.forEach(function (it, i) {
        var d = ((i - v + n * 3 + n / 2) % n) - n / 2;
        it.style.transform = 'translateY(' + d * 32 + 'px)';
        it.style.opacity = Math.abs(d) > 3 ? 0 : 1;
        it.toggleAttribute('data-meio', d === 0);
        it.style.transition = anim && Math.abs(d) <= 3 ? '' : 'none';
      });
      r.setAttribute('aria-valuenow', v * passo); r.setAttribute('aria-valuetext', p2(v * passo));
    }
    function ir(novo) { v = (novo + n) % n; desenhar(true); aoMudar(v * passo); }
    r.addEventListener('wheel', function (e) { e.preventDefault(); acum += e.deltaY; if (Math.abs(acum) >= 40) { ir(v + Math.sign(acum)); acum = 0; } }, { passive: false });
    r.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { ir(v + 1); e.preventDefault(); } if (e.key === 'ArrowUp') { ir(v - 1); e.preventDefault(); } });
    var y0 = null;
    r.addEventListener('pointerdown', function (e) { y0 = e.clientY; r.setPointerCapture(e.pointerId); });
    r.addEventListener('pointermove', function (e) { if (y0 == null) return; var passos = Math.trunc((y0 - e.clientY) / 32); if (passos) { ir(v + passos); y0 = e.clientY; } });
    r.addEventListener('pointerup', function (e) { var moveu = y0 != null && Math.abs(y0 - e.clientY) > 4; y0 = null; if (moveu) return; var it = e.target.closest('.roda-item'); if (it) ir(+it.dataset.i); });
    desenhar(false);
    return r;
  }
  window.crmRodaHora = function (h, m, aoMudar, passoMin) {
    var c = document.createElement('div'), dois = document.createElement('span');
    c.className = 'campo-rodas'; dois.className = 'campo-dois-pontos'; dois.textContent = ':';
    c.appendChild(roda('Hora', 24, 1, h, function (x) { h = x; aoMudar && aoMudar(h, m); }));
    c.appendChild(dois);
    c.appendChild(roda('Minuto', 60, passoMin || 5, m, function (x) { m = x; aoMudar && aoMudar(h, m); }));
    return c;
  };
})();
