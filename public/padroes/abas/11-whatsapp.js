/* Aba 11 WhatsApp. Dados de exemplo, outubro de 2026. Cor, raio e sombra vêm só de base/tokens.css. */
const CONVERSAS = [
  { id: 1, nome: 'Marina Duarte', fone: '+55 11 91234-5678', foto: null, hora: '12:42', previa: 'Áudio', audio: true, etapa: '', nao_lidas: 2 },
  { id: 2, nome: 'Carlos Menezes', fone: '+55 11 98877-1020', foto: 'homem', hora: '08:30', previa: 'Pode ser terça às 15h?', etapa: 'novo', nao_lidas: 0 },
  { id: 3, nome: 'Patrícia Lemos', fone: '+55 21 99654-3300', foto: 'mulher', hora: '08:29', previa: 'Deu tudo certo ontem?', etapa: 'ganho', nao_lidas: 0 },
  { id: 4, nome: 'Rafael Antunes', fone: '+55 31 98123-4477', foto: 'homem', hora: '23:51', previa: 'Ok, obrigado', etapa: 'qualificacao', nao_lidas: 0 },
  { id: 5, nome: 'Studio Aurora', fone: '+55 11 91234-9090', foto: null, hora: '22:31', previa: '11 91234-9090', etapa: '', nao_lidas: 0 },
  { id: 6, nome: 'Fernanda Costa', fone: '+55 41 99711-2085', foto: 'mulher', hora: '20:10', previa: 'Amanhã te espero aqui', etapa: 'negociacao', nao_lidas: 1 },
  { id: 7, nome: 'Bruno Tavares', fone: '+55 11 97766-5544', foto: 'homem', hora: 'Ontem', previa: 'Mandei o contrato assinado', etapa: 'reuniao', nao_lidas: 0 },
  { id: 8, nome: 'Juliana Prado', fone: '+55 19 98888-0001', foto: 'mulher', hora: 'Ontem', previa: 'Bom dia! Podemos conversar?', etapa: 'follow', nao_lidas: 0 },
];
const ETAPAS = { novo: 'Lead novo', qualificacao: 'Em qualificação', reuniao: 'Reunião agendada', negociacao: 'Em negociação', follow: 'Follow-up', ganho: 'Cliente You' };

/* de: 'eles' (recebida) | 'nos' (enviada). tipo: texto | audio | link | contato */
const MENSAGENS = [
  { dia: '05/10/2026' },
  { de: 'eles', tipo: 'texto', hora: '10:41', texto: 'Oi' },
  { dia: '09/10/2026' },
  { de: 'eles', tipo: 'texto', hora: '12:31', texto: 'Olá! Vim pela página da You e quero saber sobre a contabilidade para o meu negócio. (ref: google)' },
  { dia: '11/10/2026' },
  { de: 'eles', tipo: 'link', hora: '18:05', texto: 'https://exemplo.com.br/materiais/contabilidade-para-pequenas-empresas' },
  { de: 'eles', tipo: 'texto', hora: '18:06', texto: 'Esse material explica o que eu preciso?' },
  { dia: '24/10/2026' },
  { de: 'nos', tipo: 'contato', hora: '12:21', nome: 'Denis Rocha', fone: '+55 11 91423-7141', visto: true },
  { de: 'nos', tipo: 'audio', hora: '12:21', duracao: 34, visto: true },
  { de: 'nos', tipo: 'texto', hora: '12:42', texto: 'Perfeito, te mando a proposta ainda hoje.', visto: true },
  { de: 'eles', tipo: 'audio', hora: '12:44', duracao: 12 },
];
const curta = c => [
  { dia: '29/10/2026' },
  { de: 'nos', tipo: 'texto', hora: '17:02', texto: 'Olá, ' + c.nome.split(' ')[0] + '! Tudo bem? Aqui é da You Contabilidade.', visto: true },
  { de: 'eles', tipo: 'texto', hora: c.hora.includes(':') ? c.hora : '09:15', texto: c.previa },
];
const mensagensDe = c => (c.id === 1 ? MENSAGENS : curta(c));

/* Ícones: sprite da base (base/icones.js). */
const NOME = { clip: 'paperclip', mais: 'ellipsis', agenda: 'calendar', baixo: 'chevron-down', esq: 'chevron-left', visto: 'check-check', arquivo: 'archive', novo: 'plus', atualizar: 'refresh-cw', doc: 'file-text', imagem: 'image', usuario: 'user', usuarioMais: 'user-plus', copiar: 'copy', lixo: 'trash-2', msg: 'message-circle', lupa: 'search', search: 'search', smile: 'smile', send: 'send', mic: 'mic', play: 'play' };
const ANIMA = new Set(['search', 'refresh-cw', 'mic', 'send', 'paperclip', 'smile', 'ellipsis', 'calendar', 'check-check', 'copy', 'trash-2', 'message-circle']);
const ico = (n, cls = '') => { const id = NOME[n] || n; return `<svg class="ico ${cls}"${ANIMA.has(id) ? ' data-anima' : ''} aria-hidden="true"><use href="#${id}"/></svg>`; };

let uid = 0;
const avatar = (c, tam = 'g') => c.foto
  ? `<span class="avatar avatar-${tam}"><img src="../icones/avatares/${c.foto}.svg" alt=""></span>`
  : `<span class="avatar avatar-${tam}">${c.nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()}</span>`;
const etq = e => e ? `<span class="etiqueta" data-etapa="${e}">${ETAPAS[e]}</span>` : '<span class="selo">Sem lead</span>';

function linha(c, o = {}) {
  const nl = c.nao_lidas ? ' data-nao-lida' : '';
  const previa = o.digitando ? '<span class="wa-previa wa-digitando-previa">digitando...</span>'
    : `<span class="wa-previa">${c.audio ? ico('mic') : ''}${c.previa}</span>`;
  return `<button class="wa-linha" type="button" data-id="${c.id}"${nl} aria-current="${!!o.sel}">
    ${avatar(c)}<span class="wa-linha-corpo">
      <span class="wa-linha-l1"><span class="wa-nome">${c.nome}</span><time class="wa-hora-l">${c.hora}</time></span>
      <span class="wa-linha-l2">${previa}${c.nao_lidas ? `<span class="wa-nl" aria-label="${c.nao_lidas} não lidas">${c.nao_lidas}</span>` : ''}</span>
      ${etq(c.etapa)}
    </span></button>`;
}

function pop(botaoHtml, itens, { unica = false, alinhar } = {}) {
  const id = 'p' + (++uid), ancora = '--a' + uid;
  return `<button type="button" class="${botaoHtml.cls}" popovertarget="${id}" style="anchor-name:${ancora}" ${botaoHtml.attr || ''}>${botaoHtml.html}</button>
  <div id="${id}" popover class="selecao-pop" style="position-anchor:${ancora}${alinhar ? ';position-area:' + alinhar : ''}"><div class="selecao-lista"${unica ? ' data-unica' : ''}>${itens}</div></div>`;
}
const opcao = (rot, { icone, press, perigo, sep, k } = {}) =>
  `<button type="button" class="selecao-opcao${perigo ? ' selecao-perigo' : ''}"${press !== undefined ? ` aria-pressed="${press}"` : ''}${sep ? ' data-separar' : ''}${k !== undefined ? ` data-k="${k}"` : ''}>${icone ? ico(icone) : ''}<span class="selecao-opcao-rotulo">${rot}</span></button>`;

function filtros(estado) {
  const etapaItens = opcao('Todas as etapas', { press: !estado.etapa, k: '' }) + Object.entries(ETAPAS).map(([k, v]) => opcao(v, { press: estado.etapa === k, k })).join('');
  const rot = estado.etapa ? ETAPAS[estado.etapa] : 'Etapa';
  return `<div class="campo-com-icone">${ico('search')}<input class="campo-input" type="search" placeholder="Buscar por nome, telefone ou mensagem" aria-label="Buscar conversas" value="${estado.busca || ''}" data-busca></div>
  <div class="wa-filtros">
    <div class="seg" role="group" aria-label="Filtrar conversas"><button type="button" data-aba="todos" aria-pressed="${!estado.nl}">Todos</button><button type="button" data-aba="nl" aria-pressed="${!!estado.nl}">Não lidas</button></div>
    ${pop({ cls: 'selecao-botao', html: `<span class="${estado.etapa ? 'selecao-escolha' : 'selecao-escolha-vazio'}" data-rot>${rot}</span><svg class="selecao-seta" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>` }, etapaItens, { unica: true, alinhar: 'bottom span-left' })}
  </div>
  <div class="wa-acoes">
    <button type="button" class="btn btn-2 btn-p">${ico('arquivo')}Arquivadas</button>
    <button type="button" class="btn btn-2 btn-p">${ico('novo')}Nova conversa</button>
    <button type="button" class="btn btn-2 btn-p">${ico('atualizar')}Atualizar fotos</button>
  </div>`;
}

const FUNDOS = [['liso', 'Liso'], ['a', 'Pontos'], ['b', 'Hachura'], ['c', 'Desenho']];
function cabecalho(c, { voltar = false } = {}) {
  const menu = opcao('Ver ficha do lead', { icone: 'usuario' }) + (c.etapa ? '' : opcao('Criar lead', { icone: 'usuarioMais' })) +
    opcao('Copiar telefone', { icone: 'copiar' }) + opcao('Arquivar conversa', { icone: 'arquivo' }) + opcao('Apagar conversa', { icone: 'lixo', perigo: true, sep: true }) +
    '<div class="wa-menu-rotulo" role="presentation">Fundo da conversa</div>' + FUNDOS.map(([k, n]) => `<button type="button" class="selecao-opcao" aria-pressed="${est.fundo === k}" data-fundo-op="${k}"><span class="selecao-marca"></span><span class="selecao-opcao-rotulo">${n}</span></button>`).join('');
  return `<header class="wa-cab">
    ${voltar ? `<button type="button" class="btn btn-fantasma btn-icone btn-p wa-voltar" data-voltar aria-label="Voltar para a lista">${ico('esq')}</button>` : ''}
    ${avatar(c, 'm')}
    <div class="wa-cab-id"><strong>${c.nome}</strong><span>${c.fone}</span></div>
    <div class="wa-cab-acoes">
      ${c.etapa ? etq(c.etapa) : '<span class="selo">Sem lead</span><button type="button" class="btn btn-p">Criar lead</button>'}
      <button type="button" class="btn btn-2 btn-icone btn-p" aria-label="Agendar">${ico('agenda')}</button>
      ${pop({ cls: 'btn btn-2 btn-icone btn-p', attr: 'aria-label="Mais ações"', html: ico('mais') }, menu, { alinhar: 'bottom span-left' })}
    </div></header>`;
}

function barras(seed, n = 28) {
  let s = seed * 9301 + 49297;
  return Array.from({ length: n }, () => { s = (s * 9301 + 49297) % 233280; return 6 + Math.round((s / 233280) * 20); });
}
const mmss = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;

function bolha(m, i, todas) {
  if (m.dia) return `<div class="wa-dia"><span>${m.dia}</span></div>`;
  const prox = todas[i + 1], ult = !prox || prox.dia || prox.de !== m.de;
  const meta = `<span class="wa-meta">${m.hora}${m.visto ? ico('visto') : ''}</span>`;
  let corpo;
  if (m.tipo === 'link') corpo = `<p><a class="wa-link" href="#" data-sem-nav>${m.texto}</a></p>${meta}`;
  else if (m.tipo === 'contato') corpo = `<div class="wa-contato"><span class="avatar avatar-m">${ico('usuario')}</span><div><strong>${m.nome}</strong><span>${m.fone}</span></div></div>${meta}`;
  else if (m.tipo === 'audio') corpo = `<div class="wa-audio" data-dur="${m.duracao}"><button type="button" class="wa-play" aria-label="Tocar áudio">${ico('play')}</button>
      <div class="wa-onda" aria-hidden="true">${barras(m.duracao).map(h => `<i style="height:${h}px"></i>`).join('')}</div><span class="wa-dur">${mmss(m.duracao)}</span></div>${meta}`;
  else corpo = `<p>${m.texto}</p>${meta}`;
  return `<div class="wa-msg wa-${m.de}${ult ? ' wa-ult' : ''}"><div class="wa-bolha">${corpo}</div></div>`;
}
const mensagensHtml = ms => ms.map(bolha).join('');

function escrever() {
  const anexo = opcao('Imagem', { icone: 'imagem' }) + opcao('Documento', { icone: 'doc' }) + opcao('Contato', { icone: 'usuario' });
  const emojis = '<div class="wa-emojis">' + ['😀', '😊', '👍', '🙏', '👏', '🎉', '✅', '📅', '📎', '💬', '❤️', '🚀'].map(e => `<button type="button" data-emoji="${e}" aria-label="Emoji ${e}">${e}</button>`).join('') + '</div>';
  return `<form class="wa-escrever" data-escrever autocomplete="off">
    ${pop({ cls: 'btn btn-fantasma btn-icone', attr: 'aria-label="Anexar"', html: ico('clip') }, anexo, { alinhar: 'top span-right' })}
    ${pop({ cls: 'btn btn-fantasma btn-icone', attr: 'aria-label="Emoji"', html: ico('smile') }, emojis, { alinhar: 'top span-right' })}
    <input class="campo-input" type="text" placeholder="Escreva uma mensagem" aria-label="Escreva uma mensagem" data-texto>
    <button type="submit" class="btn btn-icone" aria-label="Enviar" data-envio>${ico('mic')}</button>
  </form>`;
}

/* ===== Tela inteira (interativa) ===== */
const principal = document.getElementById('wa-principal');
function lerFundo() { try { const v = localStorage.getItem('crm-wa-fundo'); return ['liso', 'a', 'b', 'c'].includes(v) ? v : 'liso'; } catch { return 'liso'; } }
const est = { sel: 1, busca: '', etapa: '', nl: false, fundo: lerFundo() };
const enviadas = {};

function itensFiltrados() {
  const q = est.busca.trim().toLowerCase();
  return CONVERSAS.filter(c => (!est.etapa || c.etapa === est.etapa) && (!est.nl || c.nao_lidas) &&
    (!q || (c.nome + ' ' + c.fone + ' ' + c.previa).toLowerCase().includes(q)));
}
function desenharLista() {
  const lista = itensFiltrados(), alvo = principal.querySelector('.wa-itens');
  alvo.innerHTML = lista.length ? lista.map(c => linha(c, { sel: c.id === est.sel })).join('') : vazioBusca();
}
function desenharConversa() {
  const c = CONVERSAS.find(x => x.id === est.sel), alvo = principal.querySelector('.wa-conversa');
  if (!c) { alvo.innerHTML = `<div class="wa-vazio" style="flex:1;border-radius:0">${ico('msg')}<strong>Nenhuma conversa aberta</strong><p>Escolha uma conversa da lista para ver as mensagens.</p></div>`; return; }
  alvo.innerHTML = cabecalho(c, { voltar: true }) + `<div class="wa-msgs" tabindex="0" aria-label="Mensagens"${est.fundo !== 'liso' ? ` data-fundo="${est.fundo}"` : ''}>${mensagensHtml(mensagensDe(c).concat(enviadas[c.id] || []))}</div>` + escrever();
  const m = alvo.querySelector('.wa-msgs'); m.scrollTop = m.scrollHeight;
}
function montarPrincipal() {
  principal.innerHTML = `<div class="wa-lista"><div class="wa-lista-topo"><div class="wa-lista-titulo"><h2>Conversas</h2></div>${filtros(est)}</div><div class="wa-itens"></div></div><div class="wa-conversa"></div>`;
  desenharLista(); desenharConversa();
}
const vazioBusca = () => `<div class="wa-vazio">${ico('lupa')}<strong>Nenhuma conversa encontrada</strong><p>Troque a busca ou limpe o filtro de etapa.</p></div>`;

principal.addEventListener('input', e => {
  if (e.target.matches('[data-busca]')) { est.busca = e.target.value; desenharLista(); }
});
principal.addEventListener('click', e => {
  const l = e.target.closest('.wa-linha');
  if (l) { est.sel = +l.dataset.id; const c = CONVERSAS.find(x => x.id === est.sel); c.nao_lidas = 0; principal.dataset.vista = 'conversa'; desenharLista(); desenharConversa(); return; }
  if (e.target.closest('[data-voltar]')) { principal.dataset.vista = 'lista'; return; }
  const ab = e.target.closest('[data-aba]');
  if (ab) { est.nl = ab.dataset.aba === 'nl'; atualizarFiltros(); return; }
  const op = e.target.closest('.wa-lista .selecao-lista[data-unica] .selecao-opcao');
  if (op) { est.etapa = op.dataset.k; atualizarFiltros(); op.closest('[popover]').hidePopover(); }
});
function atualizarFiltros() {
  const topo = principal.querySelector('.wa-lista-topo');
  topo.querySelectorAll(':scope > :not(.wa-lista-titulo)').forEach(n => n.remove());
  topo.insertAdjacentHTML('beforeend', filtros(est));
  desenharLista();
}

/* ===== Comportamento comum: áudio, enviar, emoji, link ===== */
const timers = new WeakMap();
document.addEventListener('click', e => {
  const play = e.target.closest('.wa-play');
  if (play) {
    const a = play.closest('.wa-audio'), dur = +a.dataset.dur, barrasEl = [...a.querySelectorAll('.wa-onda i')], t = a.querySelector('.wa-dur');
    if (timers.has(a)) { clearInterval(timers.get(a)); timers.delete(a); play.innerHTML = ico('play'); play.setAttribute('aria-label', 'Tocar áudio'); return; }
    let seg = +(a.dataset.pos || 0); if (seg >= dur) seg = 0;
    play.innerHTML = ico('pause'); play.setAttribute('aria-label', 'Pausar áudio');
    const passo = () => {
      seg++; a.dataset.pos = seg;
      barrasEl.forEach((b, i) => b.classList.toggle('tocado', i < Math.round(barrasEl.length * seg / dur)));
      t.textContent = mmss(seg);
      if (seg >= dur) { clearInterval(timers.get(a)); timers.delete(a); play.innerHTML = ico('play'); a.dataset.pos = 0; t.textContent = mmss(dur); barrasEl.forEach(b => b.classList.remove('tocado')); }
    };
    timers.set(a, setInterval(passo, 1000 / Math.max(1, dur / 6)));
    return;
  }
  if (e.target.closest('[data-sem-nav]')) e.preventDefault();
  const em = e.target.closest('[data-emoji]');
  if (em) { const f = em.closest('.wa-escrever, .wa-conversa, .wa-demo, body').querySelector('[data-texto]'); if (f) { f.value += em.dataset.emoji; f.dispatchEvent(new Event('input', { bubbles: true })); f.focus(); } em.closest('[popover]').hidePopover(); }
  const op = e.target.closest('.selecao-lista:not([data-unica]) .selecao-opcao');
  if (op && !op.closest('.wa-lista')) op.closest('[popover]').hidePopover();
});
document.addEventListener('input', e => {
  if (!e.target.matches('[data-texto]')) return;
  const b = e.target.closest('form').querySelector('[data-envio]'), vazio = !e.target.value.trim();
  b.innerHTML = ico(vazio ? 'mic' : 'send'); b.setAttribute('aria-label', vazio ? 'Gravar áudio' : 'Enviar');
});
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-escrever]'); if (!f) return;
  e.preventDefault();
  const campo = f.querySelector('[data-texto]'), txt = campo.value.trim(); if (!txt) return;
  const msg = { de: 'nos', tipo: 'texto', hora: '13:05', texto: txt.replace(/</g, '&lt;'), visto: false };
  (enviadas[est.sel] = enviadas[est.sel] || []).push(msg);
  campo.value = ''; campo.dispatchEvent(new Event('input', { bubbles: true }));
  if (f.closest('#wa-principal')) desenharConversa();
});

/* ===== Blocos de demonstração ===== */
const c1 = CONVERSAS[0], c3 = CONVERSAS[2];
document.getElementById('demo-filtros').innerHTML = `<div class="wa-lista-topo">${filtros({ etapa: '', busca: '', nl: false })}</div>
  <div class="wa-lista-topo">${filtros({ etapa: 'negociacao', busca: 'Fernanda', nl: true })}</div>`;
document.getElementById('demo-linhas').innerHTML =
  linha(c3) + linha({ ...c1, nao_lidas: 0, audio: false, previa: 'Ok, combinado' }) + linha(CONVERSAS[3], { sel: true }) + linha(c1) + linha(CONVERSAS[5], { digitando: true });
document.getElementById('demo-cabecalho').innerHTML = cabecalho(c1) + cabecalho(c3);
document.getElementById('demo-bolhas').innerHTML = mensagensHtml([
  { dia: '24/10/2026' },
  { de: 'eles', tipo: 'texto', hora: '10:41', texto: 'Bom dia! Vim pela página da You e quero saber sobre a contabilidade para o meu negócio.' },
  { de: 'eles', tipo: 'texto', hora: '10:41', texto: 'Pode me ajudar?' },
  { de: 'nos', tipo: 'texto', hora: '10:44', texto: 'Claro! Qual é o regime da sua empresa hoje?', visto: true },
  { de: 'nos', tipo: 'texto', hora: '10:44', texto: 'Posso te ligar ainda esta manhã.', visto: true },
  { de: 'eles', tipo: 'link', hora: '10:50', texto: 'https://exemplo.com.br/materiais/contabilidade' },
  { de: 'nos', tipo: 'contato', hora: '10:52', nome: 'Denis Rocha', fone: '+55 11 91423-7141', visto: true },
]);
document.getElementById('demo-audio').innerHTML = mensagensHtml([
  { de: 'eles', tipo: 'audio', hora: '12:44', duracao: 12 },
  { de: 'nos', tipo: 'audio', hora: '12:46', duracao: 34, visto: true },
]);
document.getElementById('demo-escrever').innerHTML = escrever() + escrever().replace('data-texto>', 'data-texto value="Perfeito, te mando a proposta hoje">').replace(ico('mic') + '</button>', ico('send') + '</button>');
document.getElementById('demo-vazios').innerHTML =
  `<div class="wa-vazio">${ico('msg')}<strong>Nenhuma conversa aberta</strong><p>Escolha uma conversa da lista para ver as mensagens.</p><button type="button" class="btn btn-p">Nova conversa</button></div>
   <div class="wa-vazio">${ico('lupa')}<strong>Nenhuma conversa encontrada</strong><p>Troque a busca ou limpe o filtro de etapa.</p></div>
   <div class="wa-vazio">${ico('msg')}<strong>Sem mensagens ainda</strong><p>Envie a primeira mensagem para começar.</p></div>
   <div class="wa-vazio"><span class="wa-digitando" role="img" aria-label="digitando"><i></i><i></i><i></i></span><strong>Digitando</strong><p>Indicador de que o cliente está escrevendo.</p></div>`;

/* ===== Contraste calculado (W3C) ===== */
const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
function rgbDe(token, sobre, host = document.body) {
  const el = document.createElement('i'); el.style.color = `var(${token})`; host.appendChild(el);
  const cor = getComputedStyle(el).color; el.remove();
  cv.clearRect(0, 0, 1, 1); cv.fillStyle = sobre || '#fff'; cv.fillRect(0, 0, 1, 1); cv.fillStyle = cor; cv.fillRect(0, 0, 1, 1);
  return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3);
}
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hex = ([r, g, b]) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
const PARES = [
  ['Texto na recebida', '--wa-texto', '--wa-recebida', 4.5], ['Hora na recebida', '--wa-hora', '--wa-recebida', 4.5],
  ['Texto na enviada', '--wa-texto', '--wa-enviada', 4.5], ['Hora na enviada', '--wa-hora', '--wa-enviada', 4.5],
  ['Link na recebida', '--acento-texto', '--wa-recebida', 4.5], ['Link na enviada', '--acento-texto', '--wa-enviada', 4.5],
  ['Visto na enviada (ícone)', '--acento-texto', '--wa-enviada', 3], ['Onda tocada na enviada', '--acento-texto', '--wa-enviada', 3],
  ['Onda parada na enviada', '--wa-hora', '--wa-enviada', 3], ['Onda parada na recebida', '--wa-hora', '--wa-recebida', 3],
  ['Data do separador', '--fraco', '--wa-recebida', 4.5], ['Prévia na linha escolhida', '--fraco', '--acento-claro', 4.5],
  ['Nome na linha escolhida', '--texto', '--acento-claro', 4.5], ['Hora de não lida na linha', '--acento-texto', '--sup', 4.5],
];
function contraste() {
  const sup = hex(rgbDe('--sup'));
  const linhas = PARES.map(([nome, fg, bg, min]) => {
    const b = rgbDe(bg, sup), f = rgbDe(fg, hex(b), bg === '--wa-enviada' ? document.querySelector('.wa-nos .wa-bolha') || document.body : document.body), // lê a cor de dentro da bolha enviada (a You escuro troca o --acento-texto ali)
      r = razao(f, b), ok = r >= min;
    return `<tr><td>${nome}</td><td><span class="wa-amostra" style="background:${hex(b)};color:${hex(f)}">Aa</span></td><td>${hex(f)} em ${hex(b)}</td><td>${r.toFixed(2).replace('.', ',')}</td><td>${min.toString().replace('.', ',')}</td><td><span class="selo ${ok ? 'selo-sucesso' : 'selo-perigo'}">${ok ? 'Passa' : 'Reprova'}</span></td></tr>`;
  }).join('');
  document.getElementById('tabela-contraste').innerHTML = `<thead><tr><th>Par</th><th>Amostra</th><th>Cores</th><th>Razão</th><th>Mínimo</th><th>Resultado</th></tr></thead><tbody>${linhas}</tbody>`;
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-fundo-op]'); if (!b) return;
  est.fundo = b.dataset.fundoOp;
  try { localStorage.setItem('crm-wa-fundo', est.fundo); } catch {}
  document.querySelectorAll('[data-fundo-op]').forEach(x => x.setAttribute('aria-pressed', x.dataset.fundoOp === est.fundo));
  const m = principal.querySelector('.wa-msgs');
  if (m) { if (est.fundo === 'liso') m.removeAttribute('data-fundo'); else m.dataset.fundo = est.fundo; }
});
const AMOSTRA = [{ dia: '24/10/2026' }, { de: 'eles', tipo: 'texto', hora: '10:41', texto: 'Bom dia! Quero saber sobre a contabilidade do meu negócio.' },
  { de: 'nos', tipo: 'texto', hora: '10:44', texto: 'Claro! Posso te ligar ainda esta manhã.', visto: true }, { de: 'eles', tipo: 'audio', hora: '10:46', duracao: 12 }];
document.querySelectorAll('[data-amostra-fundo]').forEach(el => { el.innerHTML = mensagensHtml(AMOSTRA); });

montarPrincipal();
contraste();
document.addEventListener('crm:tema', () => requestAnimationFrame(contraste));
new MutationObserver(() => requestAnimationFrame(contraste)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema', 'data-empresa'] });
