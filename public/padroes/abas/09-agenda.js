(function () {
  const D = window.AGENDA_DADOS;
  const COR = { ligacao: '--etiqueta-10', reuniao: '--etiqueta-11', academia: '--etiqueta-13', crm: '--etiqueta-16', lucas: '--etiqueta-9', beec: '--etiqueta-15', outros: '--fraco' };
  const cor = t => `var(${COR[t]})`;
  const nomeTipo = id => D.tipos.find(t => t.id === id).nome;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const iso = (a, m, d) => `${a}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const doDia = dia => D.eventos.filter(e => e.dia === dia).sort((a, b) => a.hora.localeCompare(b.hora));
  const MAX_CEL = 3;

  document.querySelectorAll('[data-legenda]').forEach(el => {
    el.innerHTML = D.tipos.map(t => `<span class="ag-leg"><i class="ag-pt" style="--c:${cor(t.id)}"></i>${esc(t.nome)}</span>`).join('');
  });
  document.getElementById('ag-tipos').innerHTML = D.tipos.map(t => `<span class="ag-bloco-ev${t.id === 'reuniao' ? ' ag-reuniao' : ''}" style="--c:${cor(t.id)}">${esc(nomeTipo(t.id))}<small>11:00 Nome do lead${t.id === 'ligacao' || t.id === 'reuniao' ? ' · WhatsApp 55 11 96140-0579' : ''}</small></span>`).join('');

  // mês navegável; só outubro de 2026 tem eventos de exemplo. Semana começa na segunda (S T Q Q S S D)
  const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const hoje = { a: 2026, m: 10 };
  let cur = { ...hoje };
  const grade = document.getElementById('ag-mes-grade');
  function renderMes() {
    let html = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map(l => `<span class="ag-dsem">${l}</span>`).join('');
    const inicio = (new Date(cur.a, cur.m - 1, 1).getDay() + 6) % 7, ndias = new Date(cur.a, cur.m, 0).getDate();
    const total = Math.ceil((inicio + ndias) / 7) * 7;
    const pops = [];
    for (let i = 0; i < total; i++) {
      const dia = i - inicio + 1;
      if (dia < 1 || dia > ndias) { html += '<div class="ag-cel ag-fora" aria-hidden="true"></div>'; continue; }
      const d = iso(cur.a, cur.m, dia), evs = doDia(d), resto = evs.length - MAX_CEL;
      const linhas = evs.slice(0, resto > 0 ? MAX_CEL : evs.length).map(e => `<button class="ag-ev${e.tipo === 'reuniao' ? ' ag-reuniao' : ''}" type="button" title="${esc(e.titulo)}"><i class="ag-pt" style="--c:${cor(e.tipo)}"></i><span>${e.hora} ${esc(e.titulo)}</span></button>`).join('');
      let mais = '';
      if (resto > 0) {
        mais = `<button class="ag-mais" type="button" popovertarget="mp-${dia}" style="anchor-name:--m${dia}">+${resto} mais</button>`;
        pops.push(`<div id="mp-${dia}" popover class="selecao-pop ag-pop" style="position-anchor:--m${dia}"><div class="selecao-lista"><div class="ag-pop-dia">${dia}/${cur.m}/${cur.a}</div>${evs.map(e => `<button class="selecao-opcao" type="button"><i class="ag-pt" style="--c:${cor(e.tipo)}"></i><span class="selecao-opcao-rotulo">${e.hora} ${esc(e.titulo)}</span></button>`).join('')}</div></div>`);
      }
      html += `<div class="ag-cel${d === D.hoje ? ' ag-hoje' : ''}"><span class="ag-num">${dia}</span>${linhas}${mais}</div>`;
    }
    grade.innerHTML = html + pops.join('');
    document.querySelector('#ag-mes .selecao-escolha').textContent = `${MESES[cur.m - 1]} ${cur.a}`;
    renderCal();
  }
  function irMes(delta) {
    const d = new Date(cur.a, cur.m - 1 + delta, 1); cur = { a: d.getFullYear(), m: d.getMonth() + 1 }; renderMes();
  }

  // grade de horas: 08h às 20h, 56px por hora; eventos de 1h; sobrepostos dividem a largura
  const H0 = 8, PX = 56;
  function tempo(el, dias) {
    const ROT = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
    el.style.setProperty('--cols', dias.length);
    let h = '<div class="ag-horas"><div class="ag-colt-cab"></div><div class="ag-corpo">';
    for (let i = 1; i < 12; i++) h += `<span class="ag-hora" style="top:${i * PX}px">${String(H0 + i).padStart(2, '0')}:00</span>`;
    h += '</div></div>';
    dias.forEach(d => {
      const n = +d.slice(8), idx = (new Date(d + 'T12:00:00').getDay() + 6) % 7;
      const evs = doDia(d).map(e => ({ e, ini: (+e.hora.slice(0, 2) - H0) * 60 + +e.hora.slice(3) }));
      evs.forEach(a => { a.col = 0; evs.forEach(b => { if (b !== a && b.ini < a.ini + 60 && a.ini < b.ini + 60 && b.ini <= a.ini && b.col === a.col && evs.indexOf(b) < evs.indexOf(a)) a.col++; }); a.de = 1 + Math.max(...evs.filter(b => b.ini < a.ini + 60 && a.ini < b.ini + 60).map(b => b.col)); });
      h += `<div class="ag-colt${d === D.hoje ? ' ag-hoje' : ''}"><div class="ag-colt-cab">${ROT[idx]} ${n}</div><div class="ag-corpo">` +
        evs.map(a => `<div class="ag-evt${a.e.tipo === 'reuniao' ? ' ag-reuniao' : ''}" style="--c:${cor(a.e.tipo)};top:${a.ini / 60 * PX}px;height:${PX - 2}px;left:${a.col / a.de * 100}%;width:${100 / a.de}%">${a.e.hora} ${esc(a.e.titulo)}<small>${esc(nomeTipo(a.e.tipo))}</small></div>`).join('') + '</div></div>';
    });
    el.innerHTML = h;
  }
  tempo(document.getElementById('ag-semana-grade'), [26, 27, 28, 29, 30, 31].map(n => iso(2026, 10, n)));
  tempo(document.getElementById('ag-dia-grade'), ['2026-10-30']);
  document.getElementById('ag-dia-lista').innerHTML = doDia('2026-10-30').map(e => `<li><i class="ag-pt" style="--c:${cor(e.tipo)}"></i><time>${e.hora}</time>${esc(e.titulo)}</li>`).join('');

  // calendário comum da base (.cal-*): segue o mesmo mês da grade
  function renderCal() {
    const ini = (new Date(cur.a, cur.m - 1, 1).getDay() + 6) % 7, nd = new Date(cur.a, cur.m, 0).getDate(), ant = new Date(cur.a, cur.m - 1, 0).getDate();
    let dias = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map(l => `<span class="cal-semana">${l}</span>`).join('');
    for (let i = 0; i < Math.ceil((ini + nd) / 7) * 7; i++) {
      const n = i - ini + 1, fora = n < 1 || n > nd, v = n < 1 ? ant + n : n > nd ? n - nd : n;
      const eHoje = !fora && cur.a === hoje.a && cur.m === hoje.m && n === 30;
      dias += `<button class="cal-dia" type="button"${fora ? ' data-fora' : ''}${eHoje ? ' data-hoje aria-pressed="true"' : ''}>${v}</button>`;
    }
    const seta = (n, nome, aria) => `<button class="cal-seta" type="button" data-mes="${n}" aria-label="${aria}"><svg class="ico" aria-hidden="true"><use href="#${nome}"/></svg></button>`;
    document.getElementById('ag-cal-painel').innerHTML = `<div class="cal-topo">${seta(-1, 'chevron-left', 'Mês anterior')}<span class="cal-mes">${MESES[cur.m - 1]} ${cur.a}</span>${seta(1, 'chevron-right', 'Próximo mês')}</div><div class="cal-grade">${dias}</div>`;
  }
  document.getElementById('ag-cal-painel').addEventListener('click', ev => { const b = ev.target.closest('[data-mes]'); if (b) irMes(+b.dataset.mes); });
  const nav = document.querySelector('#ag-mes .ag-nav');
  nav.querySelector('[aria-label="Mês anterior"]').addEventListener('click', () => irMes(-1));
  nav.querySelector('[aria-label="Próximo mês"]').addEventListener('click', () => irMes(1));
  nav.querySelector('.btn-2').addEventListener('click', () => { cur = { ...hoje }; renderMes(); });
  renderMes();

  document.querySelectorAll('[data-ir]').forEach(b => b.addEventListener('click', () => {
    b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    document.getElementById(b.dataset.ir).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
})();
