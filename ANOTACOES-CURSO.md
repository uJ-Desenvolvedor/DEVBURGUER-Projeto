# Anotações básicas — Projeto DEVBURGUER

## Visão geral

O projeto do curso é dividido em dois sistemas:

- `devburguer-api`: servidor e regras do back-end.
- `devburguer-interface`: aplicação React usada pelos clientes e administradores.

## Back End — Node pt. I

- Criar o projeto Node e iniciar o servidor com Express.
- Usar Docker para executar os serviços de banco de dados.
- Armazenar usuários, produtos e categorias no PostgreSQL.
- Usar Sequelize para models, migrations e relacionamento entre tabelas.
- Separar o código seguindo a arquitetura MVC.
- Validar dados recebidos com Yup.
- Impedir o cadastro de e-mails repetidos.
- Proteger as senhas usando bcrypt.
- Criar login de usuários.
- Receber imagens de produtos com Multer.
- Salvar os dados dos produtos no banco.

## Back End — Node pt. II

- Gerar tokens de autenticação com JWT.
- Usar middleware para conferir o token antes de liberar rotas protegidas.
- Usar middleware de administrador nas rotas de gerenciamento.
- Criar, listar e atualizar categorias.
- Relacionar produtos e categorias.
- Criar ofertas e atualizar produtos.
- Fazer upload das imagens de categorias.
- Armazenar pedidos no MongoDB usando Mongoose.
- Criar e atualizar o status dos pedidos.

## Front End — React pt. I

- Criar o projeto React e organizar pastas de componentes, páginas, rotas, serviços, estilos, hooks e utilitários.
- Configurar ESLint e Prettier.
- Criar estilos globais com Styled Components.
- Construir as telas de login e cadastro.
- Controlar e validar formulários com React Hook Form.
- Conectar o front-end à API e configurar CORS.
- Mostrar mensagens com React Toastify.
- Guardar as informações do usuário no `localStorage`.
- Criar a página inicial e os primeiros carrosséis.

## Front End — React pt. II

- Finalizar os carrosséis e filtros de produtos.
- Criar o menu e as páginas de categorias.
- Compartilhar dados usando Context API.
- Criar Header e Footer.
- Criar o carrinho e sua lógica de quantidades e totais.

## Front End — React pt. III

- Finalizar o carrinho e o resumo do pedido.
- Enviar pedidos para o back-end.
- Configurar pagamentos com Stripe no back-end e no front-end.
- Criar a tela de pagamento.
- Usar temas com Styled Components.
- Organizar rotas internas com `Outlet`.
- Criar o painel administrativo, menu lateral e tabela de pedidos.

## Front End — React pt. IV

- Adicionar funções à tabela administrativa.
- Criar e finalizar o menu superior.
- Corrigir e organizar a listagem de produtos.
- Criar a tela de cadastro de produtos.
- Adicionar validações ao formulário.
- Criar e finalizar a edição de produtos.

## Estrutura conferida no código de referência

O back-end de referência possui:

- Controllers de usuários, sessão, produtos, categorias, pedidos e Stripe.
- Models de usuário, produto e categoria.
- Schema de pedidos no MongoDB.
- Middleware de autenticação.
- Rotas centralizadas no Express.
- PostgreSQL com Sequelize e MongoDB com Mongoose.
- JWT, bcrypt, Yup, Multer, Stripe, CORS e UUID.

## Comparação com o projeto atual

O projeto atual já possui:

- Cadastro e login.
- Cardápio, categorias, carrinho e checkout.
- Cadastro e atualização de pedidos.
- Painel administrativo.
- Cadastro, edição, exclusão, busca e ativação de produtos.
- Upload persistente de imagens.
- Layout baseado no Figma.

Diferença importante:

- A versão atual usa React com Vinext, banco D1 e armazenamento R2.
- Ela não usa a mesma arquitetura das aulas: Express, Sequelize, PostgreSQL, MongoDB, JWT, bcrypt, Yup, Multer, Stripe e Styled Components.

## Conclusão

Funcionalmente, o projeto atual cobre o fluxo principal do DEVBURGUER. Se a avaliação considerar apenas telas e funcionamento, ele está completo. Se o professor conferir as tecnologias e a organização ensinadas nas aulas, será necessário separar o projeto em API e interface e reconstruir a arquitetura usando a stack do curso.
