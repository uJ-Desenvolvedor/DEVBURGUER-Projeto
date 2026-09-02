# DEVBURGUER

Sistema completo de pedidos para uma hamburgueria artesanal. O projeto possui loja virtual, cardápio filtrável, sacola, checkout, cadastro de clientes, pedidos persistentes e painel administrativo.

## Funcionalidades

- Página inicial responsiva com ofertas e produtos em destaque
- Cardápio organizado por categorias
- Sacola com controle de quantidade e cálculo automático
- Checkout com endereço, forma de pagamento e entrega grátis acima de R$ 80
- Cadastro e login de clientes
- Confirmação do pedido com código exclusivo
- Painel administrativo para consultar pedidos e atualizar o andamento
- Cadastro de produtos com envio de imagem pelo computador ou por URL
- Busca e filtro de produtos por categoria
- Edição, exclusão e ativação/desativação de produtos
- Banco de dados com usuários, categorias, produtos, pedidos e itens do pedido
- Armazenamento persistente das imagens enviadas

## Acessos para demonstração

- Cliente: `cliente@devburguer.com` / `cliente123`
- Administrador: `admin@devburguer.com` / `admin123`

## Executar localmente

1. Instale o Node.js 22 ou superior.
2. Na pasta do projeto, execute `npm install`.
3. Execute `npm run dev`.
4. Abra `http://localhost:3000`.

Para gerar a versão final, use `npm run build`.

No painel administrativo, abra **Listar produtos** para pesquisar, editar, ativar, desativar ou excluir itens. Use **Cadastrar produto** para enviar uma imagem de até 5 MB ou informar uma URL.

## Estrutura principal

- `app/`: páginas, componentes e endpoints da aplicação
- `app/api/`: produtos, usuários, sessão e pedidos
- `db/`: definição das tabelas
- `drizzle/`: migração SQL
- `lib/`: inicialização e acesso ao banco
- `public/`: imagens e arquivos públicos

## Observação acadêmica

O login incluído serve para demonstração do fluxo solicitado no projeto. Em uma aplicação comercial, as senhas devem ser armazenadas com hash e a sessão deve usar cookies seguros ou um provedor de identidade.
