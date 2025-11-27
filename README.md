# API RESTful de Produtos

API desenvolvida em Node.js + Express, utilizando MongoDB como banco de dados e autenticação JWT para proteger operações de escrita.
O projeto segue boas práticas REST, separação por camadas (routes, controllers, models) e inclui testes automatizados com Jest + Supertest.

## Integrantes:

- Mariele Fernandes 
- Vinicius 
- Ludymilla

## Funcionalidades

### Usuários
- Criar usuário
- Login com geração de token JWT
- Renovação de token
- Listar usuários (protegido)
- Buscar usuário por ID (protegido)
- Atualizar usuário (protegido)
- Remover usuário (protegido)

### Produtos
- Criar produto (protegido)
- Listar produtos
- Buscar produto por ID
- Atualizar produto (protegido)
- Remover produto (protegido)

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Jest + Supertest (testes)
- dotenv (variáveis ambiente)
- bcryptjs
- swagger-ui-express
- YAML (Swagger)



## Estrutura do Projeto

shell
/config
  ├── database.js
/controllers
  ├── authController.js
  ├── produtosController.js
  ├── usuarioController.js
/middlewares
  ├── authMiddleware.js
/models
  ├── produtosModel.js
  ├── usuarioModel.js
/routes
  ├── apidocsRouter.js
  ├── produtosRouter.js
  ├── usuariosRouter.js
/tests
  ├── produtos.test.js
  ├── usuarios.test.js
.env
.gitignore
app.js
package-lock.json
packjage.json
README.md
swagger.yaml


## Como Executar o Projeto
1. Instale as dependências:
shell
npm install


2. Configure o arquivo .env:
shell
MONGODB_USER=seu_usuario
MONGODB_PASSWORD=sua_senha
MONGODB_HOST=seuhost.mongodb.net 
MONGODB_DBNM=seubanco
JWT_SECRET=suachave
JWT_EXPIRES=1h


3. Execute o servidor:
shell
npm run dev


### Autenticação (JWT)

As rotas de criação, atualização e exclusão de produtos exigem token JWT válido no header:

Authorization: Bearer <token>

Endpoints
Usuários
Criar usuário

POST /usuarios
Body:

{
  "nome": "Maria",
  "email": "maria@test.com",
  "senha": "abcd1234"
}


Resposta 201 – Usuário criado.

Login

POST /usuarios/login

{
  "usuario": "maria@test.com",
  "senha": "abcd1234"
}


Resposta 200:

{
  "token": "xxx.yyy.zzz"
}

Renovar token

POST /usuarios/renovar
(Precisa enviar token atual)

Produtos
Criar produto (protegido)

POST /produtos
Header: Authorization: Bearer token

Body:

{
  "nome": "Caderno",
  "preco": 25.50
}


Resposta 201 – Produto criado.

Listar todos

GET /produtos
Resposta 200: array de produtos.

Buscar por ID

GET /produtos/:id

Atualizar produto (protegido)

PUT /produtos/:id
Body:

{
  "nome": "Caderno Grande",
  "preco": 30
}

Remover produto (protegido)

DELETE /produtos/:id

### Testes Automatizados

Os testes utilizam Jest + Supertest.

Rodar testes:

npm test

Exemplos de testes implementados:

login

criação de usuário

criação de produto

listagem

busca por ID

atualização

remoção