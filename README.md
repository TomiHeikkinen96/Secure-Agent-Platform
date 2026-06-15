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

## Current Phase

Phase 04 - Auth Concepts Spike

## Local Development

Requirements: Docker Desktop with Linux containers enabled.

For a clean local review run:

```text
copy .env.example .env
dev-fresh.cmd
```

`dev-fresh.cmd` asks for confirmation, resets this project's local Docker volumes, runs checks, starts the stack, applies migrations, seeds data, and opens the frontend.

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

For PowerShell variants and Docker volume safety notes, see [scripts/README.md](scripts/README.md).

## Documentation

- Roadmap: [docs/plan.md](docs/plan.md)
- Agent workflow: [AGENTS.md](AGENTS.md)
- Workflow guide: [docs/workflow.md](docs/workflow.md)
- Architecture notes: [docs/architecture.md](docs/architecture.md)
- Repository structure: [docs/repository-structure.md](docs/repository-structure.md)
- Phase notes: [docs/phases](docs/phases)
