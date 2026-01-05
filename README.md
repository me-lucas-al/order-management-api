# 📦 Order Management API

API RESTful para **gestão de pedidos e autenticação**, desenvolvida com **Node.js, Express, TypeScript e MongoDB**.

O projeto segue os princípios de **Clean Architecture** e **SOLID**, com foco em:

* Separação de responsabilidades
* Tipagem forte
* Regras de negócio bem definidas
* Testes automatizados e isolados

---

## 🚀 Tecnologias Utilizadas

* **Runtime:** Node.js (v20)
* **Linguagem:** TypeScript
* **Framework:** Express
* **Banco de Dados:** MongoDB (Mongoose)
* **Validação:** Zod
* **Testes:** Vitest, Supertest, MongoDB Memory Server
* **Infraestrutura:** Docker & Docker Compose
* **Documentação:** Swagger (OpenAPI)

---

## 🛠️ Como Executar o Projeto

Você pode executar o projeto **de duas formas**:

* Usando **Docker** (recomendado)
* Usando **dependências locais** (Node + MongoDB)

Escolha a que melhor se encaixa no seu ambiente.

---

## 🐳 Opção 1: Executar com Docker (Recomendado)

Não é necessário instalar Node.js ou MongoDB localmente.

### Pré-requisitos

* Docker
* Docker Compose

### Subir a aplicação

```bash
docker compose up -d
```

📌 Serviços disponíveis:

* **API:** [http://localhost:3000](http://localhost:3000)
* **MongoDB Express:** [http://localhost:8081](http://localhost:8081)

---

## 💻 Opção 2: Executar com Dependências Locais

### Pré-requisitos

* Node.js v20
* MongoDB (local ou via Docker)

### Instalar dependências

```bash
pnpm install
# ou
npm install
```

### Configurar variáveis de ambiente

Crie um arquivo `.env` baseado em `.env.example`.

### Subir apenas o MongoDB via Docker (opcional)

Caso não tenha MongoDB instalado localmente:

```bash
docker compose up mongo -d
```

### Iniciar a aplicação

```bash
pnpm dev
# ou
npm run dev
```

---

## 🧪 Rodando os Testes

Os testes utilizam **mongodb-memory-server**, portanto:

* Não dependem de MongoDB externo
* Não afetam dados reais

### Executar testes

```bash
pnpm test
# ou
npm run test
```

✔️ Testes de integração
✔️ Banco em memória
✔️ Ambiente totalmente isolado

---

## 📚 Documentação da API (Swagger)

A documentação interativa é gerada automaticamente com a aplicação em execução.

📎 Acesse:

```
http://localhost:3000/docs
```

---

## 📌 Principais Rotas

| Método | Rota                | Descrição                            | Auth |
| ------ | ------------------- | ------------------------------------ | ---- |
| GET    | /health             | Health Check                         | ❌    |
| POST   | /auth/register      | Registrar novo usuário               | ❌    |
| POST   | /auth/login         | Login (retorna JWT)                  | ❌    |
| POST   | /orders             | Criar pedido                         | ✅    |
| GET    | /orders             | Listar pedidos (filtros e paginação) | ✅    |
| PATCH  | /orders/:id/advance | Avançar status do pedido             | ✅    |

---

## 🧠 Regras de Negócio

### 🔄 Fluxo de Estados do Pedido

O fluxo do pedido é **estrito e unidirecional**:

```
CREATED ➝ ANALYSIS ➝ COMPLETED
```

Regras:

* ❌ Não é permitido pular etapas
* ❌ Não é permitido retroceder
* ❌ Pedidos não podem ter valor total igual a zero

---

## 🧩 Arquitetura

* Clean Architecture
* Regras de negócio desacopladas do framework
* Camadas bem definidas (controllers, use cases, repositories)
* Código testável e escalável

Só mandar 🚀
