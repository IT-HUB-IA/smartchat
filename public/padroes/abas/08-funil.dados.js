/* Dados fictícios (exemplo) do Funil. Rascunho da Fase 2: vira parte de 08-funil.js depois do BASE PRONTA. */
window.FUNIL_DADOS = {
  etapas: [
    { id: 'novo', nome: 'Lead novo' },
    { id: 'qualificacao', nome: 'Em qualificação' },
    { id: 'reuniao', nome: 'Reunião agendada' },
    { id: 'faltou', nome: 'Não compareceu à reunião' },
    { id: 'negociacao', nome: 'Em negociação' },
    { id: 'followup', nome: 'Follow-up' }
  ],
  // origem: meta | google | google-organico | whatsapp | site | bio | indicacao
  leads: [
    { id: 1, etapa: 'novo', nome: 'Marina Duarte', valor: 650, contatos: 1, origem: 'meta', avatar: 'mulher' },
    { id: 2, etapa: 'novo', nome: 'Rafael Brandão', valor: 650, contatos: 0, origem: 'meta', avatar: 'homem', destaque: true },
    { id: 3, etapa: 'qualificacao', nome: 'Delma Ávila Canto', valor: 650, contatos: 2, origem: 'site', iniciais: 'DC' },
    { id: 4, etapa: 'qualificacao', nome: 'Victor Cubero', valor: 650, contatos: 2, origem: 'meta', avatar: 'homem' },
    { id: 5, etapa: 'reuniao', nome: 'Denis Teipo', valor: 650, contatos: 4, origem: 'google', avatar: 'homem', reuniao: '26/10/2026 às 09h30' },
    { id: 6, etapa: 'reuniao', nome: 'Maycon Siqueira', valor: 650, contatos: 7, origem: 'meta', avatar: 'homem', reuniao: '26/10/2026 às 16h00', destaque: true },
    { id: 7, etapa: 'faltou', nome: 'Henrique Luzio', valor: 650, contatos: 1, origem: 'site', avatar: 'homem' },
    { id: 8, etapa: 'negociacao', nome: 'Fernando Vergueiro', valor: 650, contatos: 4, origem: 'indicacao', avatar: 'homem' },
    { id: 9, etapa: 'negociacao', nome: 'Lúcio Laura Santos', valor: 650, contatos: 6, origem: 'indicacao', avatar: 'mulher' },
    { id: 10, etapa: 'followup', nome: 'Sávio Oliveira', valor: 650, contatos: 1, origem: 'meta', iniciais: 'SO', ultima: '23/10/2026', proxima: '25/10/2026', atrasada: true },
    { id: 11, etapa: 'followup', nome: 'Carol Lollys', valor: 650, contatos: 2, origem: 'bio', avatar: 'mulher', ultima: '23/10/2026', proxima: '29/10/2026' },
    { id: 12, etapa: 'followup', nome: 'Thiago Mendes', valor: 650, contatos: 3, origem: 'whatsapp', iniciais: 'TM', ultima: '22/10/2026', proxima: '30/10/2026' },
    { id: 13, etapa: 'followup', nome: 'Arthur Bessapian', valor: 650, contatos: 3, origem: 'meta', avatar: 'homem', ultima: '23/10/2026', proxima: '28/10/2026', atrasada: true },
    { id: 14, etapa: 'followup', nome: 'Paola Deysi', valor: 650, contatos: 2, origem: 'google-organico', avatar: 'mulher', ultima: '21/10/2026', proxima: '31/10/2026' },
    { id: 15, etapa: 'followup', nome: 'Davi Prado', valor: 650, contatos: 5, origem: 'indicacao', avatar: 'homem', ultima: '20/10/2026', proxima: '27/10/2026', atrasada: true }
  ],
  total: { abertos: 151, mes: 98150 }
};
