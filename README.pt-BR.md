<div align="center">

<img src="frontend/src/imgs/logo.png" width="96" alt="Logo do EcoCenter" />

# EcoCenter

**Plataforma para encontrar e gerenciar ecopontos de reciclagem, com busca assistida por IA.**

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Claude API](https://img.shields.io/badge/Claude_API-D97757?logo=anthropic&logoColor=white)

</div>

[English](README.md) · **Português**

> [!NOTE]
> Projeto feito em equipe para a disciplina de **Projeto Temático III** da [Universidade de Caxias do Sul](https://www.ucs.br/) (UCS), em 2024. Em 2026 voltei ao projeto para redesenhar a interface e adicionar busca em linguagem natural com a API do Claude.

---

## O problema

Quem quer descartar resíduos do jeito certo muitas vezes não sabe para onde levar nem qual ponto de coleta aceita cada tipo de material. Do outro lado, as empresas que mantêm ecopontos não têm um jeito simples de divulgar o que aceitam e quando estão abertas.

## A solução

O EcoCenter junta os dois lados:

- **Moradores** consultam os ecopontos validados, filtram por tipo de resíduo e veem os horários de funcionamento. Também podem só descrever o que querem descartar ("um carregador de celular velho e umas caixas de pizza") e deixar a IA escolher as categorias certas.
- **Empresas** fazem o pré-cadastro do ecoponto com endereço, resíduos aceitos e horários.
- **Administradores** revisam os pré-cadastros. Na aprovação, o sistema cria um login para a empresa e envia as credenciais por e-mail.

## Como funciona

1. A empresa preenche o formulário de cadastro. O endereço é completado a partir do CEP pela API do **ViaCEP**, e os horários aceitam dois turnos por dia da semana.
2. O ecoponto é salvo como **não validado** e aparece na lista de pré-cadastros do administrador.
3. Quando o administrador aprova, a API cria um usuário `ecopointer` com senha aleatória (guardada com **bcrypt**) e envia um e-mail com as credenciais via **Nodemailer**.
4. A empresa faz login (**JWT**, com expiração de 1 hora) e pode editar os próprios ecopontos.
5. Os ecopontos validados aparecem na lista pública, com filtros por tipo de resíduo.

## Busca assistida por IA

Na lista de ecopontos, o usuário pode descrever com as próprias palavras o que quer descartar. O back-end envia o texto, junto com as categorias de resíduo cadastradas no banco, para o **Claude Haiku**, que devolve só as categorias que se encaixam. A resposta é parseada e validada contra a lista original (o que o modelo inventar é descartado), e as categorias encontradas viram filtros na lista.

A chave da API fica só no servidor, e a funcionalidade falha de forma controlada: sem `ANTHROPIC_API_KEY`, a rota responde `503` e o resto do app continua funcionando.

## Funcionalidades

| Perfil | O que pode fazer |
|---|---|
| Visitante | Listar ecopontos validados, filtrar por resíduo, buscar com IA, pré-cadastrar um ecoponto |
| Ecoponto (`ecopointer`) | Fazer login e editar os próprios ecopontos |
| Administrador | Aprovar pré-cadastros, gerenciar os tipos de resíduo |

## Stack

| Camada | Tecnologias |
|---|---|
| Front-end | React 18, React Router, CSS Modules, Axios, React Select, React Toastify (Create React App) |
| Back-end | Node.js, Express, Mongoose |
| Banco de dados | MongoDB |
| Autenticação | JWT, bcrypt, middleware por papel (`admin` / `ecopointer`) |
| Integrações | API do Claude (Anthropic), ViaCEP, Nodemailer |

## Rodando localmente

Pré-requisitos: Node.js 18+ e um MongoDB (local ou Atlas).

```bash
git clone https://github.com/giobroliatto/ecocenter.git
cd ecocenter

# API (http://localhost:3001)
cd backend
npm install
# crie o backend/.env com as variáveis abaixo
npm run dev

# Front-end (http://localhost:3000), em outro terminal
cd frontend
npm install
npm start
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `MONGO_URI` | Sim | Connection string do MongoDB |
| `SECRET` | Sim | Segredo para assinar os JWTs |
| `EMAIL`, `PASS_EMAIL` | Para aprovações | Conta usada para enviar os e-mails com as credenciais |
| `ANTHROPIC_API_KEY` | Para a busca com IA | Chave da API da Anthropic |
| `CLAUDE_MODEL` | Não | Modelo usado na busca (padrão `claude-haiku-4-5`) |

> O primeiro administrador precisa ser criado direto na coleção `users`, com `role: "admin"` e a senha em hash bcrypt.

## Estrutura

```
backend/src/
├── config/          # Conexão com o MongoDB
├── models/          # Ecopoint, Residue, User
├── controllers/     # Ecopontos, resíduos, autenticação, usuários, e-mail e IA
├── middlewares/     # Verificação de JWT e de administrador
└── routes/
frontend/src/
├── components/      # EcopointsList, EcopointRegistration, EcopointsPreRegistered,
│                    # ResiduesForm, SchedulePicker, UserProfile...
└── imgs/
```

---

## Autor

**Feito por Giovani Broliatto**, com contribuições de Eduardo Marcon e Julio Bassanesi, como projeto em equipe na UCS. O redesign de 2026 e a busca com IA são trabalho meu.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-giobroliatto-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giobroliatto/)
