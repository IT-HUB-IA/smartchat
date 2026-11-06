// Aba 13: monta as grades a partir de window.ICO (13-icones.dados.js)
(function () {
  var nomes = Object.keys(window.ICO);
  var uso = function (n, c) { return '<svg class="' + (c || 'ico') + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + n + '"/></svg>'; };
  var cel = function (n, corpo) { return '<button type="button" class="ic-cel">' + corpo + '<span class="ic-nome">' + n + '</span></button>'; };
  document.getElementById('grade-animada').innerHTML = nomes.map(function (n) { return cel(n, n === 'smile' ? uso(n) : '<span class="ic-anim" data-anim="' + n + '" data-tam="24"></span>'); }).join('');
  document.getElementById('grade-estatica').innerHTML = nomes.map(function (n) { return cel(n, uso(n)); }).join('');

  document.getElementById('tamanhos').innerHTML = [16, 20, 24, 32].map(function (t) {
    return '<button type="button" class="ic-cel"><span style="display:inline-flex;width:' + t + 'px;height:' + t + 'px">' + uso('bell').replace('class="ico"', 'class="ico" style="width:100%;height:100%"') + '</span><span class="ic-nome">' + t + ' px</span></button>';
  }).join('') + [['texto', 'var(--texto)'], ['fraco', 'var(--fraco)'], ['acento', 'var(--acento-texto)'], ['perigo', 'var(--perigo)'], ['sucesso', 'var(--sucesso)']].map(function (c) {
    return '<button type="button" class="ic-cel" style="color:' + c[1] + '">' + uso('circle-check') + '<span class="ic-nome">' + c[0] + '</span></button>';
  }).join('');

  document.getElementById('uso').innerHTML =
    '<button class="btn" type="button">' + uso('plus') + 'Novo lead</button>' +
    '<button class="btn btn-2" type="button">' + uso('list-filter') + 'Filtro</button>' +
    '<button class="btn btn-2 btn-icone" type="button" aria-label="Som">' + uso('volume-2') + '</button>' +
    '<button class="btn btn-2 btn-icone" type="button" aria-label="Notificações">' + uso('bell') + '</button>' +
    '<button class="btn btn-fantasma btn-icone" type="button" aria-label="Mais">' + uso('ellipsis') + '</button>' +
    '<label class="campo ic-campo"><span class="campo-rotulo">Buscar</span><span class="campo-com-icone">' + uso('search') + '<input class="campo-input" placeholder="Nome, telefone ou mensagem"></span></label>';

  var orig = [['meta', 'Meta', '48 leads'], ['google', 'Google', '31 leads'], ['whatsapp', 'WhatsApp', '22 leads'], ['site', 'Site', '13 leads'], ['bio', 'Bio', '9 leads'], ['indicacao', 'Indicação', '7 leads'], ['google-organico', 'Google orgânico', '2 leads']];
  document.getElementById('origens-uso').innerHTML = orig.map(function (o) {
    return '<div class="ic-linha"><img src="../icones/origens/' + o[0] + '.svg" alt="" width="20" height="20"><b>' + o[1] + '</b><span class="card-fraco">' + o[2] + '</span><span class="selo"><img src="../icones/origens/' + o[0] + '.svg" alt="" width="14" height="14">' + o[1] + '</span></div>';
  }).join('');

  // 13.9 ícones-chave que animam (a lista vem de icones/animateicons.js; os outros ficam parados de propósito)
  var CHAVE = window.crmAnimados.chave;
  var host = document.getElementById('chave');
  host.innerHTML = CHAVE.map(function (n) { return cel(n, uso(n, 'ico ic-grande')); }).join('');
  document.getElementById('tocar-todos').addEventListener('click', function () { window.crmAnimados.tocar(host); });
  document.getElementById('parados').textContent = nomes.filter(function (n) { return CHAVE.indexOf(n) < 0; }).join(', ');
})();
