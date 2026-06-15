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

Development currently happens directly on `main` to keep the solo learning workflow simple. A separate integration branch can be added later if CI/CD or team collaboration makes that useful.

The project currently has a FastAPI backend, local SQL Server through Docker Compose, and a Vite React frontend that can read and write board data. Future phases should continue using official setup commands where useful so the setup process remains part of the learning.

## Local Development

After creating `.env` from `.env.example`, use the root launchers:

```text
dev-start.cmd
```

The start launcher starts the Docker Compose stack, creates the local database if needed, applies migrations, seeds development data, opens the frontend, and shows a ready screen. Press `Ctrl+C` in the launcher window to stop the stack gracefully.

The frontend service installs npm dependencies inside the `node:22-bookworm` container and stores them in the `frontend-node-modules` Docker volume. You do not need to run host-local `npm install` for normal development.

Common local commands:

| Command | Purpose |
| --- | --- |
| `dev-start.cmd` | Start the local app for normal development. |
| `dev-build.cmd` | Run containerized frontend dependency, lint, and production build checks without starting the app. |
| `dev-clean.cmd` | Stop containers and delete local Docker volumes after confirmation. |
| `dev-fresh.cmd` | Delete local Docker volumes after confirmation, run checks, then start the app. |
| `start-dev.cmd` | Same as `dev-start.cmd`; kept as the older start alias. |

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

To run containerized frontend dependency, lint, and production build checks without starting the app:

```powershell
.\dev-build.cmd
```

To run checks and then start the app in one PowerShell session:

```powershell
.\scripts\start-dev.ps1 -RunChecks
```

Local host ports can be changed in `.env`:

```text
FRONTEND_HOST_PORT=5173
BACKEND_HOST_PORT=8000
MSSQL_HOST_PORT=1433
```

The internal container ports stay fixed so services can still reach each other by Compose service name.

Local state is stored in Docker named volumes:

- `sqlserver-data`: SQL Server database files, including posts and comments.
- `frontend-node-modules`: frontend npm dependencies installed inside the container.

Normal `docker compose down` or stopping the launcher removes containers and the network, but keeps those volumes. That is why posts and comments survive restarts.

To wipe local Docker volumes and start from empty database/dependency state:

```powershell
.\dev-clean.cmd
```

This asks for confirmation, then deletes local SQL Server data and the frontend dependency volume. The next launcher run recreates, migrates, seeds the database, and reinstalls frontend dependencies in Docker.

For a full fresh review run:

```powershell
.\dev-fresh.cmd
```

This asks for confirmation, deletes local Docker volumes, runs the same checks as `dev-build.cmd`, then starts the app from seeded data.

## Documentation

- Project plan: [docs/plan.md](docs/plan.md)
- Agent workflow: [AGENTS.md](AGENTS.md)
- Workflow guide: [docs/workflow.md](docs/workflow.md)
- Phase 00 setup guide: [docs/setup.md](docs/setup.md)
- Architecture notes: [docs/architecture.md](docs/architecture.md)
- Repository structure: [docs/repository-structure.md](docs/repository-structure.md)
- Phase notes: [docs/phases](docs/phases)
