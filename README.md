<div align="center">

<img src="frontend/src/imgs/logo.png" width="96" alt="EcoCenter logo" />

# EcoCenter

**Platform for finding and managing recycling drop-off points (ecopoints), with AI-assisted search.**

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Claude API](https://img.shields.io/badge/Claude_API-D97757?logo=anthropic&logoColor=white)

</div>

**English** · [Português](README.pt-BR.md)

> [!NOTE]
> Built as a team for the **Projeto Temático III** course at the [Universidade de Caxias do Sul](https://www.ucs.br/) (UCS) in 2024. In 2026 I revisited the project to redesign the interface and add natural-language search with the Claude API. The UI and code are in Portuguese.

---

## The problem

People who want to dispose of waste properly often don't know where to take it or which drop-off point accepts each kind of material. On the other side, companies that run ecopoints have no simple way to advertise what they accept and when they are open.

## The solution

EcoCenter brings the two sides together:

- **Residents** browse validated ecopoints, filter by type of waste and see opening hours. They can also just describe what they want to throw away ("an old phone charger and some pizza boxes") and let the AI pick the matching categories.
- **Companies** pre-register their ecopoint with address, accepted waste and opening hours.
- **Administrators** review pre-registrations. On approval, the system creates a login for the company and e-mails the credentials.

## How it works

1. A company fills in the registration form. The address is auto-completed from the postal code (CEP) via the **ViaCEP** API, and opening hours support two shifts per weekday.
2. The ecopoint is saved as **not validated** and appears in the admin's pre-registration list.
3. When the admin approves it, the API creates an `ecopointer` user with a random password (stored with **bcrypt**) and sends an e-mail with the credentials through **Nodemailer**.
4. The company logs in (**JWT**, 1-hour expiry) and can edit its own ecopoints.
5. Validated ecopoints show up on the public list, with filters by waste type.

## AI-assisted search

On the ecopoint list, the user can describe in their own words what they want to dispose of. The back end sends the text, along with the waste categories registered in the database, to **Claude Haiku**, which returns only the matching categories. The response is parsed and validated against the original list (anything the model invents is discarded), and the matching categories are applied as filters on the list.

The API key stays on the server, and the feature degrades gracefully: without `ANTHROPIC_API_KEY`, the route returns `503` and the rest of the app keeps working.

## Features

| Profile | What they can do |
|---|---|
| Visitor | List validated ecopoints, filter by waste type, search with AI, pre-register an ecopoint |
| Ecopoint (`ecopointer`) | Log in and edit their own ecopoints |
| Admin | Approve pre-registrations, manage waste types |

## Stack

| Layer | Technologies |
|---|---|
| Front end | React 18, React Router, CSS Modules, Axios, React Select, React Toastify (Create React App) |
| Back end | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT, bcrypt, role-based middleware (`admin` / `ecopointer`) |
| Integrations | Claude API (Anthropic), ViaCEP, Nodemailer |

## Running locally

Requirements: Node.js 18+ and a MongoDB instance (local or Atlas).

```bash
git clone https://github.com/giobroliatto/ecocenter.git
cd ecocenter

# API (http://localhost:3001)
cd backend
npm install
# create backend/.env with the variables below
npm run dev

# Front end (http://localhost:3000), in another terminal
cd frontend
npm install
npm start
```

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `SECRET` | Yes | Secret used to sign JWTs |
| `EMAIL`, `PASS_EMAIL` | For approvals | Account used to send credential e-mails |
| `ANTHROPIC_API_KEY` | For AI search | Anthropic API key |
| `CLAUDE_MODEL` | No | Model used in the search (default `claude-haiku-4-5`) |

> The first admin user has to be created directly in the `users` collection with `role: "admin"` and a bcrypt-hashed password.

## Structure

```
backend/src/
├── config/          # MongoDB connection
├── models/          # Ecopoint, Residue, User
├── controllers/     # Ecopoints, waste types, auth, users, e-mail and AI
├── middlewares/     # JWT and admin checks
└── routes/
frontend/src/
├── components/      # EcopointsList, EcopointRegistration, EcopointsPreRegistered,
│                    # ResiduesForm, SchedulePicker, UserProfile...
└── imgs/
```

---

## Authors

Made by **Giovani Broliatto**, **Eduardo Marcon** and **Julio Bassanesi**.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-giobroliatto-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giobroliatto/)
