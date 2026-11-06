/* Aba 1 Base: monta as amostras de cor e calcula o contraste WCAG ao vivo (recalcula ao trocar tema ou empresa) */
(function () {
  // [token mostrado, fundo da amostra, frente da amostra, mínimo]. Contraste = frente sobre fundo (alfa composto sobre o fundo)
  var G = {
    nucleo: [
      ['--fundo', '--fundo', '--texto', 4.5], ['--fundo', '--fundo', '--fraco', 4.5], ['--sup', '--sup', '--texto', 4.5],
      ['--sup-2', '--sup-2', '--fraco', 4.5], ['--borda-campo', '--sup', '--borda-campo', 3], ['--borda', '--sup', '--borda', 0]
    ],
    acento: [
      ['--acento', '--acento', '--no-acento', 4.5], ['--acento-hover', '--acento-hover', '--no-acento', 4.5],
      ['--no-acento-fraco', '--acento', '--no-acento-fraco', 4.5], ['--acento-texto', '--sup', '--acento-texto', 4.5],
      ['--acento-texto', '--fundo', '--acento-texto', 4.5], ['--acento-claro', '--acento-claro', '--acento-texto', 4.5]
    ],
    estados: [
      ['--sucesso', '--sucesso-fundo', '--sucesso', 4.5], ['--atencao', '--atencao-fundo', '--atencao', 4.5],
      ['--perigo', '--perigo-fundo', '--perigo', 4.5], ['--info', '--info-fundo', '--info', 4.5]
    ],
    variacao: [['--sobe', '--sobe-fundo', '--sobe', 4.5], ['--desce', '--desce-fundo', '--desce', 4.5], ['--sobe', '--sup', '--sobe', 4.5], ['--desce', '--sup', '--desce', 4.5]],
    faixas: ['ferro', 'bronze', 'prata', 'ouro', 'platina', 'diamante', 'sem'].map(function (f) { return ['--faixa-' + f, '--faixa-' + f, '--faixa-' + f + '-texto', 4.5]; })
      .concat([['--faixa-texto', '--faixa-fundo', '--faixa-texto', 4.5], ['--fraco', '--faixa-fundo', '--fraco', 4.5]]),
    etapas: ['novo', 'qualificacao', 'reuniao', 'nao-compareceu', 'negociacao', 'follow', 'ganho', 'perdido']
      .map(function (e) { return ['--etapa-' + e, '--etapa-' + e, '--no-etapa', 4.5]; }),
    canais: ['meta', 'google', 'whatsapp', 'site', 'bio', 'indicacao', 'google-organico']
      .map(function (c) { return ['--canal-' + c, '--sup', '--canal-' + c, 3]; }),
    wa: [
      ['--wa-recebida', '--wa-recebida', '--wa-texto', 4.5], ['--wa-recebida', '--wa-recebida', '--wa-hora', 4.5],
      ['--wa-enviada', '--wa-enviada', '--wa-texto', 4.5], ['--wa-enviada', '--wa-enviada', '--wa-hora', 4.5], ['--wa-fundo', '--wa-fundo', '--texto', 4.5]
    ]
  };

  var sonda = document.createElement('i');
  sonda.style.display = 'none';
  document.body.appendChild(sonda);
  function cor(v) {   // resolve o token para [r,g,b,a] (0..1), também color-mix
    sonda.style.color = 'var(' + v + ')';
    var s = getComputedStyle(sonda).color, n = s.match(/[\d.]+/g).map(Number);
    if (s.indexOf('color(') === 0) return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1];
    return [n[0] / 255, n[1] / 255, n[2] / 255, n.length > 3 ? n[3] : 1];
  }
  function sobre(f, b) { return [0, 1, 2].map(function (i) { return f[i] * f[3] + b[i] * (1 - f[3]); }).concat(1); }
  function lum(c) { return c.slice(0, 3).reduce(function (s, v, i) { v = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); return s + v * [0.2126, 0.7152, 0.0722][i]; }, 0); }
  function contraste(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function hex(c) { return '#' + c.slice(0, 3).map(function (v) { return Math.round(v * 255).toString(16).padStart(2, '0'); }).join('').toUpperCase(); }
  var base = function () { return cor('--sup'); };

  function pintar() {
    document.querySelectorAll('.amostras').forEach(function (caixa) {
      caixa.innerHTML = '';
      G[caixa.dataset.grupo].forEach(function (a) {
        var fundo = sobre(cor(a[1]), base());   // alfa composto sobre o card, onde a cor é usada
        var frente = sobre(cor(a[2]), fundo), c = contraste(frente, fundo), ok = !a[3] || c >= a[3];
        var el = document.createElement('div');
        el.className = 'amostra';
        el.innerHTML =
          '<div class="amostra-cor" style="background: var(' + a[1] + '); color: var(' + a[2] + ')">' + (a[1] === a[2] ? '●' : 'Aa 12') + '</div>' +
          '<div class="amostra-info"><span class="amostra-nome">' + a[0] + '</span><span class="amostra-valor">' + hex(a[0] === a[1] ? fundo : sobre(cor(a[0]), fundo)) + '</span>' +
          '<span class="amostra-par">' + a[2] + ' sobre ' + a[1].replace(a[2], 'ele') + ': <b>' + c.toFixed(2).replace('.', ',') + '</b>' +
          (a[3] ? (ok ? ' ✓ ' + String(a[3]).replace('.', ',') : ' <span class="amostra-reprova">reprova</span>') : ' decorativa') + '</span></div>';
        caixa.appendChild(el);
      });
    });
  }

  var et = document.getElementById('etiquetas-nevoa');
  for (var i = 1; i <= 16; i++) et.insertAdjacentHTML('beforeend', '<span class="etiqueta" style="--etq: var(--etiqueta-' + i + '); --etq-texto: var(--etiqueta-' + i + '-texto)">Etiqueta ' + i + '</span>');
  var esp = document.getElementById('espacos');
  [4, 8, 12, 16, 24, 32, 48, 64].forEach(function (s) { esp.insertAdjacentHTML('beforeend', '<div class="base-espaco"><b>--s-' + s + '</b><i style="width: var(--s-' + s + ')"></i>' + s + 'px</div>'); });

  document.getElementById('abrir-janela').onclick = function () { document.getElementById('janela-demo').showModal(); };
  document.getElementById('abrir-lateral').onclick = function () { document.getElementById('lateral-demo').showModal(); };
  document.querySelectorAll('[data-fechar]').forEach(function (b) { b.onclick = function () { b.closest('dialog').close(); }; });
  document.querySelectorAll('dialog').forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); });

  document.querySelectorAll('.abas-luz').forEach(function (g) { g.addEventListener('click', function (e) {
    var t = e.target.closest('[role="tab"]'); if (!t) return;
    g.querySelectorAll('[role="tab"]').forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); });
  }); });

  pintar();
  document.addEventListener('crm:tema', pintar);
  if (document.fonts) document.fonts.ready.then(pintar);
})();
