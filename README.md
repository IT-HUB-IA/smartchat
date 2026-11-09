# SmartChat — landing e aplicação web

Este projeto reúne a landing em / e a aplicação em /app para GitHub → Vercel. O botão Acessar faz a navegação entre as duas. A fonte da landing fica em landing/ e é copiada pelo build sem depender de outra pasta. O código React fica em src/, os componentes originais necessários em vendor/tarefas/ e todos os recursos visuais em public/. O build é independente das pastas do projeto original.

Na Vercel, importar ESTE diretório como raiz do repositório/projeto, com framework Other e Node 24.x. O vercel.json configura npm ci --include=dev, npm run build e saída public/. O arquivo package-lock.json deve ser versionado. Não configurar Functions nem Cron.

O usuário entra em https://smartchat.it-ia.tec.br. Requisições /api/* são encaminhadas, sem mudar o endereço do navegador, para https://motor-smartchat.it-ia.tec.br/api/*. /privacy e /data-deletion também são encaminhados ao motor. A interface usa cookies no domínio da tela; nenhuma conexão direta ao banco é feita por este projeto.

Não configurar DATABASE_URL, App Secret da Meta, chave Resend ou chaves de criptografia na Vercel. Nenhuma dessas credenciais é necessária para compilar ou servir a tela. As configurações de login e os links de e-mail são gerados pela VPS usando APP_URL=https://smartchat.it-ia.tec.br.

Publicar primeiro uma preview para conferir aparência e assets. O login está configurado para o domínio oficial, portanto NÃO autorizar automaticamente todas as previews *.vercel.app. Para um staging funcional, preparar backend/banco isolados e origem explicitamente permitida. Validar cadastro e cookies no domínio de produção após o corte do DNS.

No corte: preparar e validar o motor na VPS primeiro; adicionar smartchat.it-ia.tec.br ao projeto Vercel; aplicar somente o DNS indicado pela Vercel depois que ela reconhecer o domínio. Não inventar destino DNS e não apagar o túnel compartilhado. A entrada antiga do SmartChat só deve ser removida pelo agente da VPS depois da validação final.

Build local: npm ci --include=dev e npm run build.

A manutenção da interface é feita neste projeto. O motor/API tem pacote e implantação separados na VPS. As referências visuais são material interno e não são publicadas no produto. As páginas de privacidade/exclusão ainda são rascunhos do operador, pendentes antes do lançamento comercial.

Documentação do proxy: https://vercel.com/docs/routing/rewrites
