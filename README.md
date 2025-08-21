# Project Management System

A full-stack, multi-tenant project management system built for technical assessments and scalable deployment. Designed with modular architecture, clean separation of concerns, and robust frontend/backend integration.

---

## Project Structure
```bash
root/
  ├── backend/ # Django + GraphQL backend │ 
    ├── core/ # Shared models and utilities │ 
    ├── projects/ # Project-related logic 
    │── tasks/ # Task and comment management 
  ├── frontend/ 
  │ └── pms_frontend/ # React + Apollo frontend 
    │ └── src/ │ 
      ├── apollo/ # Apollo client setup │ 
      ├── components/ # Reusable UI components │ 
      ├── graphql/ # Queries and mutations │ 
      ├── pages/ # Route-based views 
      │── types/ # Shared TypeScript types 
  ├── postgres_conf/ # Custom PostgreSQL config (optional) 
  ├── docker-compose.yml # Multi-service orchestration 
  └── Makefile # Dev automation
```
Code

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Apollo Client, TailwindCSS
- **Backend**: Django, GraphQL (Graphene), PostgreSQL
- **DevOps**: Docker, Docker Compose, Makefile

---

## Features

- Multi-tenant architecture with isolated data per tenant
- Modular GraphQL schema with clean inheritance
- Responsive UI with TailwindCSS and dynamic Apollo queries
- CRUD operations for tasks and comments
- Seeded demo data for predictable testing
- Dockerized setup with Makefile automation

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/shinysherbina/pms.git
cd pms
```

### 2. Start Docker Engine
   Make sure Docker Desktop is running (especially on Windows/macOS).

### 3. Build and Start Containers

```bash
docker-compose up --build
```
This builds your images and starts the services. 

### 4. Run these Makefile commands
  ```bash
make makemigrations
make migrate
make seed
```
This creates sample seed data to test with.
### 5. Start the frontend
  ```bash
cd frontend
cd pms-frontend
npm run dev
```
Frontend : http://localhost:5173

Backend GraphQL Playground: http://localhost:8000/graphql

## Architectural Notes
Backend uses class-based schema inheritance for clean query/mutation composition

Frontend uses Apollo Client with type-safe hooks and modular query definitions

Docker ensures consistent dev environments across platforms

## TODOs / Improvements
[ ] Add authentication and tenant switching UI

[ ] Implement pagination and filtering

[ ] Improve error handling and form validation

[ ] Add unit and integration tests
