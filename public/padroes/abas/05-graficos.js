/* =================================================================
   CRM padrão · 05-graficos.js (Gráfico, aba 05)
   Gráfico de linha/área no estilo Winny (área com degradê, linha
   vertical, dica com bolinhas, pílula da data no eixo) com a linha
   FIRME e suave do CRM atual (fb6): B-spline, traço 2px, cor cheia de
   ponta a ponta (linha A, aprovada em 5.1). Ao passar o mouse, como na
   Winny: o trecho perto do mouse acende e o resto da linha apaga um pouco.

     data-grafico="linha"   uma série ou várias (multi canal)

   Atributos (todos opcionais):
     data-dados='{"inicio":"2026-10-01","formato":"numero|real",
                  "series":[{"nome":"Meta","canal":1,"valores":[...]}]}'
                          sem isso usa o exemplo (leads por dia, outubro 2026)
     data-exemplo="total|canais|receita"   qual exemplo usar (padrão total)
     data-altura="320" data-altura-celular="240"
     data-sem-eixos       mini gráfico: só a curva, sem dica nem pílula
     data-legenda         legenda em bolinha abaixo do gráfico
     data-mostrar="9"     já abre com a dica no dia 9 (índice) até o mouse sair
   Outros tipos, mesma dica e mesmas cores:
     data-grafico="funil"      faixas planas sem 3D (data-dados {"etapas":[{nome,valor,etapa,base}]})
     data-grafico="barras"     barras horizontais (data-dados {"itens":[{nome,valor,canal|etapa}]})
     data-grafico="rosca"      rosca com total no meio e legenda com %
     data-grafico="blocos"     um quadro por origem (logo, número, %)
     data-grafico="progresso"  data-valor, data-total, data-rotulo, data-texto, data-cor (nome do token); desenho em anel
     data-logos="../icones/origens/"  em barras, rosca e blocos: logo da origem no lugar da bolinha;
                          na legenda da linha: bolinha da cor + logo + nome
   Entrada (vídeo Glassy): linha sai da esquerda, barras e funil em cascata (--i x --cascata),
     rosca se desenha fatia por fatia; números marcados com data-conta (contagem da base).
     Botão com data-graf-repetir refaz a entrada dos gráficos do mesmo [data-item].
     sem dado (series vazia ou só zeros) mostra a caixa de vazio (ícone #chart-line: a página carrega base/icones.js)
   Evento no elemento: "grafico:mover" (detail.i, null ao sair).
   API: window.CrmGraficos.montar(raiz?), .tocar(el), .exemplo, .formato
   Cor, fonte e tempo SÓ de base/tokens.css (nomes no objeto TK abaixo).
   prefers-reduced-motion: tudo aparece pronto, sem animação.
   ================================================================= */
(function () {
  'use strict';
  if (window.CrmGraficos) return;

  /* nomes dos tokens num lugar só; série única usa --acento-texto (o --acento cheio dá 2,95 no escuro, traço pede 3) */
  const TK = {
    acento: 'var(--acento-texto)', texto: 'var(--texto)', texto2: 'var(--fraco)', eixo: 'var(--grafico-eixo)',
    cartao: 'var(--sup)', borda: 'var(--borda)', grade: 'var(--grafico-grade)', sombra: 'var(--sombra)',
    raio: 'var(--raio-b)', fonte: 'var(--fonte)', curva: 'var(--curva)',
    canal: k => `var(--canal-${['meta', 'google', 'whatsapp', 'site', 'bio', 'indicacao', 'google-organico'][k - 1]})`
  };

  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)');
  const NS = 'http://www.w3.org/2000/svg';
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const CANAIS = ['Meta', 'Google', 'WhatsApp', 'Site', 'Bio', 'Indicação', 'Google orgânico'];

  const CSS = `
.cg{position:relative;width:100%;user-select:none;-webkit-user-select:none}
.cg svg{display:block;width:100%;overflow:visible;touch-action:pan-y;cursor:crosshair}
.cg.mini svg{cursor:default}
.cg .eixo{font:500 11px ${TK.fonte};fill:${TK.eixo};font-variant-numeric:var(--numero-variante)}
.cg .linha-base{transition:opacity .25s ${TK.curva}}
.cg.ativo .linha-base{opacity:.28}
.cg .realce{opacity:0;transition:opacity .2s ${TK.curva}}
.cg.ativo .realce{opacity:1}
.cg .mira,.cg .ponto{opacity:0;transition:opacity .15s ${TK.curva}}
.cg.ativo .mira,.cg.ativo .ponto{opacity:1}
.cg-dica{position:absolute;top:0;left:0;pointer-events:none;background:${TK.cartao};border:1px solid ${TK.borda};border-radius:${TK.raio};box-shadow:${TK.sombra};padding:8px 12px;min-width:176px;font:400 13px/1.45 ${TK.fonte};color:${TK.texto};opacity:0;transition:opacity .15s ${TK.curva};z-index:2;will-change:transform}
.cg.ativo .cg-dica{opacity:1}
.cg-dica .t{font-weight:700;margin-bottom:6px}
.cg-dica .l{display:grid;grid-template-columns:10px 1fr auto;gap:8px;align-items:center;line-height:1.6;color:${TK.texto2}}
.cg-dica .l b{color:${TK.texto};font-weight:var(--numero-peso);font-variant-numeric:var(--numero-variante);text-align:right}
.cg-dica .l i{width:8px;height:8px;border-radius:50%}
.cg-dica .l.total{border-top:1px solid ${TK.borda};margin-top:4px;padding-top:4px}
.cg-pilula{position:absolute;top:0;left:0;pointer-events:none;background:${TK.texto};color:${TK.cartao};border-radius:999px;height:22px;padding:0 10px;display:flex;align-items:center;gap:4px;font:600 11px/22px ${TK.fonte};font-variant-numeric:var(--numero-variante);opacity:0;transition:opacity .15s ${TK.curva};z-index:2;will-change:transform}
.cg.ativo .cg-pilula{opacity:1}
.cg-pilula .tk{display:inline-block;height:22px;overflow:hidden}
.cg-pilula .tk span{display:block;transition:transform 420ms ${TK.curva}}
.cg-pilula .tk em{display:block;font-style:normal;height:22px;text-align:center}
.cg-pilula .tk.dia em{width:2ch}
.cg-legenda{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:12px;font:500 13px/1.4 ${TK.fonte};color:${TK.texto2}}
.cg-legenda span{display:inline-flex;align-items:center;gap:6px}
.cg-legenda i{width:8px;height:8px;border-radius:50%}
.cg-vazio{display:grid;place-items:center;align-content:center;gap:8px;text-align:center;border:1px dashed ${TK.grade};border-radius:${TK.raio};color:${TK.texto2};font:400 14px/1.45 ${TK.fonte};padding:16px}
.cg-vazio b{color:${TK.texto};font-weight:600}
.cg-vazio .ico{width:40px;height:40px;color:${TK.eixo}}
.cg-funil,.cg-barras{display:grid;gap:8px;font:500 13px/1.3 ${TK.fonte};color:${TK.texto}}
.cg-funil .f{display:grid;grid-template-columns:52px 1fr 168px;align-items:center;gap:12px;cursor:default}
.cg-funil .p{text-align:right;color:${TK.texto2};font-weight:var(--numero-peso);font-variant-numeric:var(--numero-variante)}
.cg-funil .trilho{display:flex;justify-content:center}
.cg-funil .barra,.cg-barras .barra{height:40px;border-radius:${TK.raio};display:flex;align-items:center;justify-content:center;font-weight:var(--numero-peso);font-variant-numeric:var(--numero-variante);transform-origin:center;transition:opacity .2s ${TK.curva},transform var(--dur-lenta) ${TK.curva}}
.cg-funil .nome b{display:block;font-weight:600}
.cg-funil .nome span{color:${TK.texto2};font-weight:400;font-size:12px;font-variant-numeric:var(--numero-variante)}
.cg-barras .f{display:grid;grid-template-columns:128px 1fr 72px;align-items:center;gap:12px;cursor:default}
.cg-barras .barra{height:12px;border-radius:999px;transform-origin:left}
.cg-barras .trilho{background:var(--sup-2);border-radius:999px}
.cg-barras .v{text-align:right;font-weight:var(--numero-peso);font-variant-numeric:var(--numero-variante)}
.cg-barras .v span{color:${TK.texto2};font-weight:400}
.cg.reinicia *{transition:none!important}
@media (prefers-reduced-motion:no-preference){.cg:not(.entrou) .barra{transform:scaleX(0)}}
.cg-funil .f,.cg-barras .f{transition:opacity var(--dur-lenta) ${TK.curva} calc(var(--i) * var(--cascata)),transform var(--dur-lenta) ${TK.curva} calc(var(--i) * var(--cascata))}
.cg-funil .f .barra,.cg-barras .f .barra{transition-delay:0s,calc(var(--i) * var(--cascata))}
@media (prefers-reduced-motion:no-preference){.cg:not(.entrou) .cg-funil .f{opacity:0;transform:translateY(8px)}}
.cg-funil .barra{transform:none!important}
.cg.ativo .f .barra{opacity:.35}
.cg.ativo .f.on .barra{opacity:1}
.cg-rosca{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:24px}
.cg-rosca .cg-roda{position:relative;width:180px;height:180px}
.cg-rosca svg{width:180px;height:180px;cursor:default}
.cg-rosca circle.s{fill:none;stroke-width:22;stroke-dasharray:var(--d) var(--c);transition:opacity .2s ${TK.curva},stroke-width .2s ${TK.curva},stroke-dasharray var(--dur-lenta) ${TK.curva} calc(var(--i) * var(--cascata))}
@media (prefers-reduced-motion:no-preference){.cg:not(.entrou) .cg-rosca circle.s{stroke-dasharray:0 var(--c)}}
.cg.ativo .cg-rosca circle.s{opacity:.35}
.cg.ativo .cg-rosca circle.s.on{opacity:1;stroke-width:28}
.cg-rosca .meio{position:absolute;inset:0;display:grid;place-content:center;text-align:center;pointer-events:none;font-family:${TK.fonte}}
.cg-rosca .meio b{font-size:28px;font-weight:var(--numero-peso);font-variant-numeric:var(--numero-variante);letter-spacing:-.02em;color:${TK.texto}}
.cg-rosca .meio span{font-size:12px;color:${TK.texto2}}
.cg-rosca .cg-legenda{display:grid;gap:6px;margin:0}
.cg-rosca .cg-legenda>span{justify-content:space-between;gap:16px;cursor:default}
.cg-rosca .cg-legenda b{color:${TK.texto};font-weight:var(--numero-peso);font-variant-numeric:var(--numero-variante)}
.cg-progresso{display:grid;grid-template-columns:48px auto 1fr;align-items:center;gap:12px;font:400 13px/1.4 ${TK.fonte};color:${TK.texto2}}
.cg-progresso b{color:${TK.texto};font-weight:600}
.cg-progresso svg{width:48px;height:48px}
.cg-progresso circle{fill:none;stroke-width:6}
.cg-progresso .trilho-anel{stroke:var(--sup-2)}
.cg-progresso .anel{stroke-linecap:round;stroke-dasharray:var(--d) var(--c);transition:stroke-dasharray var(--dur-lenta) ${TK.curva}}
@media (prefers-reduced-motion:no-preference){.cg:not(.entrou) .cg-progresso .anel{stroke-dasharray:0 var(--c)}}
.cg-progresso .pc{color:${TK.texto};font-size:20px;letter-spacing:-.02em;font-weight:var(--numero-peso);font-variant-numeric:var(--numero-variante)}
.cg-progresso div{display:grid}
.cg-logo{width:18px;height:18px;flex:none;object-fit:contain}
.cg-barras .nome,.cg-blocos .nome{display:inline-flex;align-items:center;gap:8px;min-width:0}
.cg-barras.com-logo .f{grid-template-columns:156px 1fr 72px}
.cg-rosca .cg-legenda .cg-logo{width:16px;height:16px;vertical-align:-3px}
.cg-blocos{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;font:500 13px/1.3 ${TK.fonte};color:${TK.texto}}
.cg-blocos .f{display:grid;gap:4px;padding:12px;border-radius:var(--raio-b);background:var(--sup-2);cursor:default;transition:opacity var(--dur-lenta) ${TK.curva} calc(var(--i) * var(--cascata)),transform var(--dur-lenta) ${TK.curva} calc(var(--i) * var(--cascata))}
@media (prefers-reduced-motion:no-preference){.cg:not(.entrou) .cg-blocos .f{opacity:0;transform:translateY(8px)}}
.cg-blocos b{font-size:25px;font-weight:var(--numero-peso);font-variant-numeric:var(--numero-variante);letter-spacing:-.02em}
.cg-blocos .pc{color:${TK.texto2};font-weight:400;font-size:12px}
.cg-blocos .fio{height:4px;border-radius:999px;background:${TK.cartao};margin-top:4px;overflow:hidden}
.cg-blocos .barra{height:100%;border-radius:999px;transform-origin:left;transition:transform var(--dur-lenta) ${TK.curva} calc(var(--i) * var(--cascata))}
.cg-blocos .f>*{transition:opacity .2s ${TK.curva}}
.cg.ativo .cg-blocos .f>*{opacity:.5}
.cg.ativo .cg-blocos .f.on>*{opacity:1}
@media (max-width:560px){.cg-funil .f{grid-template-columns:40px 1fr 112px;gap:8px}.cg-barras .f{grid-template-columns:92px 1fr 64px;gap:8px}.cg-rosca{grid-template-columns:1fr;justify-items:center}}
@media (prefers-reduced-motion:reduce){.cg .linha-base,.cg .realce,.cg-dica,.cg-pilula,.cg .mira,.cg .ponto,.cg-pilula .tk span{transition:none}}
`;
  function injetarCSS() {
    if (document.getElementById('crm-graficos-css')) return;
    const st = document.createElement('style');
    st.id = 'crm-graficos-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ---------- exemplo: leads por dia e canal, 1 a 30 out 2026 (fictício) ---------- */
  function aleatorio(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const EX = (function () {
    /* ritmo do fb6: patamares inteiros e morros de 3 a 5 dias, nada de serrilhado dia a dia */
    const rnd = aleatorio(30), alturas = [0, 4, 3, 3, 3, 2, 2];
    const morros = (k, qtd) => {
      const v = new Array(30).fill(0);
      for (let m = 0; m < qtd; m++) {
        const c = Math.floor(rnd() * 30), larg = 2 + Math.floor(rnd() * 3), alt = 1 + Math.floor(rnd() * alturas[k]);
        for (let i = c - larg; i <= c + larg; i++) if (i >= 0 && i < 30) v[i] = Math.max(v[i], Math.round(alt * (1 - Math.abs(i - c) / (larg + 1)) + .4));
      }
      return v;
    };
    const canais = CANAIS.map((nome, k) => ({
      nome, canal: k + 1,
      valores: k ? morros(k, 3) : [2, 2, 2, 2, 3, 4, 4, 3, 6, 11, 11, 8, 5, 3, 3, 2, 2, 2, 3, 4, 5, 5, 4, 3, 3, 3, 3, 4, 4, 3] /* Meta: campanha de 9 a 12 out */
    }));
    const total = canais[0].valores.map((_, i) => canais.reduce((s, c) => s + c.valores[i], 0));
    const receita = Array.from({ length: 30 }, (_, i) => Math.round((1900 + 850 * Math.sin(i / 4.2 + .8) + 22 * i + (rnd() - .5) * 80) / 10) * 10);
    return { inicio: '2026-10-01', canais, total, receita };
  })();

  /* ---------- formatos pt-BR ---------- */
  const nf = (x, d = 0) => x.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const real = x => 'R$ ' + nf(x);
  const curto = x => x >= 1000 ? nf(x / 1000, x % 1000 === 0 ? 0 : 1) + ' mil' : nf(x);
  const dataCurta = d => d.getDate() + ' ' + MESES[d.getMonth()];
  const tituloData = d => d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '').replace(',', ' ·');
  function dias(inicio, n) {
    const [a, m, d] = String(inicio || EX.inicio).split('-').map(Number);
    return Array.from({ length: n }, (_, i) => new Date(a, m - 1, d + i));
  }

  /* ---------- tempo e curva da entrada (tokens, com o padrão da Winny) ---------- */
  function bezier(x1, y1, x2, y2) {
    const ax = 3 * x1 - 3 * x2 + 1, bx = 3 * x2 - 6 * x1, cx = 3 * x1;
    const ay = 3 * y1 - 3 * y2 + 1, by = 3 * y2 - 6 * y1, cy = 3 * y1;
    const sx = t => ((ax * t + bx) * t + cx) * t, sy = t => ((ay * t + by) * t + cy) * t;
    return function (x) { let lo = 0, hi = 1, t = x; for (let k = 0; k < 30; k++) { t = (lo + hi) / 2; if (sx(t) < x) lo = t; else hi = t; } return sy(t); };
  }
  function lerToken(nome) { return getComputedStyle(document.documentElement).getPropertyValue(nome).trim(); }
  function curvaEntrada() {
    const m = lerToken('--curva').match(/cubic-bezier\(([^)]+)\)/);
    const n = m ? m[1].split(',').map(Number) : [0.85, 0, 0.15, 1];
    return bezier(n[0], n[1], n[2], n[3]);
  }
  function msEntrada(el) { const v = getComputedStyle(el || document.documentElement).getPropertyValue('--dur-lenta').trim(); return v ? parseFloat(v) * (v.endsWith('ms') ? 1 : 1000) : 420; }

  /* ---------- curva: trechos cúbicos [x0,y0,c1x,c1y,c2x,c2y,x1,y1] ---------- */
  /* B-spline uniforme (pontas triplicadas): bem lisa, fica dentro dos pontos (nunca fura o zero);
     no pico passa um pouco abaixo do valor, a dica mostra o número exato */
  function basis(px, py) {
    const n = px.length, seg = [], Q = i => [px[Math.max(0, Math.min(n - 1, i - 2))], py[Math.max(0, Math.min(n - 1, i - 2))]];
    for (let k = 0; k <= n; k++) {
      const q0 = Q(k), q1 = Q(k + 1), q2 = Q(k + 2), q3 = Q(k + 3), v = (a, b, c, d, j) => (a * q0[j] + b * q1[j] + c * q2[j] + d * q3[j]) / 6;
      seg.push([v(1, 4, 1, 0, 0), v(1, 4, 1, 0, 1), v(0, 4, 2, 0, 0), v(0, 4, 2, 0, 1), v(0, 2, 4, 0, 0), v(0, 2, 4, 0, 1), v(0, 1, 4, 1, 0), v(0, 1, 4, 1, 1)]);
    }
    return seg;
  }
  const caminho = seg => 'M' + seg[0][0].toFixed(2) + ',' + seg[0][1].toFixed(2) + seg.map(s => 'C' + s.slice(2).map(v => v.toFixed(2)).join(',')).join('');
  /* y(x) por amostragem dos trechos: serve para qualquer curva */
  function yDeX(seg) {
    const xs = [], ys = [];
    seg.forEach(s => { for (let j = 0; j <= 24; j++) { const t = j / 24, u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t; xs.push(a * s[0] + b * s[2] + c * s[4] + d * s[6]); ys.push(a * s[1] + b * s[3] + c * s[5] + d * s[7]); } });
    return x => {
      if (x <= xs[0]) return ys[0];
      let k = 1; while (k < xs.length - 1 && xs[k] < x) k++;
      const f = (x - xs[k - 1]) / ((xs[k] - xs[k - 1]) || 1);
      return ys[k - 1] + (ys[k] - ys[k - 1]) * Math.max(0, Math.min(1, f));
    };
  }

  function escalaY(max, partes) {
    if (max <= 0) return { topo: partes, passo: 1 };
    const bruto = max / partes, p = Math.pow(10, Math.floor(Math.log10(bruto)));
    const passo = Math.max(1, [1, 2, 2.5, 3, 5, 10].map(f => f * p).find(s => s >= bruto));
    return { topo: passo * Math.ceil(max / passo), passo };
  }
  function el(nome, at, pai) { const e = document.createElementNS(NS, nome); for (const k in at) e.setAttribute(k, at[k]); if (pai) pai.appendChild(e); return e; }
  function stop(g, off, cor, op) { el('stop', { offset: off, style: `stop-color:${cor}`, 'stop-opacity': op }, g); }
  const linhaDica = (cor, nome, val, cls = '') => `<div class="l ${cls}"><i style="background:${cor}"></i><span>${nome}</span><b>${val}</b></div>`;

  /* ---------- configuração ---------- */
  function lerConfig(root) {
    let dados = null;
    if (root.dataset.dados) { try { dados = JSON.parse(root.dataset.dados); } catch (e) { console.error('05-graficos: data-dados inválido', e); } }
    if (!dados) dados = root.dataset.exemplo === 'canais' ? { inicio: EX.inicio, formato: 'numero', series: EX.canais }
      : root.dataset.exemplo === 'receita' ? { inicio: EX.inicio, formato: 'real', series: [{ nome: 'Receita fechada', valores: EX.receita }] }
      : { inicio: EX.inicio, formato: 'numero', series: [{ nome: 'Leads', valores: EX.total }] };
    const fmt = dados.formato === 'real' ? real : (x => nf(x));
    if (!dados.series || !dados.series.length || dados.series.every(s => !s.valores || s.valores.every(v => !v))) return { vazio: true, texto: dados.vazio };
    const series = dados.series.map(s => ({ nome: s.nome, valores: s.valores, slug: s.canal ? SLUG[s.canal - 1] : null, cor: s.canal ? TK.canal(s.canal) : TK.acento }));
    const D = dias(dados.inicio, series[0].valores.length);
    const multi = series.length > 1;
    return {
      D, series, fmt, multi,
      rotulo: series.map(s => s.nome).join(', ') + ' por dia, de ' + dataCurta(D[0]) + ' a ' + dataCurta(D[D.length - 1]),
      detalhe: i => `<div class="t">${tituloData(D[i])}</div>` +
        series.map(s => ({ s, v: s.valores[i] })).sort((a, b) => b.v - a.v).map(o => linhaDica(o.s.cor, o.s.nome, fmt(o.v))).join('') +
        (multi ? `<div class="l total"><span></span><span>Total</span><b>${fmt(series.reduce((t, s) => t + s.valores[i], 0))}</b></div>` : '')
    };
  }

  /* ---------- o gráfico ---------- */
  let contaId = 0;
  function Grafico(root) {
    const cfg = lerConfig(root);
    if (cfg.vazio) return Vazio(root, cfg.texto);
    cfg.eixos = !root.hasAttribute('data-sem-eixos');
    const id = 'cg' + (++contaId);
    const st = { i: null, x: 0, vx: 0, alvo: 0, ativo: false, prog: reduz.matches ? 1 : 0, raf: 0, rafE: 0, larg: 0 };
    const entrada = curvaEntrada();
    let G = {};
    root.classList.add('cg');
    if (!cfg.eixos) root.classList.add('mini');

    function montar() {
      root.innerHTML = '';
      const W = root.clientWidth || 600;
      st.larg = W;
      const celular = W < 520;
      const altura = +(celular && root.dataset.alturaCelular ? root.dataset.alturaCelular : root.dataset.altura) || 0;
      const H = cfg.eixos ? (altura || 300) : (root.clientHeight || 56);
      const M = cfg.eixos ? { t: 14, r: 12, b: 40, l: celular ? 32 : 40 } : { t: 6, r: 4, b: 4, l: 4 };
      const w = W - M.l - M.r, h = H - M.t - M.b, n = cfg.series[0].valores.length;
      const svg = el('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': cfg.rotulo }, root);
      const defs = el('defs', {}, svg);
      const ey = escalaY(Math.max(...cfg.series.flatMap(s => s.valores)) * 1.05, celular ? 3 : 4);
      const yS = v => M.t + h - (v / ey.topo) * h;
      const xS = i => M.l + (w * i) / (n - 1);

      if (cfg.eixos) {
        for (let v = 0; v <= ey.topo + 1e-9; v += ey.passo) {
          const y = yS(v);
          el('line', { x1: M.l, x2: M.l + w, y1: y, y2: y, style: `stroke:${TK.grade}`, 'stroke-dasharray': v === 0 ? 'none' : '3 5' }, svg);
          el('text', { x: M.l - 10, y: y + 4, 'text-anchor': 'end', class: 'eixo' }, svg).textContent = curto(v);
        }
        const ult = n - 1, passos = celular ? [0, Math.round(ult / 2), ult] : [0, 3, 6, 9, 12, 15, 18, 21, 24, 27].filter(i => i <= ult);
        passos.forEach(i => { el('text', { x: xS(i), y: M.t + h + 24, 'text-anchor': 'middle', class: 'eixo' }, svg).textContent = dataCurta(cfg.D[i]); });
      }

      /* entrada: recorte que cresce da esquerda (scaleX) */
      const x0 = M.l - 4;
      const clipR = el('rect', { x: x0, y: -H, width: w + 8, height: H * 3 }, el('clipPath', { id: id + 'cl' }, defs));
      const camada = el('g', { 'clip-path': `url(#${id}cl)` }, svg);
      const traco = cfg.eixos ? 2 : 1.75;
      const curvas = cfg.series.map((s, j) => {
        const px = s.valores.map((_, i) => xS(i)), py = s.valores.map(yS);
        const seg = basis(px, py);
        const d = caminho(seg);
        const ga = el('linearGradient', { id: id + 'a' + j, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
        stop(ga, 0, s.cor, cfg.multi ? .16 : .28); stop(ga, 1, s.cor, 0);
        el('path', { d: d + `L${px[n - 1]},${M.t + h}L${px[0]},${M.t + h}Z`, fill: `url(#${id}a${j})` }, camada);
        const c = { y: yDeX(seg), hl: null };
        el('path', { d, fill: 'none', style: `stroke:${s.cor}`, 'stroke-width': traco, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'linha-base' }, camada);
        /* realce da Winny: trecho de 300px que acende em volta do mouse (o degradê anda em posicionar) */
        if (cfg.eixos) {
          c.hl = el('linearGradient', { id: id + 'h' + j, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 300, y2: 0 }, defs);
          [[0, 0], [.5, 1], [1, 0]].forEach(o => stop(c.hl, o[0], s.cor, o[1]));
          el('path', { d, fill: 'none', stroke: `url(#${id}h${j})`, 'stroke-width': 3, 'stroke-linecap': 'round', class: 'realce' }, camada);
        }
        return c;
      });

      let mira = null, pontos = [], dica = null, pil = null, tkDia = null, tkMes = null;
      if (cfg.eixos) {
        const gv = el('linearGradient', { id: id + 'v', gradientUnits: 'userSpaceOnUse', x1: 0, y1: M.t, x2: 0, y2: M.t + h }, defs);
        [[0, 0], [.15, .9], [.85, .9], [1, 0]].forEach(o => stop(gv, o[0], TK.texto, o[1]));
        mira = el('line', { x1: 0, x2: 0, y1: M.t, y2: M.t + h, stroke: `url(#${id}v)`, 'stroke-width': 1, class: 'mira' }, svg);
        pontos = cfg.series.map(s => el('circle', { cx: 0, cy: 0, r: cfg.multi ? 4 : 5, style: `fill:${s.cor};stroke:${TK.cartao}`, 'stroke-width': 2, class: 'ponto' }, svg));
        dica = document.createElement('div'); dica.className = 'cg-dica'; dica.setAttribute('aria-hidden', 'true'); root.appendChild(dica);
        pil = document.createElement('div'); pil.className = 'cg-pilula'; pil.setAttribute('aria-hidden', 'true');
        pil.innerHTML = '<span class="tk dia"><span>' + Array.from({ length: 31 }, (_, j) => '<em>' + (j + 1) + '</em>').join('') + '</span></span><span class="tk mes"><span>' + MESES.map(m => '<em>' + m + '</em>').join('') + '</span></span>';
        root.appendChild(pil);
        tkDia = pil.querySelector('.dia span'); tkMes = pil.querySelector('.mes span');
      }
      if (root.hasAttribute('data-legenda')) {
        const lg = document.createElement('div'); lg.className = 'cg-legenda';
        lg.innerHTML = cfg.series.map(s => root.dataset.logos && s.slug ? `<span><i style="background:${s.cor}"></i>${marca(root, s)}${s.nome}</span>` : `<span><i style="background:${s.cor}"></i>${s.nome}</span>`).join('');
        root.appendChild(lg);
      }
      G = { W, M, w, h, n, xS, svg, clipR, x0, curvas, mira, pontos, dica, pil, tkDia, tkMes };
      aplicarProg();
      if (st.ativo && st.i !== null) { const i = st.i; st.i = null; atualizarIndice(i); st.x = st.alvo; posicionar(); }
    }

    function aplicarProg() { G.clipR.setAttribute('transform', `translate(${G.x0} 0) scale(${Math.max(.0001, st.prog)} 1) translate(${-G.x0} 0)`); }
    function indicePorX(x) { return Math.max(0, Math.min(G.n - 1, Math.round(((x - G.M.l) / G.w) * (G.n - 1)))); }

    function posicionar() {
      const { xS, mira, pontos, curvas, dica, pil, M, h, W } = G;
      if (!mira) return;
      const x = st.x;
      mira.setAttribute('transform', `translate(${x} 0)`);
      pontos.forEach((p, j) => p.setAttribute('transform', `translate(${x} ${curvas[j].y(x)})`));
      curvas.forEach(c => c.hl && c.hl.setAttribute('gradientTransform', `translate(${x - 150} 0)`));
      if (st.i !== null) {
        const dw = dica.offsetWidth, dh = dica.offsetHeight;
        const left = xS(st.i) + 16 + dw < W - 4 ? x + 16 : x - 16 - dw;
        dica.style.transform = `translate(${Math.max(0, left)}px,${Math.max(0, Math.min(M.t + h - dh, M.t + 8))}px)`;
      }
      const pw = pil.offsetWidth;
      pil.style.transform = `translate(${Math.max(0, Math.min(W - pw, x - pw / 2))}px,${M.t + h + 12}px)`;
    }

    function atualizarIndice(i) {
      if (i === st.i) return;
      st.i = i;
      st.alvo = G.xS(i);
      G.dica.innerHTML = cfg.detalhe(i);
      G.tkDia.style.transform = `translateY(${-(cfg.D[i].getDate() - 1) * 22}px)`;
      G.tkMes.style.transform = `translateY(${-cfg.D[i].getMonth() * 22}px)`;
      root.dispatchEvent(new CustomEvent('grafico:mover', { detail: { i, data: cfg.D[i], valores: cfg.series.map(s => s.valores[i]) } }));
      if (reduz.matches) { st.x = st.alvo; posicionar(); } else animarMola();
    }

    /* mola: o ponto desliza até o dia novo seguindo a curva */
    function animarMola() {
      if (st.raf) return;
      let antes = performance.now();
      const passo = agora => {
        const dt = Math.min(.032, (agora - antes) / 1000); antes = agora;
        st.vx += ((st.alvo - st.x) * 320 - st.vx * 30) * dt; st.x += st.vx * dt;
        posicionar();
        if (Math.abs(st.alvo - st.x) < .3 && Math.abs(st.vx) < 2) { st.x = st.alvo; st.vx = 0; posicionar(); st.raf = 0; return; }
        st.raf = requestAnimationFrame(passo);
      };
      st.raf = requestAnimationFrame(passo);
    }

    function xLocal(ev) { const r = G.svg.getBoundingClientRect(); return (ev.clientX - r.left) * (G.W / r.width); }
    function ligar() {
      root.addEventListener('pointermove', ev => {
        if (!st.ativo) { st.ativo = true; root.classList.add('ativo'); st.i = null; st.x = st.alvo = G.xS(indicePorX(xLocal(ev))); st.vx = 0; }
        atualizarIndice(indicePorX(xLocal(ev)));
      });
      root.addEventListener('pointerleave', () => {
        st.ativo = false; root.classList.remove('ativo'); st.i = null;
        root.dispatchEvent(new CustomEvent('grafico:mover', { detail: { i: null } }));
      });
    }

    const g = {
      root, st, cfg, montar,
      tocar() {
        cancelAnimationFrame(st.rafE);
        if (reduz.matches) { st.prog = 1; aplicarProg(); return; }
        const t0 = performance.now(), dur = msEntrada(root);
        const quadro = agora => { const p = Math.min(1, (agora - t0) / dur); st.prog = entrada(p); aplicarProg(); if (p < 1) st.rafE = requestAnimationFrame(quadro); };
        st.prog = 0; aplicarProg();
        st.rafE = requestAnimationFrame(quadro);
      },
      mostrar(i) { st.ativo = true; root.classList.add('ativo'); st.i = null; atualizarIndice(i); st.x = st.alvo; st.vx = 0; posicionar(); }
    };
    root._cg = g;
    montar();
    if (cfg.eixos) ligar();
    if (cfg.eixos && root.dataset.mostrar) requestAnimationFrame(() => g.mostrar(+root.dataset.mostrar));
    return g;
  }

  /* ---------- peças comuns dos outros tipos ---------- */
  function lerDados(root) {
    if (!root.dataset.dados) return null;
    try { return JSON.parse(root.dataset.dados); } catch (e) { console.error('05-graficos: data-dados inválido', e); return null; }
  }
  const SLUG = ['meta', 'google', 'whatsapp', 'site', 'bio', 'indicacao', 'google-organico'];
  const somaCanais = () => EX.canais.map(c => ({ nome: c.nome, slug: SLUG[c.canal - 1], cor: TK.canal(c.canal), valor: c.valores.reduce((a, b) => a + b, 0) })).sort((a, b) => b.valor - a.valor);
  /* logo da origem (data-logos="../icones/origens/") ou a bolinha da cor */
  const marca = (root, o) => root.dataset.logos && o.slug ? `<img class="cg-logo" src="${root.dataset.logos}${o.slug}.svg" alt="">` : `<i style="background:${o.cor}"></i>`;
  const itensDe = (root, d) => d && d.itens ? d.itens.map(o => ({ nome: o.nome, valor: o.valor, slug: o.canal ? SLUG[o.canal - 1] : null, cor: corItem(o)[0] })) : somaCanais();
  const corItem = o => o.etapa === 'acento' ? ['var(--acento)', 'var(--no-acento)'] : o.etapa ? [`var(--etapa-${o.etapa})`, 'var(--no-etapa)'] : [o.canal ? TK.canal(o.canal) : TK.acento, null];
  /* a mesma dica da linha, seguindo o ponteiro; linhas = [[cor, nome, valor], ...] */
  function dicaSolta(root) {
    const dica = document.createElement('div'); dica.className = 'cg-dica'; dica.setAttribute('aria-hidden', 'true'); root.appendChild(dica);
    return {
      mostrar(ev, titulo, linhas) {
        dica.innerHTML = `<div class="t">${titulo}</div>` + linhas.map(l => linhaDica(l[0], l[1], l[2], l[3] || '')).join('');
        const r = root.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top, dw = dica.offsetWidth;
        dica.style.transform = `translate(${Math.max(0, x + 16 + dw < r.width ? x + 16 : x - 16 - dw)}px,${Math.max(0, y - 12)}px)`;
        root.classList.add('ativo');
      },
      esconder() { root.classList.remove('ativo'); }
    };
  }
  /* liga a dica a cada [data-i] do tipo; marca o escolhido com .on */
  function ligarItens(root, itens, conteudo) {
    const d = dicaSolta(root);
    root.addEventListener('pointermove', ev => {
      const alvo = ev.target.closest('[data-i]');
      if (!alvo || !root.contains(alvo)) { d.esconder(); itens().forEach(e => e.classList.remove('on')); return; }
      const i = +alvo.dataset.i;
      itens().forEach(e => e.classList.toggle('on', +e.dataset.i === i));
      const c = conteudo(i); d.mostrar(ev, c[0], c[1]);
    });
    root.addEventListener('pointerleave', () => { d.esconder(); itens().forEach(e => e.classList.remove('on')); });
  }
  /* entrada dos tipos com CSS: a classe .entrou solta a transição */
  const tipoSimples = (root, desenhar) => {
    root.classList.add('cg');
    const g = { root, st: { larg: 0 }, montar() { g.st.larg = root.clientWidth; }, tocar() {
      /* volta ao zero sem transição (senão a volta anima e a entrada só desfaz a volta) */
      root.classList.add('reinicia'); root.classList.remove('entrou'); void root.offsetWidth; root.classList.remove('reinicia');
      requestAnimationFrame(() => root.classList.add('entrou'));
      if (window.crmConta) root.querySelectorAll('[data-conta]').forEach(window.crmConta);
    } };
    desenhar(); root._cg = g; g.montar();
    return g;
  };

  /* vazio: mesma caixa para qualquer gráfico sem dado */
  function Vazio(root, texto) {
    return tipoSimples(root, () => {
      root.classList.add('entrou');
      const altura = +root.dataset.altura || 240;
      root.innerHTML = `<div class="cg-vazio" style="min-height:${altura}px" role="img" aria-label="Sem dados no período">
        <svg class="ico" aria-hidden="true"><use href="#chart-line"/></svg>
        <b>${texto || 'Nenhum dado no período'}</b><span>Troque o período ou o filtro para ver o gráfico.</span></div>`;
    });
  }

  /* funil sem 3D: faixas planas centradas, largura em escala log (60 mil e 5 cabem juntos) */
  const FUNIL_EX = [
    { nome: 'Impressões', valor: 60783, etapa: 'acento' }, { nome: 'Cliques', valor: 658, etapa: 'acento' },
    { nome: 'Lead novo', valor: 130, etapa: 'novo', base: true }, { nome: 'Em qualificação', valor: 74, etapa: 'qualificacao' },
    { nome: 'Reunião agendada', valor: 28, etapa: 'reuniao' }, { nome: 'Em negociação', valor: 13, etapa: 'negociacao' },
    { nome: 'Ganho', valor: 5, etapa: 'ganho' }
  ];
  function Funil(root) {
    const et = (lerDados(root) || {}).etapas || FUNIL_EX;
    const max = Math.max(...et.map(o => o.valor)), ib = Math.max(0, et.findIndex(o => o.base));
    const larg = v => 22 + 78 * Math.log(1 + v) / Math.log(1 + max);
    const pctBase = i => i < ib ? '' : nf(et[i].valor / et[ib].valor * 100, 0) + '%';
    const g = tipoSimples(root, () => {
      root.innerHTML = `<div class="cg-funil" role="list" aria-label="Funil do período">` + et.map((o, i) => {
        const [fundo, letra] = corItem(o);
        return `<div class="f" role="listitem" data-i="${i}" style="--i:${i}"><span class="p">${pctBase(i)}</span><span class="trilho"><span class="barra" style="width:${larg(o.valor).toFixed(1)}%;background:${fundo};color:${letra}"><span data-conta>${nf(o.valor)}</span></span></span><span class="nome"><b>${o.nome}</b>${i ? `<span>${nf(o.valor / et[i - 1].valor * 100, 1)}% da etapa anterior</span>` : '<span>topo do funil</span>'}</span></div>`;
      }).join('') + '</div>';
    });
    ligarItens(root, () => root.querySelectorAll('.f'), i => [et[i].nome, [
      [corItem(et[i])[0], 'Quantidade', nf(et[i].valor)],
      ...(i ? [[TK.eixo, 'Passou da anterior', nf(et[i].valor / et[i - 1].valor * 100, 1) + '%']] : []),
      ...(i > ib ? [[TK.eixo, 'Do lead novo', pctBase(i)]] : []),
      ...(i && i < et.length ? [[TK.eixo, 'Perdidos aqui', nf(et[i - 1].valor - et[i].valor), 'total']] : [])
    ]]);
    return g;
  }

  /* barras horizontais: por canal (padrão) ou o que vier em data-dados.itens */
  function Barras(root) {
    const d = lerDados(root);
    const itens = itensDe(root, d);
    const fmt = d && d.formato === 'real' ? real : (x => nf(x));
    const total = itens.reduce((a, o) => a + o.valor, 0), max = Math.max(...itens.map(o => o.valor));
    const g = tipoSimples(root, () => {
      root.innerHTML = `<div class="cg-barras${root.dataset.logos ? ' com-logo' : ''}" role="list">` + itens.map((o, i) =>
        `<div class="f" role="listitem" data-i="${i}" style="--i:${i}"><span class="nome">${root.dataset.logos ? marca(root, o) : ''}${o.nome}</span><span class="trilho"><span class="barra" style="display:block;width:${(o.valor / max * 100).toFixed(1)}%;background:${o.cor}"></span></span><span class="v"><span data-conta>${fmt(o.valor)}</span> <span>${nf(o.valor / total * 100, 0)}%</span></span></div>`).join('') + '</div>';
    });
    ligarItens(root, () => root.querySelectorAll('.f'), i => [itens[i].nome, [[itens[i].cor, 'Leads', fmt(itens[i].valor)], [TK.eixo, 'Parte do total', nf(itens[i].valor / total * 100, 1) + '%']]]);
    return g;
  }

  /* rosca: fatias por stroke-dasharray num círculo; meio mostra o total ou a fatia sob o mouse */
  function Rosca(root) {
    const d = lerDados(root);
    const itens = itensDe(root, d);
    const total = itens.reduce((a, o) => a + o.valor, 0), R = 70, C = 2 * Math.PI * R, vao = 2;
    let meio;
    const g = tipoSimples(root, () => {
      let acc = 0;
      const fatias = itens.map((o, i) => {
        const len = o.valor / total * C, s = `<circle class="s" data-i="${i}" cx="90" cy="90" r="${R}" style="stroke:${o.cor};--i:${i};--d:${Math.max(0, len - vao).toFixed(2)}px;--c:${C.toFixed(2)}px" stroke-dashoffset="${(-acc).toFixed(2)}" transform="rotate(-90 90 90)"/>`;
        acc += len; return s;
      }).join('');
      root.innerHTML = `<div class="cg-rosca"><div class="cg-roda"><svg viewBox="0 0 180 180" role="img" aria-label="Leads por canal: ${itens.map(o => o.nome + ' ' + o.valor).join(', ')}">${fatias}</svg><div class="meio"><b data-conta>${nf(total)}</b><span>leads no período</span></div></div>
        <div class="cg-legenda">${itens.map((o, i) => `<span data-i="${i}"><span>${marca(root, o)} ${o.nome}</span><b>${nf(o.valor / total * 100, 0)}%</b></span>`).join('')}</div></div>`;
      meio = root.querySelector('.meio');
    });
    const padrao = meio.innerHTML;
    root.addEventListener('pointermove', ev => {
      const a = ev.target.closest('[data-i]');
      if (a) { const o = itens[+a.dataset.i]; meio.innerHTML = `<b>${nf(o.valor)}</b><span>${o.nome}</span>`; } else meio.innerHTML = padrao;
    });
    root.addEventListener('pointerleave', () => { meio.innerHTML = padrao; });
    ligarItens(root, () => root.querySelectorAll('circle.s'), i => [itens[i].nome, [[itens[i].cor, 'Leads', nf(itens[i].valor)], [TK.eixo, 'Parte do total', nf(itens[i].valor / total * 100, 1) + '%']]]);
    return g;
  }

  /* blocos por origem: um quadro por canal com logo, número, % e fio na cor do canal */
  function Blocos(root) {
    const itens = itensDe(root, lerDados(root)), total = itens.reduce((a, o) => a + o.valor, 0), max = Math.max(...itens.map(o => o.valor));
    const g = tipoSimples(root, () => {
      root.innerHTML = `<div class="cg-blocos" role="list">` + itens.map((o, i) =>
        `<div class="f" role="listitem" data-i="${i}" style="--i:${i}"><span class="nome">${marca(root, o)}${o.nome}</span><b data-conta>${nf(o.valor)}</b><span class="pc">${nf(o.valor / total * 100, 0)}% dos leads</span><span class="fio"><span class="barra" style="display:block;width:${(o.valor / max * 100).toFixed(1)}%;background:${o.cor}"></span></span></div>`).join('') + '</div>';
    });
    ligarItens(root, () => root.querySelectorAll('.f'), i => [itens[i].nome, [[itens[i].cor, 'Leads', nf(itens[i].valor)], [TK.eixo, 'Parte do total', nf(itens[i].valor / total * 100, 1) + '%']]]);
    return g;
  }

  /* progresso em anel (5.19): data-valor, data-total, data-rotulo, data-texto (ex.: "7 de 12 meses"), data-cor (token) */
  function Progresso(root) {
    const v = +root.dataset.valor || 0, t = +root.dataset.total || 100, p = Math.max(0, Math.min(1, v / t));
    const cor = root.dataset.cor ? `var(--${root.dataset.cor})` : 'var(--acento-texto)';
    const rot = root.dataset.rotulo || 'Progresso', pc = nf(p * 100, 0) + '%', texto = root.dataset.texto || pc, R = 19, C = 2 * Math.PI * R;
    return tipoSimples(root, () => {
      root.innerHTML = `<div class="cg-progresso"><svg viewBox="0 0 48 48" role="progressbar" aria-valuemin="0" aria-valuemax="${t}" aria-valuenow="${v}" aria-label="${rot}"><circle class="trilho-anel" cx="24" cy="24" r="${R}"/><circle class="anel" cx="24" cy="24" r="${R}" transform="rotate(-90 24 24)" style="stroke:${cor};--d:${(p * C).toFixed(2)}px;--c:${C.toFixed(2)}px"/></svg><span class="pc">${pc}</span><div><b>${rot}</b><span>${texto}</span></div></div>`;
    });
  }

  const TIPOS = { linha: Grafico, funil: Funil, barras: Barras, rosca: Rosca, blocos: Blocos, progresso: Progresso };

  /* ---------- entrada ao aparecer, redesenho ao mudar a largura ou o tema ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    e.target._cg && e.target._cg.tocar();
  }), { threshold: .25 }) : null;
  const ro = 'ResizeObserver' in window ? new ResizeObserver(es => es.forEach(e => {
    const g = e.target._cg; if (!g) return;
    const W = e.target.clientWidth;
    if (!W || Math.abs(W - g.st.larg) < 1) return;
    if (g.st.rafE) { cancelAnimationFrame(g.st.rafE); g.st.rafE = 0; g.st.prog = 1; }
    g.montar();
  })) : null;

  /* entrada dos gráficos 2x mais lenta que a da base (pedido 5.13): tempo, cascata e contagem, sempre a partir dos tokens */
  const LENTO = 2, TEMPOS = ['--dur-lenta', '--cascata', '--mov-conta', '--mov-entrada'];
  function devagar(el) {
    if (!el || el.dataset.grafLento) return;
    el.dataset.grafLento = '';
    const cs = getComputedStyle(document.documentElement);
    TEMPOS.forEach(n => { const v = cs.getPropertyValue(n).trim(); if (v) el.style.setProperty(n, parseFloat(v) * (v.endsWith('ms') ? 1 : 1000) * LENTO + 'ms'); });
  }
  function montar(raiz) {
    injetarCSS();
    (raiz || document).querySelectorAll('[data-grafico]').forEach(r => {
      const tipo = TIPOS[r.dataset.grafico];
      if (r._cg || !tipo) return;
      devagar(r); devagar(r.closest('[data-entra]'));
      const g = tipo(r);
      if (ro) ro.observe(r);
      if (reduz.matches || !io) g.tocar(); else io.observe(r);
    });
  }

  window.CrmGraficos = {
    montar,
    tocar: r => r && r._cg && r._cg.tocar(),
    mostrar: (r, i) => r && r._cg && r._cg.mostrar(i),
    exemplo: EX,
    formato: { real, nf, curto, dataCurta }
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-graf-repetir]');
    /* reduced-motion: já está no estado final; resetar só faria piscar */
    if (!b || reduz.matches) return;
    const bloco = b.closest('[data-item]') || document;
    bloco.querySelectorAll('[data-entra]').forEach(el => window.crmEntra && window.crmEntra(el));
    bloco.querySelectorAll('[data-grafico]').forEach(r => r._cg && r._cg.tocar());
    /* números fora dos gráficos (ex.: KPI do bloco); os de dentro o tocar já conta */
    if (window.crmConta) bloco.querySelectorAll('[data-conta]').forEach(n => { if (!n.closest('[data-grafico]')) window.crmConta(n); });
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => montar());
  else montar();
})();
