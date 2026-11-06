export const resources = [
  {id:'canais',name:'Canais conectados',icon:'message-circle',label:'01 / ESTEJA PRESENTE',title:'O canal muda.\nA conversa continua.',description:'WhatsApp, Instagram, Messenger, Telegram, e-mail e SMS. Organize os pontos de contato da sua empresa em uma estratégia de conversa.',visual:'canais',items:[
    ['Instagram Automation','Automatize respostas no Direct a partir de mensagens, Stories, lives e comentários.'],
    ['WhatsApp Business API','Crie menus, notificações e fluxos para o atendimento na conta comercial.'],
    ['Facebook Messenger','Conecte as conversas da sua página e de anúncios.'],
    ['SMS Marketing','Envie mensagens de texto. A disponibilidade depende do país e do serviço de SMS.'],
    ['E-mail Marketing','Inclua e-mails, newsletters e sequências nos seus fluxos.'],
    ['Telegram Bot','Organize o atendimento com bots em canais e grupos.']
  ]},
  {id:'captura',name:'Novas conversas',icon:'user-plus',label:'02 / TRANSFORME INTERESSE EM CONTATO',title:'Um comentário pode ser\no início de tudo.',description:'Dê continuidade a quem já demonstrou interesse. Use palavras-chave, respostas a Stories, links e QR Codes para abrir uma conversa com contexto.',visual:'captura',items:[
    ['Gatilho de comentários no Instagram','Uma palavra-chave em um post ou Reel pode iniciar uma mensagem automática no Direct.'],
    ['Respostas e menções em Stories','Inicie um fluxo quando alguém responder a um Story ou mencionar sua marca.'],
    ['Comentários em lives','Dê sequência no Direct a quem comentar uma palavra-chave durante a transmissão.'],
    ['Reações aos Stories','Use a reação com um emoji como ponto de partida para o fluxo.'],
    ['Chat do site','Abra um caminho do seu site para o atendimento pelo Messenger.'],
    ['Links personalizados do Messenger','Use links que iniciam uma automação específica a partir da bio, de uma campanha ou de outro canal.'],
    ['QR Codes','Facilite o início da conversa com um código que pode ser escaneado.'],
    ['Comentários no Facebook','Envie uma mensagem no Messenger a quem comentar em uma publicação da página.'],
    ['Anúncios de clique para Messenger','Conecte o clique no anúncio ao início de um fluxo de conversa.']
  ]},
  {id:'fluxos',name:'Fluxos visuais',icon:'funnel',label:'03 / DESENHE O PRÓXIMO PASSO',title:'Sua estratégia.\nUm fluxo que faz sentido.',description:'Conecte mensagens, perguntas, condições e ações em um construtor visual. Defina o caminho sem precisar programar cada interação.',visual:'fluxos',items:[
    ['Construtor visual','Arraste e conecte blocos em um painel de fluxos.'],
    ['Blocos de texto','Escreva as mensagens que serão enviadas em cada etapa.'],
    ['Botões','Crie opções para seguir no fluxo, abrir um site ou iniciar uma ligação.'],
    ['Respostas rápidas','Ofereça opções temporárias para orientar a próxima resposta.'],
    ['Cards e carrosséis','Apresente produtos ou conteúdos com imagem, título, descrição e botão.'],
    ['Mídias e arquivos','Inclua imagens, vídeos, áudios e documentos na conversa.'],
    ['Intervalo de digitação','Dê ritmo à conversa com um intervalo entre mensagens.'],
    ['Entrada de dados','Aguarde uma resposta e valide informações como nome, telefone e e-mail.']
  ]},
  {id:'logica',name:'Lógica e organização',icon:'list-filter',label:'04 / CADA CONTATO TEM SEU CAMINHO',title:'Contextos diferentes.\nRespostas diferentes.',description:'Use o que você já sabe sobre cada contato para escolher o próximo passo. Segmente, teste alternativas e organize as informações ao longo do fluxo.',visual:'logica',items:[
    ['Etiquetas','Identifique interesses e ações, como novo contato, cliente ou interesse em um produto.'],
    ['Campos personalizados','Guarde respostas e informações específicas de cada contato.'],
    ['Campos globais','Mantenha informações compartilhadas por todos os fluxos em um só lugar.'],
    ['Condições','Divida os caminhos com regras baseadas nas informações e etiquetas do contato.'],
    ['Teste A/B','Distribua contatos entre alternativas para comparar abordagens.'],
    ['Espera inteligente','Programe pausas de minutos, horas ou dias antes da próxima etapa.'],
    ['Limpeza de campos e etiquetas','Remova informações e marcações que já cumpriram sua função.']
  ]},
  {id:'contatos',name:'Contatos com contexto',icon:'users',label:'05 / PESSOAS, NÃO MENSAGENS SOLTAS',title:'Conheça quem está\ndo outro lado.',description:'Reúna o histórico, os interesses e as informações que ajudam sua equipe a atender melhor. Encontre os contatos certos com filtros e ações em grupo.',visual:'contatos',items:[
    ['Painel de contatos','Visualize quem já interagiu com seus canais.'],
    ['Perfil do contato','Consulte foto, nome, histórico, etiquetas e campos personalizados.'],
    ['Filtros avançados','Encontre grupos de contatos a partir dos dados e comportamentos registrados.'],
    ['Ações em massa','Selecione grupos para atualizar etiquetas, remover de sequências ou exportar informações.']
  ]},
  {id:'atendimento',name:'Atendimento humano',icon:'user',label:'06 / TEM HORA QUE É SOBRE PESSOAS',title:'Quando sua equipe entra,\no contexto vai junto.',description:'Responda às conversas em uma central de atendimento e dê espaço para a equipe assumir quando a automação precisa passar a vez.',visual:'atendimento',items:[
    ['Chat ao vivo','Leia e responda manualmente às conversas em uma central de atendimento.'],
    ['Pausa da automação','Interrompa as respostas automáticas quando uma pessoa assumir a conversa.'],
    ['Atribuição de conversas','Direcione cada atendimento para a pessoa responsável.'],
    ['Notas internas','Registre informações visíveis apenas para sua equipe.'],
    ['Atendimento pelo celular','A proposta inclui atendimento móvel. Consulte a equipe sobre a disponibilidade dos aplicativos para iOS e Android.']
  ]}
];
export const scenarios={
  comentario:{label:'Instagram / Comentário',channel:'Instagram Direct',steps:[['Gatilho','message-circle','Uma palavra abre a conversa.','Ana comenta “QUERO” na sua publicação.'],['Mensagem','send','A resposta chega no Direct.','O fluxo envia uma apresentação e oferece opções.'],['Organização','tag','O interesse fica registrado.','A resposta de Ana adiciona a etiqueta “Interesse em planos”.'],['Equipe','users','Uma pessoa assume com contexto.','O histórico acompanha o contato no atendimento.']],messages:[['in','QUERO!'],['out','Oi, Ana! Vi seu interesse na publicação. Quer conhecer nossos planos?'],['in','Sim! Somos 5 pessoas na equipe.'],['out','Perfeito! Vou conectar você à nossa equipe para continuar.']]},
  whatsapp:{label:'WhatsApp / Mensagem',channel:'WhatsApp Business',steps:[['Gatilho','message-circle','O primeiro “oi” chega.','Ana inicia uma conversa no WhatsApp da empresa.'],['Pergunta','send','O fluxo entende o que ela precisa.','Uma mensagem oferece os caminhos “Vendas” e “Suporte”.'],['Condição','funnel','Cada escolha tem um próximo passo.','Ana escolhe vendas. O fluxo registra o interesse.'],['Atendimento','user-plus','A conversa chega à pessoa certa.','O robô é pausado para a equipe continuar.']],messages:[['in','Olá! Gostaria de uma informação.'],['out','Oi, Ana! Você quer falar sobre vendas ou precisa de suporte?'],['in','Quero conversar com vendas.'],['out','Combinado! A equipe comercial vai continuar por aqui.']]},
  story:{label:'Instagram / Story',channel:'Instagram Direct',steps:[['Gatilho','star','Uma reação mostra interesse.','Ana reage ao Story em que você apresenta um produto.'],['Mensagem','send','Você dá continuidade.','Uma mensagem apresenta mais informações sobre o produto.'],['Contato','users','A informação fica organizada.','O fluxo pergunta qual opção Ana quer conhecer.'],['Próximo passo','arrow-right','A conversa continua com propósito.','Uma etiqueta identifica o interesse para o atendimento.']],messages:[['in','😍 Adorei esse produto!'],['out','Que bom que gostou, Ana! Quer que eu te mostre as opções?'],['in','Quero conhecer o modelo azul.'],['out','Anotado! Vamos continuar com as informações do modelo azul.']]}
};
export const faq=[
 ['O que posso fazer com o SmartChat?','Conectar canais de mensagens, iniciar conversas por gatilhos, criar fluxos visuais, organizar informações dos contatos e encaminhar o atendimento para sua equipe. Explore a lista de recursos para conhecer cada etapa.'],
 ['Preciso saber programar para criar um fluxo?','O construtor é visual: você organiza blocos de mensagens, perguntas, condições e ações. A lógica é definida pelo caminho que você desenha para a conversa.'],
 ['Posso automatizar comentários e Stories do Instagram?','Os recursos incluem gatilhos para palavras-chave em comentários, respostas, menções e reações a Stories, além de comentários em lives. As integrações dependem das permissões e das regras de cada plataforma.'],
 ['A automação substitui minha equipe?','Você define em que momento a automação passa a vez. A equipe pode assumir a conversa, pausar o robô, consultar o histórico e compartilhar notas internas.'],
 ['A demonstração deste site envia mensagens reais?','Não. As mensagens, os contatos e os caminhos exibidos aqui são exemplos interativos. Nada é enviado a redes sociais e nenhum contato é cadastrado ao explorar a demonstração.'],
 ['Como conheço os planos e a disponibilidade dos canais?','Converse com a equipe pelo WhatsApp (11) 96028-8595. Conte quais canais pretende usar, o volume de conversas e como funciona seu atendimento para conhecer as opções e a disponibilidade de cada recurso.']
];
