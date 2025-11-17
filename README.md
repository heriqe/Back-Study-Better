# Back-Study-Better

API backend para suporte ao estudo — gerenciamento de matérias, planos e simulados.

## Descrição
Projeto backend em Node.js com rotas para autenticação, gerenciamento de matérias, planos de estudo, simulados e rotas públicas. Ideal para aplicações focadas em organização de estudos e acompanhamento de desempenho.

## Funcionalidades principais
- Registro e login de usuários (JWT)
- CRUD de matérias
- Gestão de planos de estudo
- Simulados (criação e execução)
- Rotas públicas para conteúdo não autenticado

## Tecnologias
- Node.js
- Express
- SQLite (iniciado via db/init.sql)
- JWT para autenticação

## Pré-requisitos
- Node.js >= 14
- npm

## Instalação
1. Clone o repositório:

   git clone https://github.com/heriqe/Back-Study-Better.git
   cd Back-Study-Better

2. Instale dependências:

   npm install

3. Configure variáveis de ambiente (exemplo `.env`):

   PORT=3000
   DATABASE_FILE=./src/db/database.sqlite
   JWT_SECRET=sua_chave_secreta_aqui

4. Inicialize o banco (se necessário):

   - O arquivo `src/db/init.sql` contém o esquema inicial. Rode-o na sua instância SQLite para criar as tabelas.

## Como executar
- Em produção:

  node src/app.js

- Em desenvolvimento (com nodemon):

  npm run dev

## Estrutura principal do projeto

src/
 - app.js
 - controllers/ (authController, materiasController, meController, planoController, publicController, simuladoController)
 - db/ (index.js, init.sql)
 - middlewares/ (middlewareAutenticacao.js, errorHandler.js)
 - routes/ (authRoutes, materiasRoutes, meRoutes, planoRoutes, publicRoutes, simuladoRoutes, userRoutes)
 - utils/ (jwt.js, response.js)
 - validador/ (validators e handler)

## Endpoints principais
(Endpoints listados de forma resumida — ver rotas na pasta `src/routes` para detalhes)

- POST /auth/register — registrar novo usuário
- POST /auth/login — autenticar e receber token JWT
- GET /me — informações do usuário (autenticado)
- GET /materias — listar matérias
- POST /materias — criar matéria (autenticado)
- GET /plano — planos de estudo
- POST /plano — criar plano de estudo (autenticado)
- Rotas de simulado e públicas em `src/routes/simuladoRoutes.js` e `src/routes/publicRoutes.js`

## Autenticação
A API usa JWT. Inclua o header `Authorization: Bearer <token>` nas requisições que exigem autenticação.

## Contribuindo
- Abra uma issue para discutir mudanças grandes
- Envie PRs pequenas e atômicas
- Siga o padrão de código do projeto

## Licença
Projeto sem licença especificada — adicione um `LICENSE` se necessário.

## Autor
Henrique Ferreira

## Status
Em desenvolvimento
