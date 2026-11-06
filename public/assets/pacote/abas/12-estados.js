// Aba 12 Estados: põe os ícones, a logo da empresa e a conversa de login/tentar de novo (tudo fictício)
(function () {
  // cada bloco de grade ganha uma célula própria, para a barra Aprovado/Ajustar ficar embaixo dele e não virar item da grade
  document.querySelectorAll('.es-grade > [data-item], .es-duplo > [data-item]').forEach(function (el) {
    var c = document.createElement('div'); c.className = 'es-cel'; el.replaceWith(c); c.appendChild(el);
  });
  var html = document.documentElement;
  function ic(n, c) { return '<svg class="' + (c || 'ico') + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + n + '"/></svg>'; }
  document.querySelectorAll('[data-ico]').forEach(function (el) { el.innerHTML = ic(el.dataset.ico); });
  document.querySelectorAll('[data-ico-btn]').forEach(function (b) { b.insertAdjacentHTML('afterbegin', ic(b.dataset.icoBtn)); });
  document.querySelectorAll('.es-faixa [data-ico]').forEach(function (el) { el.className = 'es-faixa-ico'; });

  function logos() {
    var emp = html.dataset.empresa === 'beec' ? 'beec' : 'you', esc = html.dataset.tema === 'escuro';
    document.querySelectorAll('.es-logo').forEach(function (i) { i.src = '../icones/empresas/' + emp + '-logo' + (esc ? '-claro' : '') + '.svg'; });
  }
  logos(); document.addEventListener('crm:tema', logos);

  // olho da senha
  var olho = document.querySelector('.es-olho'), senha = document.getElementById('lg-senha');
  function olhar(ver) { senha.type = ver ? 'text' : 'password'; olho.setAttribute('aria-pressed', String(ver)); olho.setAttribute('aria-label', ver ? 'Esconder senha' : 'Mostrar senha'); olho.innerHTML = ic(ver ? 'eye-off' : 'eye'); }
  olho.addEventListener('click', function () { olhar(senha.type === 'password'); }); olhar(false);

  // login: valida na hora, sem enviar
  var f = document.getElementById('login');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var campos = [f.querySelector('#lg-email'), senha];
    campos.forEach(function (c) {
      var ok = c.value.trim() !== '' && (c.type !== 'email' || /\S+@\S+\.\S+/.test(c.value));
      c.setAttribute('aria-invalid', String(!ok));
      var m = c.closest('.campo').querySelector('.campo-erro');
      if (!ok && !m) { m = document.createElement('span'); m.className = 'campo-erro'; m.textContent = c === senha ? 'Digite a senha.' : 'Digite um e-mail válido.'; c.closest('.campo').appendChild(m); }
      if (ok && m) m.remove();
    });
    if (campos.every(function (c) { return c.getAttribute('aria-invalid') === 'false'; })) {
      var b = f.querySelector('.es-entrar'); b.setAttribute('aria-busy', 'true');
      setTimeout(function () { b.removeAttribute('aria-busy'); }, 1200);
    }
  });

  // tentar de novo: carrega um instante
  var t = document.getElementById('tentar');
  t.addEventListener('click', function () { t.setAttribute('aria-busy', 'true'); setTimeout(function () { t.removeAttribute('aria-busy'); }, 1400); });
})();
