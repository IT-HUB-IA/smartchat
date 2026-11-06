/* Regra do avatar (R4: pessoas = Micah em icones/avatares/b/, sem nome = Notionists em icones/avatares/sem-nome.svg): sem foto = pessoa (homem ou mulher, pelo primeiro nome; se ele não está na lista, o primeiro nome que estiver); nome que não dá para saber = iniciais; sem nome = silhueta. */
(function () {
  const H = 'junior marcelo vinicius nicolas julio alexandre denis juan william daniel kaique rodrigo fernando victor henrique savio maycon arthur thiago davi natham lucas joao jackson diego tiago bruno carlos pedro paulo rafael gabriel felipe gustavo leonardo mateus matheus ricardo roberto lucio'.split(' ');
  const M = 'vania juliane monika delma claudia mayte natalia ana paola taciane carol maria fernanda camila patricia amanda beatriz larissa luciana mariana aline bianca daina clarissa viviane juliana'.split(' ');
  const limpa = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  window.avatarHTML = function (nome, tam, set) {
    set = set || 'b';
    const cls = 'avatar' + (tam ? ' avatar-' + tam : '');
    nome = (nome || '').trim();
    if (!nome) return `<span class="${cls}"><img src="../icones/avatares/sem-nome.svg" alt=""></span>`;
    const ps = limpa(nome).split(/\s+/);
    const g = H.includes(ps[0]) ? 'homem' : M.includes(ps[0]) ? 'mulher' : (ps.find(w => H.includes(w) || M.includes(w)) && (H.includes(ps.find(w => H.includes(w) || M.includes(w))) ? 'homem' : 'mulher'));
    if (g) return `<span class="${cls}"><img src="../icones/avatares/${set}/${g}-${hash(limpa(nome)) % 3 + 1}.svg" alt=""></span>`;
    return `<span class="${cls}">${nome.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()}</span>`;
  };
})();
