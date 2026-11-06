const canais = [
  ['meta', 'Meta', '62 lead(s) · 21 com reunião · 4 cliente(s) · R$ 2.600/mês fechado', 45],
  ['google', 'Google', '31 lead(s) · 9 com reunião · 2 cliente(s) · R$ 1.300/mês fechado', 23],
  ['site', 'Site', '13 lead(s) · 5 com reunião · 2 cliente(s) · R$ 1.350/mês fechado', 9],
  ['indicacao', 'Indicação', '7 lead(s) · 7 com reunião · 1 cliente(s) · R$ 650/mês fechado', 5],
  ['google-organico', 'Google orgânico', '2 lead(s) · 2 com reunião · 0 cliente(s) · R$ 0/mês fechado', 1],
  ['whatsapp', 'WhatsApp', '1 lead(s) · 1 com reunião · 0 cliente(s) · R$ 0/mês fechado', 1],
];
document.getElementById('lista-canais').innerHTML = canais.map(([id, nome, det, pct]) =>
  `<li class="c4-item"><img class="c4-icone" src="../icones/origens/${id}.svg" alt=""><div><strong>${nome}</strong><p class="card-fraco">${det}</p></div>
  <div class="c4-barra" role="img" aria-label="${pct}%"><i style="width:${Math.max(pct, 2)}%"></i></div><b class="c4-pct numero">${pct}%</b></li>`).join('');

const fig = (h, c) => `<figure>${h}<figcaption>${c}</figcaption></figure>`;
document.getElementById('av-regra').innerHTML = [
  ['Marcelo Gamba', 'g', 'Homem, pelo nome'], ['Love Monika', 'g', 'Mulher, pelo nome'],
  ['Bazar Tanguará', 'g', 'Nome que não diz: iniciais'], ['', 'g', 'Sem nome: avatar neutro'],
].map(([n, t, c]) => fig(avatarHTML(n, t), `${n || '(vazio)'}<br>${c}`)).join('');
const img = n => `<span class="avatar avatar-g"><img src="../icones/avatares/b/${n}.svg" alt=""></span>`;
document.getElementById('av-opcoes').innerHTML = [1, 2, 3].map(i => img('homem-' + i)).join('') + [1, 2, 3].map(i => img('mulher-' + i)).join('');
document.getElementById('av-tam').innerHTML = ['g', '', 'p'].map(t => fig(['Marcelo Gamba', 'Love Monika', 'Delma Ávila Canto'].map(n => avatarHTML(n, t)).join(''), t === 'g' ? '44' : t === 'p' ? '24' : '32')).join('');
