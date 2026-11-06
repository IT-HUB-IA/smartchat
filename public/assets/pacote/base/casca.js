/* CRM padrão · base/casca.js · Dono: Alicerce
   Carregar no <head> SEM defer: <script src="../base/casca.js"></script> (na raiz: base/casca.js).
   Aplica já no <html> data-tema="claro|escuro" e data-empresa="nevoa|beec|you" (guardados no navegador, valem em todas as abas),
   carrega a Inter e, com a página pronta, põe a barra fina do topo com as abas e as 2 chaves. */
(function () {
  var ABAS = [
    ['01-base', '1 Base'], ['02-botoes', '2 Botões'], ['03-campos', '3 Campos'], ['04-cards', '4 Cards'],
    ['05-graficos', '5 Gráficos'], ['06-casca', '6 Casca'], ['07-janelas', '7 Janelas'], ['08-funil', '8 Funil'],
    ['09-agenda', '9 Agenda'], ['10-tabela', '10 Tabela'], ['11-whatsapp', '11 WhatsApp'], ['12-estados', '12 Estados'],
    ['13-icones', '13 Ícones'], ['14-movimento', '14 Movimento']
  ];
  var html = document.documentElement;
  function ler(k, padrao) { try { return localStorage.getItem(k) || padrao; } catch (e) { return padrao; } }
  function gravar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  // atributo já posto na página (a prova da Lupa força) vence o guardado
  if (!html.dataset.tema) html.dataset.tema = ler('crm-tema', 'claro');
  if (!html.dataset.empresa) html.dataset.empresa = ler('crm-empresa', 'nevoa');

  var fonte = document.createElement('link');
  fonte.rel = 'stylesheet';
  fonte.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(fonte);
  // sem ícone o Chrome pede /favicon.ico e dá 404 no console de toda aba
  if (!document.querySelector('link[rel~="icon"]')) {
    var icone = document.createElement('link');
    icone.rel = 'icon'; icone.href = 'data:,';
    document.head.appendChild(icone);
  }

  var naAba = /\/abas\//.test(location.pathname.replace(/\\/g, '/'));
  // movimento: casca carrega base/movimento.js em toda aba; .crm-mov esconde o que ainda vai entrar (nunca com reduced-motion)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    html.classList.add('crm-mov');
    setTimeout(function () { if (!window.crmEntra) html.classList.remove('crm-mov'); }, 3000);   // se o movimento.js não carregar, mostra tudo
  }
  // arquivos da base que toda aba usa: movimento, ícones (sprite), rodas de hora e ícones animados do animateicons (icones/animateicons.js)
  var aqui = document.currentScript ? document.currentScript.src.replace(/casca\.js(\?.*)?$/, '') : (naAba ? '../' : '') + 'base/';
  function carregar(src) { var s = document.createElement('script'); s.src = src; s.async = false; document.head.appendChild(s); return s; }
  carregar(aqui + 'movimento.js');
  carregar(aqui + 'icones.js');
  carregar(aqui + 'rodas.js');
  carregar(aqui + '../icones/animateicons.js');   // ícones animados REAIS do animateicons (bundle da Moldura, R3)

  var raiz = naAba ? '../' : '';
  window.CRM_ABAS = ABAS.map(function (a) { return { arquivo: 'abas/' + a[0] + '.html', nome: a[1] }; });

  function chave(rotulo, attr, k, opcoes) {
    var g = document.createElement('div');
    g.className = 'casca-chave'; g.setAttribute('role', 'group'); g.setAttribute('aria-label', rotulo);
    opcoes.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = o[1]; b.dataset.valor = o[0];
      b.addEventListener('click', function () {
        html.dataset[attr] = o[0]; gravar(k, o[0]);
        g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        document.dispatchEvent(new CustomEvent('crm:tema'));   // gráficos e contrastes recalculam
      });
      b.setAttribute('aria-pressed', String(html.dataset[attr] === o[0]));
      g.appendChild(b);
    });
    return g;
  }

  function montar() {
    var atual = location.pathname.split('/').pop().replace('.html', '');
    var topo = document.createElement('header');
    topo.className = 'casca-topo';
    var marca = document.createElement('a');
    marca.className = 'casca-marca'; marca.href = raiz + 'index.html'; marca.innerHTML = 'CRM <span>padrão</span>';
    var nav = document.createElement('nav');
    nav.className = 'casca-abas'; nav.setAttribute('aria-label', 'Abas');
    ABAS.forEach(function (a) {
      var l = document.createElement('a');
      l.className = 'casca-aba'; l.href = raiz + 'abas/' + a[0] + '.html'; l.textContent = a[1];
      if (a[0] === atual) l.setAttribute('aria-current', 'page');
      nav.appendChild(l);
    });
    var chaves = document.createElement('div');
    chaves.className = 'casca-chaves';
    chaves.appendChild(chave('Modo', 'tema', 'crm-tema', [['claro', 'Claro'], ['escuro', 'Escuro']]));
    chaves.appendChild(chave('Empresa', 'empresa', 'crm-empresa', [['nevoa', 'Névoa'], ['beec', 'Beec'], ['you', 'You']]));
    topo.append(marca, nav, chaves);
    document.body.prepend(topo);
    var ativa = nav.querySelector('[aria-current]');
    if (ativa) ativa.scrollIntoView({ block: 'nearest', inline: 'center' });
    function rola() {   // marca se as abas rolam e em que ponta está, para o degradê de "tem mais"
      var sobra = nav.scrollWidth - nav.clientWidth;
      if (sobra <= 1) nav.removeAttribute('data-rola');
      else nav.setAttribute('data-rola', nav.scrollLeft <= 1 ? 'inicio' : nav.scrollLeft >= sobra - 1 ? 'fim' : 'meio');
    }
    nav.addEventListener('scroll', rola, { passive: true });
    window.addEventListener('resize', rola);
    if (document.fonts) document.fonts.ready.then(rola);
    rola();
    pendentes(atual, nav, rola);
  }

  /* Natham (R3): a barra mostra SÓ as abas com item pendente (Ajustar ou sem resposta). Lê os data-item de cada aba (fetch, no
     servidor local) contra as marcas do navegador; sem servidor, usa os itens já vistos (crm-itens). Aba sem item conhecido fica.
     "Mostrar todas" é lembrado em crm-mostrar-abas. Publica a próxima aba pendente em window.CRM_PROXIMA + evento crm:pendentes */
  function pendentes(atual, nav, rola) {
    var marcas = {}, vistos = {};
    try { marcas = JSON.parse(localStorage.getItem('crm-aprovacao')) || {}; vistos = JSON.parse(localStorage.getItem('crm-itens')) || {}; } catch (e) {}
    function itensDa(a) {
      // em file:// o fetch sempre falha e enche o console de erro: usa só os itens já vistos no navegador (sem visita, a aba fica)
      if (location.protocol === 'file:') return Promise.resolve(Object.keys(vistos).filter(function (k) { return vistos[k] === a[0] + '.html'; }));
      return fetch(raiz + 'abas/' + a[0] + '.html').then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (t) {
        var doc = new DOMParser().parseFromString(t, 'text/html');
        return Array.prototype.map.call(doc.querySelectorAll('[data-item]'), function (e) { return e.dataset.item; });
      }).catch(function () {
        return Object.keys(vistos).filter(function (k) { return vistos[k] === a[0] + '.html'; });
      });
    }
    // uma aba de cada vez: 14 pedidos juntos derrubavam o servidor simples da prova (ERR_CONNECTION_REFUSED)
    var listas0 = [];
    ABAS.reduce(function (p, a) { return p.then(function () { return itensDa(a).then(function (l) { listas0.push(l); }); }); }, Promise.resolve()).then(function () { return listas0; }).then(function (listas) {
      var pend = ABAS.map(function (a, i) {
        var itens = listas[i];
        return !itens.length || itens.some(function (it) { return (marcas[it] || {}).estado !== 'aprovado'; });
      });
      var todas = ler('crm-mostrar-abas', '0') === '1', escondidas = 0;
      Array.prototype.forEach.call(nav.querySelectorAll('.casca-aba'), function (l, i) {
        var some = !pend[i] && ABAS[i][0] !== atual;
        l.hidden = some && !todas;
        if (some) escondidas++;
      });
      if (escondidas) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'casca-aba casca-todas';
        b.textContent = todas ? 'Só pendentes' : 'Mostrar todas (' + escondidas + ' aprovadas)';
        b.addEventListener('click', function () { gravar('crm-mostrar-abas', todas ? '0' : '1'); location.reload(); });
        nav.appendChild(b);
      }
      var i0 = ABAS.findIndex(function (a) { return a[0] === atual; }), prox = null;
      for (var k = 1; k <= ABAS.length; k++) {
        var j = (i0 + k + ABAS.length) % ABAS.length;
        if (j !== i0 && pend[j]) { prox = { arquivo: raiz + 'abas/' + ABAS[j][0] + '.html', nome: ABAS[j][1] }; break; }
      }
      window.CRM_PROXIMA = prox;
      document.dispatchEvent(new CustomEvent('crm:pendentes', { detail: prox }));
      rola();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
})();
