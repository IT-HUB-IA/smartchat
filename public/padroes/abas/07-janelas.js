/* Aba 7 · Janelas e avisos: copia cada prévia para o <dialog> de verdade, abre e fecha, nota do lead, avisos, copiar. */
(function () {
  var ICO = function (n, c) { return '<svg class="' + (c || 'ico') + '" aria-hidden="true"><use href="#' + n + '"/></svg>'; };

  function montar() {
    // Cada prévia (data-dialogo) vira o conteúdo do <dialog>; data-item não vai junto (a aprovação é da prévia)
    document.querySelectorAll('[data-dialogo]').forEach(function (p) {
      var html = p.innerHTML.replace(/\sdata-item="[^"]*"/g, '').replace(/\sdata-item='[^']*'/g, '');
      [p.dataset.dialogo, p.dataset.dialogo2].forEach(function (id) {
        var d = id && document.getElementById(id);
        if (d) d.innerHTML = html.replace(/\sid="(nl-[a-z]+)"/g, ' id="$1-j"').replace(/for="(nl-[a-z]+)"/g, 'for="$1-j"');
      });
    });
    selecoes();
    document.querySelectorAll('[data-item="7.8 Ficha: Nota do lead com pontos"]').forEach(somar);
  }

  // Seleção única do Novo lead: o mesmo par botão + lista (.selecao-*) da base, igual ao Campo
  var nSel = 0, SETA = ICO('chevron-down', 'selecao-seta');
  function selecoes() {
    document.querySelectorAll('[data-selecao]').forEach(function (raiz) {
      var imgs = [], tipo = raiz.dataset.img, ops = raiz.dataset.opcoes.split('|').map(function (o, i) { var p = o.split('~'); var im = function (src, c) { return '<img class="jn-sel-img jn-sel-' + tipo + (c || '') + '" src="' + src + '" alt="">'; }; imgs[i] = p[2] ? im(p[1], ' jn-so-claro') + im(p[2], ' jn-so-escuro') : p[1] ? im(p[1]) : ''; return p[0]; }), vazio = raiz.dataset.vazio || 'Selecione', sel = raiz.dataset.padrao ? +raiz.dataset.padrao : -1, id = 'jn-sel' + (++nSel);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'selecao-botao'; b.setAttribute('popovertarget', id); b.style.anchorName = '--' + id;
      var pop = document.createElement('div'); pop.id = id; pop.setAttribute('popover', ''); pop.className = 'selecao-pop'; pop.style.positionAnchor = '--' + id;
      var lista = document.createElement('div'); lista.className = 'selecao-lista'; pop.appendChild(lista);
      function desenhar() {
        b.innerHTML = (sel >= 0 ? '<span class="selecao-escolha jn-sel-esc">' + imgs[sel] + ops[sel] + '</span>' : '<span class="selecao-escolha-vazio">' + vazio + '</span>') + SETA;
        lista.querySelectorAll('.selecao-opcao').forEach(function (o, i) { o.setAttribute('aria-pressed', i === sel); });
      }
      ops.forEach(function (t, i) {
        var o = document.createElement('button'); o.type = 'button'; o.className = 'selecao-opcao';
        o.innerHTML = '<span class="selecao-opcao-rotulo jn-sel-esc">' + imgs[i] + t + '</span>';
        o.addEventListener('click', function () { sel = i; pop.hidePopover(); desenhar(); });
        lista.appendChild(o);
      });
      raiz.appendChild(b); raiz.appendChild(pop); desenhar();
    });
  }

  // Abrir e fechar (delegado: vale para os botões copiados dentro dos dialogs)
  document.addEventListener('click', function (e) {
    var ab = e.target.closest('[data-abrir]');
    if (ab) {
      var pop = ab.closest('[popover]'); if (pop && pop.hidePopover) pop.hidePopover();
      var d = document.querySelector(ab.dataset.abrir); if (d && d.showModal && !d.open) d.showModal();
    }
    var fe = e.target.closest('[data-fechar]');
    if (fe) { var di = fe.closest('dialog'); if (di) di.close(); }
    // clique no véu (fora do conteúdo) fecha
    if (e.target.tagName === 'DIALOG' && e.target.open) {
      var r = e.target.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close();
    }
    var t = e.target.closest('[data-toast]'); if (t) toast(t.dataset.toast);
    var cp = e.target.closest('[data-copiar]'); if (cp) copiar(cp);
  });

  // Nota do lead: soma dos pontos marcados
  function somar(raiz) {
    var tot = 0;
    raiz.querySelectorAll('input[data-pts]:checked').forEach(function (i) { tot += +i.dataset.pts; });
    var out = raiz.querySelector('[data-nota-total]'); if (out) out.textContent = tot;
  }
  document.addEventListener('change', function (e) {
    var c = e.target.closest('.jn-nota, #j-ficha, #j-ficha-lateral'); if (c && e.target.matches('input[data-pts]')) somar(c.classList.contains('jn-nota') ? c : c.querySelector('.jn-nota'));
  });

  // Aviso (toast)
  var TEXTOS = {
    sucesso: ['circle-check', 'Lead criado', 'Love Monika entrou em Lead novo.'],
    erro: ['circle-alert', 'Não foi possível salvar', 'Confira a conexão e tente de novo.'],
    info: ['info', 'Lead movido para Perdido', 'O histórico fica guardado.'],
    desfazer: ['triangle-alert', 'Lead arquivado', 'Você pode desfazer agora.']
  };
  function toast(tipo) {
    var area = document.getElementById('toast-area'), x = TEXTOS[tipo]; if (!area || !x) return;
    var el = document.createElement('div');
    el.className = 'toast'; el.dataset.tipo = tipo === 'desfazer' ? 'atencao' : tipo; el.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');
    el.innerHTML = ICO(x[0]) + '<span class="toast-t"><b>' + x[1] + '</b><small>' + x[2] + '</small></span>' + (tipo === 'desfazer' ? '<button class="lnk" type="button">Desfazer</button>' : '');
    area.appendChild(el);
    function sair() { el.classList.add('saindo'); setTimeout(function () { el.remove(); }, 200); }
    var b = el.querySelector('.lnk'); if (b) b.addEventListener('click', sair);
    setTimeout(sair, tipo === 'desfazer' ? 8000 : 4000);
  }

  // Copiar: ícone vira visto por 1,5 s
  function copiar(b) {
    try { navigator.clipboard.writeText(b.dataset.copiar).catch(function () {}); } catch (e) {}
    var u = b.querySelector('use'); if (!u || b.classList.contains('copiado')) return;
    b.classList.add('copiado'); u.setAttribute('href', '#check');
    setTimeout(function () { b.classList.remove('copiado'); u.setAttribute('href', '#copy'); }, 1500);
  }

  // Esc some com a dica (já some ao tirar o foco); links de exemplo não saem da página
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.dica:hover, .dica:focus-within').forEach(function (d) { d.classList.add('sem-dica'); });
  });
  document.addEventListener('mouseout', function (e) { var d = e.target.closest && e.target.closest('.dica'); if (d) d.classList.remove('sem-dica'); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
})();
