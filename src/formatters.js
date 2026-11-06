const actions={
 'workspace.created':'Empresa criada','test.connection.created':'Canal de teste criado',
 'instagram.connected':'Instagram conectado','instagram.disconnected':'Canal desconectado',
 'instagram.token.renewed':'Autorização renovada','automation.saved':'Automação salva',
 'automation.deleted':'Automação excluída','input.invalid':'Resposta fora do formato solicitado',
 'conversation.handoff':'Encaminhado para atendimento','conversation.updated':'Atendimento atualizado',
 'message.manual':'Resposta da equipe','message.failed':'Falha no envio',
 'invitation.created':'Convite criado','invitation.accepted':'Convite aceito'
};
export const actionLabel=key=>actions[key]||'Atividade registrada';
export const jobLabel=key=>({event:'Interação recebida',run:'Execução de jornada',send:'Envio de mensagem',refresh:'Renovação da autorização'}[key]||'Processamento');
