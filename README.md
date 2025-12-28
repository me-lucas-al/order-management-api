# 📦 Desafio Técnico Backend – API de Gestão de Pedidos

## 📌 Visão Geral

Este projeto consiste em uma API backend desenvolvida para resolver um desafio técnico com foco em **organização de código, domínio de TypeScript e implementação de regras de negócio**, utilizando **Node.js, Express, MongoDB (Mongoose) e TypeScript**.

A solução foi pensada com base em **boas práticas de arquitetura**, separação de responsabilidades e foco em **código limpo e manutenível**, simulando um cenário real de produção.

---

## 🧠 Decisões e Conceitos Utilizados

* Arquitetura em camadas (routes → controllers → services → models)
* Regras de negócio centralizadas na camada de serviço
* Tipagem forte com TypeScript (enums e interfaces)
* Controle explícito do ciclo de vida dos pedidos (state machine)
* Autenticação baseada em JWT
* Testes unitários focados em regras de negócio (Vitest)

---

## 🏗️ Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.schema.ts
│   ├── orders/
│   │   ├── order.controller.ts
│   │   ├── order.service.ts
│   │   ├── order.routes.ts
│   │   ├── order.model.ts
│   │   ├── order.types.ts
│   │   └── order.schema.ts
├── shared/
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   ├── errors/
│   │   └── AppError.ts
│   └── database/
│       └── mongoose.ts
├── app.ts
└── server.ts
```

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação.

### Funcionalidades:

* Registro de usuários com senha criptografada
* Login retornando token JWT
* Middleware de autenticação para proteger as rotas de pedidos

### Rotas protegidas:

Todas as rotas sob `/orders` exigem um token JWT válido.

---

## 📦 Gestão de Pedidos

### Estrutura do Pedido

Cada pedido contém:

* `lab`, `patient`, `customer` (strings)
* `state`: `CREATED → ANALYSIS → COMPLETED`
* `status`: `ACTIVE | DELETED`
* `services` (array obrigatório)

Cada serviço possui:

* `name`
* `value`
* `status`: `PENDING | DONE`

---

## ✅ Regras de Negócio Implementadas

### Criação de Pedido

* Não é permitido criar pedidos sem serviços
* O valor total dos serviços deve ser maior que zero
* Valores padrão ao criar:

  * `state = CREATED`
  * `status = ACTIVE`

### Fluxo de Estados do Pedido

O ciclo de vida do pedido segue uma ordem **estritamente controlada**:

```
CREATED → ANALYSIS → COMPLETED
```

Regras aplicadas:

* Não é permitido pular etapas
* Não é permitido retroceder estados
* Pedidos concluídos não podem avançar

A transição de estado é realizada pelo endpoint:

```
PATCH /orders/:id/advance
```

Toda a validação ocorre na camada de serviço.

---

## 📄 Resumo dos Endpoints

### Autenticação

* `POST /auth/register`
* `POST /auth/login`

### Pedidos

* `POST /orders` – Criação de pedido
* `GET /orders` – Listagem com paginação e filtro por estado
* `PATCH /orders/:id/advance` – Avanço de estado do pedido

---

## 🧪 Testes (Vitest)

Foram implementados **testes unitários** focados na principal regra de negócio do sistema:
o controle do fluxo de estados do pedido.

Os testes garantem:

* Transições válidas de estado
* Bloqueio de transições inválidas
* Impedimento de avanço após o estado `COMPLETED`

Os testes são independentes da camada HTTP e do banco de dados.

---

## 🧰 Tecnologias Utilizadas

* Node.js
* Express
* TypeScript
* MongoDB + Mongoose
* JWT
* Vitest
* Docker (opcional)

---

## 🚀 Como Executar o Projeto

```bash
npm install
npm run dev
```

Para executar os testes:

```bash
npm run test
```

---

## 📌 Considerações Finais

Esta solução foi desenvolvida priorizando:

* Clareza de código
* Correta aplicação das regras de negócio
* Escalabilidade
* Manutenibilidade

O objetivo foi entregar uma solução **orientada a produção**, e não apenas atender aos requisitos mínimos do desafio.

É só falar.
