// Aba 14 Movimento: dados fictícios de out/2026 e os três "modelos de tela" (Dashboard, Funil, Clientes) do mini CRM.
(function () {
  var KPIS = [['137', 'Leads novos', '▲ 154% vs 54 anteriores', 'sobe'], ['40', 'Reuniões', '29% dos leads', ''], ['R$ 5.900', 'Ganhos', '9 fechamentos', 'sobe'], ['6,6%', 'Conversão', '9 ÷ 137 leads', '']];
  var BARRAS = [4, 6, 3, 9, 12, 7, 5, 8, 6, 10, 7, 4];
  var CLIENTES = [
    ['Padaria Pão Dourado', 'Meta', 'R$ 650/mês', 'ganho', 'Fechado'], ['Ótica São Benedito', 'Google', 'R$ 1.350/mês', 'ganho', 'Fechado'],
    ['Clínica Vida Plena', 'Indicação', 'R$ 980/mês', 'negociacao', 'Em negociação'], ['Auto Peças Irmãos Lima', 'Site', 'R$ 1.200/mês', 'reuniao', 'Reunião agendada'],
    ['Studio Bela Forma', 'WhatsApp', 'R$ 540/mês', 'qualificacao', 'Em qualificação'], ['Mercadinho Boa Compra', 'Meta', 'R$ 720/mês', 'novo', 'Lead novo'],
    ['Escola Pequeno Passo', 'Bio', 'R$ 890/mês', 'follow', 'Follow-up']
  ];
  var FUNIL = [
    ['novo', 'Lead novo', [['Mercadinho Boa Compra', 'Meta', 'R$ 720'], ['Delma Souza', 'Meta', 'R$ 450']]],
    ['qualificacao', 'Em qualificação', [['Studio Bela Forma', 'WhatsApp', 'R$ 540'], ['Marcos Lima', 'Site', 'R$ 600']]],
    ['reuniao', 'Reunião agendada', [['Auto Peças Irmãos Lima', 'Site', 'R$ 1.200']]],
    ['negociacao', 'Em negociação', [['Clínica Vida Plena', 'Indicação', 'R$ 980']]]
  ];
  function pill(e, t) { return '<span class="etiqueta" data-etapa="' + e + '">' + t + '</span>'; }

  function dashboard() {
    return '<div class="mv-tela-t"><h3>Dashboard</h3><p class="card-fraco">You Contabilidade · 01/10/2026 a 30/10/2026</p></div>' +
      KPIS.map(function (k) { return '<div class="card mv-kpi card-sobe"><b class="mv-n numero" data-conta="' + k[0] + '">' + k[0] + '</b><span>' + k[1] + '</span><small class="selo' + (k[3] ? ' selo-sobe' : '') + '">' + k[2] + '</small></div>'; }).join('') +
      '<div class="card mv-grafico"><h4 class="card-titulo">Leads por dia <span class="card-fraco">137 em 12 dias</span></h4><div class="mv-barras" aria-hidden="true">' + BARRAS.map(function (b) { return '<i style="--h:' + (b * 8) + '%"></i>'; }).join('') + '</div></div>';
  }
  function funil() {
    return '<div class="mv-tela-t"><h3>Funil</h3><p class="card-fraco">7 leads abertos · R$ 4.490 no funil</p></div>' +
      FUNIL.map(function (c) {
        return '<section class="mv-col"><header>' + pill(c[0], c[1]) + '<b class="mv-cont">' + c[2].length + '</b></header>' +
          c[2].map(function (l) { return '<article class="card mv-lead card-sobe"><b>' + l[0] + '</b><span class="card-fraco">' + l[1] + ' · ' + l[2] + '/mês</span></article>'; }).join('') + '</section>';
      }).join('');
  }
  function clientes() {
    return '<div class="mv-tela-t"><h3>Clientes</h3><p class="card-fraco">137 registros · 20 por página</p></div>' +
      '<div class="card mv-lista"><ul class="mv-linhas" data-entra>' + CLIENTES.map(function (c) {
        return '<li class="mv-linha"><b>' + c[0] + '</b><span class="card-fraco">' + c[1] + '</span><span class="mv-valor">' + c[2] + '</span>' + pill(c[3], c[4]) + '</li>';
      }).join('') + '</ul></div>';
  }
  window.MV = { telas: { dashboard: dashboard, funil: funil, clientes: clientes }, kpis: KPIS, clientes: CLIENTES };
})();
