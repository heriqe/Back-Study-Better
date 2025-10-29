# StudyBetter

## Visão Geral
O StudyBetter é uma aplicação web que permite aos usuários se registrarem, fazerem login e gerenciarem quizzes. Usuários podem criar quizzes, responder perguntas e gerenciar seus horários. Esta aplicação é construída utilizando Node.js e Express.

## Funcionalidades
- Registro e login de usuários
- Gerenciamento de quizzes (criar e listar quizzes)
- Gerenciamento de perguntas (recuperar e validar perguntas)
- Gerenciamento de conteúdos educacionais
- Gerenciamento de horários do usuário

## Tecnologias Utilizadas
- Node.js
- Express
- MySQL
- bcrypt para hash de senhas
- JSON Web Tokens (JWT) para autenticação

## Instalação
1. Clone o repositório:
   ```
   git clone https://github.com/yourusername/Back-Study-Better.git
   ```
2. Navegue até o diretório do projeto:
   ```
   cd StudyBetter
   ```
3. Instale as dependências:
   ```
   npm install
   ```

## Endpoints da API
- **Autenticação**
  - `POST /register`: Registrar um novo usuário
  - `POST /login`: Fazer login de um usuário existente

- **Quizzes**
  - `GET /quizzes`: Listar todos os quizzes
  - `POST /quizzes`: Criar um novo quiz

- **Perguntas**
  - `GET /quizzes/:quizId/questions`: Listar perguntas de um quiz específico
  - `POST /quizzes/:quizId/questions`: Adicionar uma nova pergunta a um quiz

- **Conteúdos**
  - `GET /contents`: Listar todos os conteúdos educacionais

- **Horários**
  - `POST /schedules`: Criar um novo horário
  - `GET /schedules/:userId`: Listar horários de um usuário específico
