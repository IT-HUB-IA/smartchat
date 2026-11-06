/* CRM padrão · base/movimento.js · Dono: Alicerce · movimento do vídeo "Glassy Dashboard V2", só 2D
   O base/casca.js já carrega este arquivo em toda aba. API por atributo, sem JS na aba:
   - data-entra no container (troca A, como o vídeo, é o padrão): os filhos entram em cascata quando aparecem na tela.
     O container lê --cascata, --entra-desfoque e --entra-sobe (padrão nos tokens; redefina no container para outra variante).
   - data-conta num número: conta de 0 até o valor do texto (data-conta="R$ 98.150" troca o texto alvo). Aceita R$, %, milhar com ponto, vírgula.
   - .seg e [data-indicador="pilula|linha"]: indicador que desliza até o filho ativo (aria-pressed, aria-selected ou aria-current).
   Funções: crmEntra(el) repete a entrada (e as contas dentro dele) · crmConta(el) · crmTroca(antes, depois) troca de tela.
   Evento: "crm:entrou" (borbulha) no container quando o último filho termina de entrar. Com prefers-reduced-motion nada anima. */
(function () {
  var html = document.documentElement;
  var parado = window.matchMedia('(prefers-reduced-motion: reduce)');
  function quieto() { return parado.matches; }
  function ms(el, nome, padrao) {   // lê um token de tempo (ms ou s) já resolvido no elemento
    var v = getComputedStyle(el).getPropertyValue(nome).trim();
    if (!v) return padrao;
    return v.slice(-2) === 'ms' ? parseFloat(v) : parseFloat(v) * 1000;
  }

  /* ===== Entrada em cascata ===== */
  function crmEntra(el) {
    var filhos = Array.prototype.filter.call(el.children, function (f) { return !f.hidden && f.tagName !== 'TEMPLATE' && f.tagName !== 'SCRIPT'; });
    filhos.forEach(function (f, i) { f.style.setProperty('--i', i); });
    el.removeAttribute('data-entrando');
    el.setAttribute('data-entrou', '');
    el.querySelectorAll('[data-conta]').forEach(crmConta);
    // container de cascata dentro deste (ex.: lista montada por JS) entra junto; antes ficava escondido para sempre (14.3)
    el.querySelectorAll('[data-entra]').forEach(function (sub) { if (sub !== el) crmEntra(sub); });
    if (quieto()) { el.dispatchEvent(new CustomEvent('crm:entrou', { bubbles: true })); return; }
    void el.offsetWidth;   // reinicia a animação ao repetir
    el.setAttribute('data-entrando', '');
    var total = Math.max(0, filhos.length - 1) * ms(el, '--cascata', 60) + ms(el, '--mov-entrada', 420);
    clearTimeout(el._crmFim);
    el._crmFim = setTimeout(function () {
      el.removeAttribute('data-entrando');
      el.dispatchEvent(new CustomEvent('crm:entrou', { bubbles: true }));
    }, total);
  }

  /* ===== Número contando ===== */
  function crmConta(el) {
    if (el._crmAlvo == null) {
      var txt = el.getAttribute('data-conta') || el.textContent;
      var m = txt.match(/-?\d[\d.]*(,\d+)?/);
      if (!m) return;
      el._crmAlvo = { antes: txt.slice(0, m.index), depois: txt.slice(m.index + m[0].length),
        valor: parseFloat(m[0].replace(/\./g, '').replace(',', '.')), casas: m[1] ? m[1].length - 1 : 0 };
    }
    var a = el._crmAlvo;
    function escreve(v) { el.textContent = a.antes + v.toLocaleString('pt-BR', { minimumFractionDigits: a.casas, maximumFractionDigits: a.casas }) + a.depois; }
    cancelAnimationFrame(el._crmQuadro);
    if (quieto()) { escreve(a.valor); return; }
    var dur = ms(el, '--mov-conta', 700), t0 = performance.now();
    (function passo(t) {
      // o quadro do rAF pode vir com hora ANTES de t0: sem o max, p sai negativo e o número mostra -2 (Gráfico, R3)
      var p = Math.max(0, Math.min(1, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 3);   // desacelera no fim
      escreve(p < 1 ? (a.casas ? a.valor * e : Math.round(a.valor * e)) : a.valor);
      if (p < 1) el._crmQuadro = requestAnimationFrame(passo);
    })(t0);
  }

  /* ===== Troca de tela: a velha some desfocando, a nova entra em cascata ===== */
  // Troca rápida (clicar de novo antes de terminar): a troca pendente no mesmo pai termina NA HORA (o depois dela aparece) e a
  // nova segue; ao fim, só o depois da última troca fica visível entre as telas que passaram por troca nesse pai. Assim nunca
  // ficam duas telas, nem um instante sem nenhuma (14.3: a lista "travava" e o mini CRM ficava com duas telas)
  function crmTroca(antes, depois) {
    var pai = depois.parentNode || (antes && antes.parentNode) || document.body;
    var telas = pai._crmTelas || (pai._crmTelas = []);
    [antes, depois].forEach(function (t) { if (t && telas.indexOf(t) < 0) telas.push(t); });
    if (pai._crmTroca) pai._crmTroca.agora();
    return new Promise(function (ok) {
      var esta = {};
      function entra() {
        if (esta.feito) return;
        esta.feito = true; clearTimeout(esta.timer);
        if (pai._crmTroca === esta) pai._crmTroca = null;
        pai._crmTelas = telas.filter(function (t) { return t.isConnected; });
        pai._crmTelas.forEach(function (t) { if (t !== depois) { t.hidden = true; t.removeAttribute('data-saindo'); } });
        depois.removeAttribute('data-saindo');
        depois.hidden = false;
        // só vira cascata se ninguém dentro já for; se tiver data-entra dentro, é ele que entra (crmEntra desce até ele)
        if (!depois.hasAttribute('data-entra') && !depois.querySelector('[data-entra]')) depois.setAttribute('data-entra', '');
        if (depois.hasAttribute('data-entra')) crmEntra(depois);
        else depois.querySelectorAll('[data-entra]').forEach(crmEntra);
        ok();
      }
      esta.agora = entra;
      if (!antes || antes === depois || antes.hidden || quieto()) return entra();
      pai._crmTroca = esta;
      depois.hidden = true;   // o depois (já posto no mesmo pai) só aparece quando o antes sair
      antes.setAttribute('data-saindo', '');
      esta.timer = setTimeout(entra, ms(antes, '--mov-saida', 150));
    });
  }

  /* ===== Indicador que desliza ===== */
  var ATIVO = '[aria-pressed="true"], [aria-selected="true"], [aria-current]:not([aria-current="false"])';
  function indicador(g) {
    if (g._crmInd) return;
    var ind = document.createElement('span');
    ind.className = 'indicador'; ind.setAttribute('aria-hidden', 'true');
    g.prepend(ind); g._crmInd = ind; g.setAttribute('data-indicador-pronto', '');
    function mover() {
      var a = Array.prototype.find.call(g.children, function (f) { return f !== ind && f.matches(ATIVO); });
      ind.style.opacity = a ? '1' : '0';
      if (!a) return;
      ind.style.width = a.offsetWidth + 'px'; ind.style.height = a.offsetHeight + 'px';
      var novo = 'translate(' + a.offsetLeft + 'px, ' + a.offsetTop + 'px)';
      if (g.hasAttribute('data-indicador-anda') && ind.style.transform && ind.style.transform !== novo && !quieto()) {
        g.setAttribute('data-indicador-movendo', '');
        clearTimeout(g._crmAnda);
        g._crmAnda = setTimeout(function () { g.removeAttribute('data-indicador-movendo'); }, ms(g, '--dur', 240));
      }
      ind.style.transform = novo;
    }
    mover();
    requestAnimationFrame(function () { g.setAttribute('data-indicador-anda', ''); });   // a 1ª posição não desliza
    new MutationObserver(mover).observe(g, { subtree: true, attributes: true, attributeFilter: ['aria-pressed', 'aria-selected', 'aria-current'] });
    if (window.ResizeObserver) new ResizeObserver(mover).observe(g);
    if (document.fonts) document.fonts.ready.then(mover);
  }

  /* ===== Liga tudo: entra e conta quando aparece na tela ===== */
  var visto = window.IntersectionObserver ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      visto.unobserve(e.target);
      if (e.target.hasAttribute('data-entra')) { if (!e.target.hasAttribute('data-entrou')) crmEntra(e.target); }   // já entrou por crmTroca/crmEntra
      else crmConta(e.target);
    });
  }, { threshold: 0.05 }) : null;
  function ligar(raiz) {
    raiz.querySelectorAll('[data-entra]:not([data-entrou])').forEach(function (el) { if (visto && !quieto()) visto.observe(el); else crmEntra(el); });
    raiz.querySelectorAll('[data-conta]').forEach(function (el) {
      if (el.closest('[data-entra]')) return;   // o container conta junto quando entra
      if (visto && !quieto()) visto.observe(el); else crmConta(el);
    });
    raiz.querySelectorAll('.seg, [data-indicador], .abas-luz').forEach(indicador);
  }
  // peça montada por JS depois de carregar também é ligada sozinha (o container novo não fica escondido esperando)
  new MutationObserver(function (ms_) {
    ms_.forEach(function (m) { m.addedNodes.forEach(function (n) {
      if (n.nodeType !== 1) return;
      if (n.matches('[data-entra], [data-conta], .seg, [data-indicador], .abas-luz')) ligar(n.parentNode || n);
      else if (n.querySelector('[data-entra], [data-conta], .seg, [data-indicador], .abas-luz')) ligar(n);
    }); });
  }).observe(document.documentElement, { childList: true, subtree: true });

  window.crmEntra = crmEntra; window.crmConta = crmConta; window.crmTroca = crmTroca;
  window.crmMovimento = { ligar: ligar };   // para peça montada depois por JS: crmMovimento.ligar(elemento)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { ligar(document); }); else ligar(document);
})();
