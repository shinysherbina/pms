# 🧠 Project Management System

A full-stack, multi-tenant project management system built for technical assessments and scalable deployment. Designed with modular architecture, clean separation of concerns, and robust frontend/backend integration.

---

## 📁 Project Structure

root/ ├── backend/ # Django + GraphQL backend │ ├── core/ # Shared models and utilities │ ├── projects/ # Project-related logic │ └── tasks/ # Task and comment management ├── frontend/ │ └── pms_frontend/ # React + Apollo frontend │ └── src/ │ ├── apollo/ # Apollo client setup │ ├── components/ # Reusable UI components │ ├── graphql/ # Queries and mutations │ ├── pages/ # Route-based views │ └── types/ # Shared TypeScript types ├── postgres_conf/ # Custom PostgreSQL config (optional) ├── docker-compose.yml # Multi-service orchestration └── Makefile # Dev automation

Code

---

## 🧪 Tech Stack

- **Frontend**: React, TypeScript, Vite, Apollo Client, TailwindCSS
- **Backend**: Django, GraphQL (Graphene), PostgreSQL
- **DevOps**: Docker, Docker Compose, Makefile

---

## 🚀 Features

- 🔐 Multi-tenant architecture with isolated data per tenant
- 🧩 Modular GraphQL schema with clean inheritance
- 🖥️ Responsive UI with TailwindCSS and dynamic Apollo queries
- 📝 CRUD operations for tasks and comments
- 🧪 Seeded demo data for predictable testing
- ⚙️ Dockerized setup with Makefile automation

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/project-management-system.git
cd project-management-system
```

2. Start everything with Makefile

```bash
make up
```

This will:

Build and start all Docker containers

Apply migrations

Seed the database (if configured)

3. Access the app
   Frontend: http://localhost:5173

Backend GraphQL Playground: http://localhost:8000/graphql

🧰 Makefile Commands
Command Description
make up Build and start all services
make down Stop and remove containers
make logs View combined logs from all services
make migrate Run Django migrations
make seed Seed the database with demo data
make restart Restart all services
You can customize these targets in the Makefile to suit your workflow.

🧠 Architectural Notes
Backend uses class-based schema inheritance for clean query/mutation composition

Frontend uses Apollo Client with type-safe hooks and modular query definitions

Docker ensures consistent dev environments across platforms

📌 TODOs / Improvements
[ ] Add authentication and tenant switching UI

[ ] Implement pagination and filtering

[ ] Improve error handling and form validation

[ ] Add unit and integration tests
