/* CRM padrão · base/aprovacao.js · Dono: Alicerce
   Carregar no fim do <body> (ou com defer). Depois de cada elemento com data-item="N.M Nome" põe os botões Aprovado e
   Ajustar (Ajustar abre o campo de nota). Tudo salvo no navegador (localStorage "crm-aprovacao").
   Também registra os itens vistos ("crm-itens") para a lista final do index.html. */
(function () {
  var CHAVE = 'crm-aprovacao', ITENS = 'crm-itens';
  function ler(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
  function gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  // Aprovados das listas que o Natham colou (R1 a R3): voltam se o navegador perdeu; nunca sobrescreve o que ele marcou
  var SALVOS = ["1.1 Fundo, superfícies e texto", "1.2 Acento da empresa", "1.3 Estados: sucesso, atenção, perigo, informação", "1.4 Variação ▲▼", "1.5 Faixas de faturamento Bronze, Prata e Ouro", "1.6 Cores das etapas do funil", "1.7 Cores dos 7 canais (gráfico)", "1.8 Cores do WhatsApp (fundo liso e bolhas)", "1.9 Etiquetas da Névoa (cor livre)", "1.10 Tipografia com acentos", "1.11 Espaço (grade de 4)", "1.12 Raios", "1.13 Sombras", "1.15 Movimento (seleção que abre e janela)", "1.19 Abas com indicador, opção B · Fundo leve e sublinhado", "2.1 Botão principal", "2.2 Botão secundário de vidro", "2.3 Botão sobre o bloco de destaque", "2.4 Botão de perigo", "2.5 Botão fantasma", "2.6 Link", "2.7 Botão só de ícone", "2.8 Botão com ícone e botão de contato", "2.9 Tamanho pequeno", "2.10 Botão carregando", "2.11 Botão desativado", "2.12 Estados lado a lado: normal, passar o mouse, foco, pressionado", "2.13 Grupo segmentado Mês, Semana, Dia", "2.14 Grupo segmentado com ícone: Todos, Tráfego Pago, Indicação", "2.15 Contador menos e mais", "2.16 Interruptor claro e escuro", "2.17 Botão de copiar", "3.1 Campo de texto", "3.2 Busca", "3.3 Moeda R$", "3.4 Telefone com cópia", "3.5 E-mail", "3.6 Área de texto", "3.7 Seleção única", "3.8 Seleção múltipla com chips e +N", "3.9 Filtro com contador", "3.10 Período Últimos 30 dias com calendário", "3.11 Data", "3.12 Hora", "3.13 Caixa de marcar", "3.14 Opção (uma entre várias)", "3.15 Interruptor", "3.16 Campo obrigatório", "3.17 Erro", "3.18 Texto de ajuda", "3.19 Campo desativado", "3.21 Formulário em duas colunas com seções (fotos dos responsáveis, logos)", "4.1 Card de número (KPI) com variação ▲▼", "4.2 Bloco de destaque", "4.3 Card de receita R$/mês", "4.4 Card de alerta e diagnóstico", "4.5 Lista com barra e porcentagem", "4.6 Etiquetas de etapa", "4.7 Selos", "4.8 Faixas de faturamento: as 7 etiquetas", "4.10 Filtro por faixa com a quantidade de leads", "5.1 Linha A · Firme", "5.4 Leads por dia e canal (multi canal com legenda)", "5.5 Dica ao passar o mouse", "5.6 Funil visual sem 3D", "5.7 Barras horizontais", "5.10 Mini gráfico no card de número", "5.11 Legenda em bolinha", "5.12 Gráfico vazio", "5.13 Entrada dos gráficos", "5.14 Origem A · Barras com logo", "5.15 Origem B · Rosca com logo", "5.19 Progresso C · Anel", "6.1 Menu de vidro, aberto e recolhido", "6.3 Topo da tela: título, subtítulo, notificações, som e ações", "6.4 Topo da tela em tela estreita (celular)", "6.5 Abas da tela (com contador)", "6.6 Migalha de pão", "6.7 Paginação com linhas por página", "6.8 Tela montada: menu, topo e conteúdo", "7.1 Notificações: 154 novas atividades", "7.3 Abrir a ficha como janela e como painel lateral", "7.4 Ficha: cabeçalho do lead", "7.6 Ficha: Briefing carregando", "7.7 Ficha: Briefing preenchido", "7.8 Ficha: Nota do lead com pontos", "7.9 Ficha: Origem", "7.10 Ficha: Formulário com as respostas", "7.12 Janela de confirmação", "7.13 Aviso (toast): sucesso, erro, informação, com desfazer", "7.14 Dica ao passar o mouse ou focar", "7.15 Ficha: Observação e retrato do lead", "8.6 Card sendo arrastado (sombra, sem 3D)", "8.9 Cabeçalho de coluna por etapa", "8.10 Card de lead completo", "8.11 Card em destaque (borda no acento)", "8.12 Card com reunião agendada", "8.13 Card de follow-up (próxima atrasada)", "8.14 Coluna vazia", "8.15 Contador − e + de contatos (estados)", "9.1 Mês (barra, grade, hoje e +N mais)", "9.2 Semana (grade de horas, eventos por horário)", "9.3 Dia (grade de horas e lista)", "9.4 Evento colorido (um por tipo)", "9.5 Legenda dos tipos", "9.6 Hoje e dia fora do mês", "10.2 Tabela vazia", "10.3 Tabela carregando (esqueleto)", "11.2 Busca e filtros da lista", "11.3 Linha de conversa e seus estados", "11.5 Bolhas, separador de data, link e contato", "11.6 Mensagem de áudio", "11.7 Caixa de escrever, anexo e emoji", "11.8 Estados vazios e digitando", "11.9 Contraste das bolhas (calculado)", "12.1 Tela de login", "12.2 Login com erro (senha incorreta)", "12.3 Vazio: lista sem registros", "12.4 Vazio: busca sem resultado", "12.5 Vazio: sem conversas", "12.6 Carregando: indicador no centro", "12.7 Carregando: esqueleto de cartões", "12.8 Carregando: botão e barra de progresso", "12.9 Erro ao carregar (com tentar de novo)", "12.10 Erro: página não encontrada", "12.11 Erro: sem permissão", "12.12 Sucesso: ação concluída", "12.13 Sucesso: tarefa concluída (tudo em dia)", "12.14 Sem internet: faixa no topo e tela", "13.2 Ícones de interface estáticos (os que vão no CRM)", "13.3 Tamanhos e cores do ícone", "13.4 Ícones dentro de botões e campos", "13.5 Ícones de origem (Meta, Google, WhatsApp, Site, Bio, Indicação)", "13.6 Google orgânico: opção A (G e folha) ou B (lupa)", "13.7 Origem dentro de linha, selo e legenda", "13.8 Logos da empresa (topo do menu)", "13.9 Ícones-chave animados (passar o mouse, clicar ou Tocar todos)", "14.1 Troca de tela (a oficial, como o vídeo)", "14.2 Números contando (de 0 até o valor)", "14.3 Lista em cascata (cada linha logo depois da anterior)", "14.4 Card que sobe ao passar o mouse (só 2D)", "14.5 Indicador que desliza no segmentado e nas abas", "14.6 Menu recolhido com dica ao passar o mouse", "14.8 Abas com luz, opção B (fundo leve e sublinhado)"];
  (function () { var d = ler(CHAVE), mudou = false;
    SALVOS.forEach(function (k) { if (!d[k] || !d[k].estado) { d[k] = { estado: 'aprovado' }; mudou = true; } });
    if (mudou) gravar(CHAVE, d); })();

  window.CRM_APROV = { ler: function () { return ler(CHAVE); }, itens: function () { return ler(ITENS); } };
  if (document.documentElement.hasAttribute('data-sem-aprovacao')) return;

  function montar() {
    var pagina = location.pathname.split('/').pop();
    var reg = ler(ITENS);
    document.querySelectorAll('[data-item]').forEach(function (el) {
      var item = el.dataset.item;
      reg[item] = pagina;
      var caixa = document.createElement('div');
      caixa.className = 'aprov';
      caixa.setAttribute('role', 'group');
      caixa.setAttribute('aria-label', 'Aprovação de ' + item);
      var nome = document.createElement('span');
      nome.className = 'aprov-nome'; nome.textContent = item;
      var nota = document.createElement('input');
      nota.className = 'campo-input aprov-nota'; nota.placeholder = 'O que ajustar?'; nota.setAttribute('aria-label', 'Nota de ajuste de ' + item);
      var botoes = [['aprovado', 'Aprovado'], ['ajustar', 'Ajustar']].map(function (o) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'aprov-btn'; b.dataset.v = o[0]; b.textContent = o[1];
        b.addEventListener('click', function () {
          var dados = ler(CHAVE), atual = dados[item] || {};
          atual.estado = atual.estado === o[0] ? '' : o[0];   // clicar de novo desmarca
          dados[item] = atual; gravar(CHAVE, dados); pintar();
          if (atual.estado === 'ajustar') nota.focus();
        });
        return b;
      });
      nota.addEventListener('input', function () {
        var dados = ler(CHAVE); dados[item] = dados[item] || {}; dados[item].nota = nota.value; gravar(CHAVE, dados);
      });
      function pintar() {
        var d = ler(CHAVE)[item] || {};
        botoes.forEach(function (b) { b.setAttribute('aria-pressed', String(d.estado === b.dataset.v)); });
        nota.hidden = d.estado !== 'ajustar';
        nota.value = d.nota || '';
      }
      caixa.append(nome, botoes[0], botoes[1], nota);
      el.insertAdjacentElement('afterend', caixa);
      pintar();
      // aprovado ao ABRIR a página fica escondido (aprovar agora não some na hora: dá para desfazer; some na próxima vez)
      if ((ler(CHAVE)[item] || {}).estado === 'aprovado') escondidos.push([el, caixa]);
    });
    gravar(ITENS, reg);
    filtrar();
    document.addEventListener('crm:pendentes', filtrar);
  }

  /* Natham (R2): o que já foi aprovado não aparece de novo. Esconde o bloco e a barra de cada item aprovado e a seção que ficar
     vazia; no topo, "N aprovados escondidos" com "Mostrar aprovados" (lembrado em "crm-mostrar-aprovados") */
  var escondidos = [], secoes = [], aviso;
  function filtrar() {
    var mostrar = false;
    try { mostrar = localStorage.getItem('crm-mostrar-aprovados') === '1'; } catch (e) {}
    secoes.forEach(function (s) { s.hidden = false; });
    secoes = [];
    escondidos.forEach(function (p) { p[0].hidden = p[1].hidden = !mostrar; });
    var todos = document.querySelectorAll('[data-item]');
    if (!mostrar) {   // seção/título sem nenhum item visível some junto (sobe até o maior contêiner vazio, nunca a página)
      var pagina = document.querySelector('.casca-pagina') || document.body;
      escondidos.forEach(function (p) {
        var s = p[0].parentElement, vazio = null;
        while (s && s !== pagina && s !== document.body && pagina.contains(s) && !s.querySelector('[data-item]:not([hidden])')) { vazio = s; s = s.parentElement; }
        if (vazio && secoes.indexOf(vazio) < 0) { vazio.hidden = true; secoes.push(vazio); }
      });
    }
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.className = 'aprov-aviso';
      var lugar = document.querySelector('.casca-pagina') || document.body;
      lugar.prepend(aviso);
      aviso.addEventListener('click', function (e) {
        if (!e.target.closest('button')) return;
        try { localStorage.setItem('crm-mostrar-aprovados', mostrarAgora() ? '0' : '1'); } catch (x) {}
        filtrar();
      });
    }
    var n = escondidos.length, pendentes = todos.length - n;
    var prox = window.CRM_PROXIMA;   // vem do casca.js (próxima aba com item pendente)
    aviso.hidden = !n && !prox;
    aviso.innerHTML = (pendentes ? '' : '<b class="aprov-tudo">Tudo aprovado nesta aba</b>') +
      (n ? '<span>' + n + (n === 1 ? ' aprovado ' + (mostrar ? 'aparecendo' : 'escondido') : ' aprovados ' + (mostrar ? 'aparecendo' : 'escondidos')) + '</span>' +
      '<button type="button" class="lnk">' + (mostrar ? 'Esconder aprovados' : 'Mostrar aprovados') + '</button>' : '') +
      (prox ? '<a class="btn btn-p aprov-proxima" href="' + prox.arquivo + '">Próxima pendente: ' + prox.nome + '</a>' : '');
  }
  function mostrarAgora() { try { return localStorage.getItem('crm-mostrar-aprovados') === '1'; } catch (e) { return false; } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
})();
