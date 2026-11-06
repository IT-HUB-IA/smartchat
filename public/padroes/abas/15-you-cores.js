/* Aba 15 · Cores da You: monta o mini-CRM em cada contêiner e calcula os contrastes ao vivo (fórmula da W3C) a partir das variáveis da opção. */
(function () {
  var html = document.documentElement;
  // a página mostra claro e escuro juntos: o claro de fora não pode virar escuro
  new MutationObserver(function () { if (html.dataset.tema !== 'claro') html.dataset.tema = 'claro'; }).observe(html, { attributes: true, attributeFilter: ['data-tema'] });

  var modelo = document.getElementById('vc-modelo');
  document.querySelectorAll('.vc-mini').forEach(function (m) { m.appendChild(modelo.content.cloneNode(true)); });
  document.querySelectorAll('[data-sem-ir]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });

  // cor "#rrggbb" ou "rgb(r g b / a)" vira [r, g, b, a]
  function cor(s) {
    s = s.trim();
    if (s[0] === '#') return [1, 3, 5].map(function (i) { return parseInt(s.substr(i, 2), 16); }).concat(1);
    var n = s.match(/[\d.]+/g).map(Number); return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1];
  }
  function sobre(f, b) { return [0, 1, 2].map(function (i) { return f[i] * f[3] + b[i] * (1 - f[3]); }).concat(1); }
  function lum(c) { var v = c.slice(0, 3).map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; }
  function razao(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

  function medir(m) {
    var cs = getComputedStyle(m), v = function (n) { return cs.getPropertyValue(n); };
    var fundo = cor(v('--fundo')), sup = cor(v('--sup')), acento = cor(v('--acento')), txt = cor(v('--acento-texto'));
    var no = cor(v('--no-acento')), fraco = cor(v('--no-acento-fraco')), claro = sobre(cor(v('--acento-claro')), sup);
    var grad = v('--acento-grad'), fundos = grad ? grad.match(/#[0-9a-fA-F]{6}/g).map(cor) : [acento];
    // com degradê vale o pior ponto
    var pior = function (c) { return Math.min.apply(null, fundos.map(function (f) { return razao(c, f); })); };
    return [
      ['Letra do botão', pior(no)],
      ['Letra fraca no bloco', pior(fraco)],
      ['Link no card', razao(txt, sup)],
      ['Link no fundo', razao(txt, fundo)],
      ['Link no fundo leve', razao(txt, claro)]
    ];
  }
  document.querySelectorAll('.vc-opcao').forEach(function (op) {
    var claro = medir(op.querySelector('[data-tema="claro"]')), escuro = medir(op.querySelector('[data-tema="escuro"]'));
    var f = function (n) { return '<td class="n ' + (n >= 4.5 ? 'vc-ok' : 'vc-ruim') + '">' + n.toFixed(2).replace('.', ',') + (n >= 4.5 ? '' : ' reprova') + '</td>'; };
    op.querySelector('.vc-contraste').innerHTML = '<table><thead><tr><th>Contraste</th><th class="n">Claro</th><th class="n">Escuro</th></tr></thead><tbody>' +
      claro.map(function (l, i) { return '<tr><td>' + l[0] + '</td>' + f(l[1]) + f(escuro[i][1]) + '</tr>'; }).join('') + '</tbody></table>';
  });
})();
