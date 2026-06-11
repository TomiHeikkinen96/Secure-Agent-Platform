# Phase 00 Setup Guide

This guide turns the repository from "documentation exists" into "ready to build."

The goal of Phase 00 is to confirm the local development tools, verify git, decide the project runtime baseline, and prepare the project for Phase 01 without generating application code yet.

## Phase 00 Deliverables

- Git repository initialized or verified.
- `main` and `develop` branches created or verified.
- Local toolchain checked.
- Project runtime baseline documented.
- Missing or optional tools identified before backend/frontend work begins.

## Current Toolchain Check

Observed from the user's Windows environment:

| Tool | Status | Note |
| --- | --- | --- |
| Git | Available | `git version 2.33.0.windows.2` |
| Node.js | Available | `v22.20.0` |
| npm | Available through `npm.cmd` | `npm.ps1` is blocked by PowerShell execution policy |
| Python | Available | `Python 3.10.6` |
| Docker | Available | `Docker version 29.5.3`; `docker run hello-world` passed |
| Docker Compose | Available | `Docker Compose version v5.1.4` |
| Azure CLI | Not visible on PATH | `az` command was not found |

These versions are a local snapshot, not a strict requirement for every contributor.

## Runtime Baseline Decision

Use containers as the reproducible baseline for project services and CI-like runs.

Use local tools for learning and official initialization commands when they make the ecosystem clearer.

Recommended baseline:

- Node.js: current LTS line is acceptable. The observed Node `v22.20.0` is fine for this project.
- Python: use Python 3.12+ for the project baseline, preferably through a backend container if the local machine keeps Python 3.10.6.
- Database: SQL Server runs in Docker Compose, not as an always-on local Windows service.
- Azure CLI: useful before cloud phases, but not required before the first local backend/frontend phases. Azure Cloud Shell can cover early portal-based exploration.

Good to know:

- Python 3.10 is in security support and reaches end of life in October 2026.
- For a new public portfolio project, avoid choosing a near-end-of-life runtime as the baseline.
- Local Python 3.10.6 can stay installed for older projects; this project can still run on a newer Python container image.

## Good To Know: npm on Windows PowerShell

Node installs both `npm.ps1` and `npm.cmd`.

PowerShell may block `npm.ps1` if script execution is restricted. In that case, this often works:

```powershell
npm.cmd --version
```

This is enough to continue learning Node/React. Later, you can decide whether to adjust PowerShell execution policy intentionally.

## Step 1: Verify Git

The repository uses:

- `main` for stable work and future deployment triggers.
- `develop` for active learning and integration.

Verify the current state with:

```powershell
git status --short --branch
git log --oneline --decorate -5
```

## Step 2: Confirm Tool Versions

Useful local checks:

```powershell
git --version
node --version
npm.cmd --version
python --version
```

## Step 3: Install or Enable Missing Tools

Before containerized app development, install or enable:

- Docker Desktop

Recommended order:

1. Docker Desktop
2. Optional newer local Python if you want local backend execution outside containers
3. Azure CLI before scripted local Azure work

Docker Desktop is needed before the local SQL Server container phase. Azure CLI is not urgent until Azure deployment phases, because Azure Cloud Shell provides browser-based Azure CLI access. Installing Azure CLI locally becomes useful when you want repeatable local scripts, local `az login`, or closer parity with CI/CD automation.

## Containers and Artifacts

Docker can run commands and produce artifacts.

Common patterns:

- Bind mount the repository into a container, run a command, and let generated files appear in the working tree.
- Build inside a container and copy build output from the image.
- Use Docker Compose to run the backend, frontend, and database as named services on a shared network.

This is useful for training because it makes runtime versions, networking, ports, environment variables, and service lifecycle explicit.

Security note:

- Containers reduce host-machine pollution and provide isolation.
- They are not magic armor. If you mount the repository into a container, commands inside the container can modify those mounted files.
- Prefer trusted base images, small images, non-root users where practical, lockfiles, and regular dependency updates.

## Step 4: Validate Docker When Installed

After Docker Desktop is installed and running:

```powershell
docker --version
docker compose version
docker run hello-world
```

Phase 00 result: `docker run hello-world` passed in the user's terminal.

Good to know:

- `docker compose up` starts services defined by the project.
- `docker compose down` stops and removes the containers.
- Named volumes can preserve database data after containers stop.
- Removing volumes is the "full reset" path when you want local data gone.

## Step 5: Ready for Phase 01

When git is initialized and the basic tools are ready, Phase 01 can begin.

Recommended next phase:

`Phase 01 - Backend Foundation`

The agent should guide through FastAPI setup, explain Python environment choices, and then create the first routes and tests.
