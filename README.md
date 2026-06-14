# Secure Agent AI Platform

A learning-first full-stack Azure project for building a small AI-enabled community board.

The goal is to practice the shape of modern cloud application development: React, FastAPI, Docker, Azure SQL, Microsoft Entra ID, Azure AI Foundry, RAG, monitoring, secret management, CI/CD, and eventually AKS.

This repository is intentionally public and educational. The app is small so the engineering concepts stay visible.

## Learning Goals

- Build a modern React frontend.
- Build and document a FastAPI backend.
- Run local infrastructure with Docker instead of always-on local services.
- Understand authentication and authorization with Microsoft Entra ID.
- Deploy to Azure with cost and security awareness.
- Add AI features through Azure AI Foundry.
- Practice CI/CD and production-minded checks.
- Keep phase-by-phase notes, quizzes, and portfolio talking points.

## Current Status

The repository is on the `develop` learning branch with backend, database, and frontend foundations being introduced phase by phase.

The frontend phase has started with a Vite React scaffold and a Docker Compose service for running the local Vite development server. Future phases should continue using official setup commands where useful so the setup process remains part of the learning.

## Local Development

After creating `.env` from `.env.example`, use the root launcher:

```text
start-dev.cmd
```

The launcher starts the Docker Compose stack, creates the local database if needed, applies migrations, seeds development data, opens the frontend, and shows a ready screen. Press `Ctrl+C` in the launcher window to stop the stack gracefully.

Default local URLs:

- Frontend: `http://localhost:5173/`
- Backend Swagger UI: `http://localhost:8000/docs`
- Backend health: `http://localhost:8000/health`

After startup, the launcher shows a ready screen and waits. Keep that window open while developing, then press `Ctrl+C` in the launcher window to stop the stack.

For terminal use instead of double-clicking:

```powershell
.\scripts\start-dev.ps1
```

To start without opening browser tabs:

```powershell
.\scripts\start-dev.ps1 -NoBrowser
```

To follow frontend/backend logs in the launcher window:

```powershell
.\scripts\start-dev.ps1 -FollowLogs
```

Local host ports can be changed in `.env`:

```text
FRONTEND_HOST_PORT=5173
BACKEND_HOST_PORT=8000
MSSQL_HOST_PORT=1433
```

The internal container ports stay fixed so services can still reach each other by Compose service name.

To wipe local Docker volumes and start from empty database state:

```powershell
.\scripts\reset-local-data.ps1
```

This deletes local SQL Server data and the frontend dependency volume. The next launcher run recreates, migrates, and seeds the database.

## Documentation

- Project plan: [docs/plan.md](docs/plan.md)
- Agent workflow: [AGENTS.md](AGENTS.md)
- Workflow guide: [docs/workflow.md](docs/workflow.md)
- Phase 00 setup guide: [docs/setup.md](docs/setup.md)
- Architecture notes: [docs/architecture.md](docs/architecture.md)
- Repository structure: [docs/repository-structure.md](docs/repository-structure.md)
- Phase notes: [docs/phases](docs/phases)
