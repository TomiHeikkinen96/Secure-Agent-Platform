# Agent Instructions

This repository is a learning-first portfolio project. The application matters, but the main outcome is that the human can explain the stack, the tradeoffs, the setup, and the deployment path in an AI Engineer interview.

## Project Goal

Build an Azure-hosted full-stack AI community board that demonstrates:

- React frontend development
- FastAPI backend development
- Authentication and authorization with Microsoft Entra ID
- Azure SQL
- Docker and Docker Compose
- Azure AI Foundry integration
- Basic RAG
- Monitoring with Azure Monitor and Application Insights
- Secret management with Azure Key Vault
- CI/CD through GitHub Actions
- A later AKS deployment phase

The project is intentionally small. Avoid expanding product scope unless the user explicitly asks.

## Collaboration Style

The user is an experienced embedded software engineer learning modern full-stack and Azure development. Treat them like a capable peer entering a different ecosystem.

Agents must:

- Explain full-stack concepts as they appear, especially Node, React, FastAPI, Docker, OAuth/OIDC, Azure networking, CI/CD, and cloud cost/security tradeoffs.
- Prefer short, contained work sessions over long autonomous runs.
- Stop at phase boundaries with a recap, suggested git commit, and next-step options.
- Keep the human in the loop for setup, init commands, cloud resource creation, Docker commands, and deployment commands.
- Provide the exact command for the user to run, explain what it does, and ask them to paste the result when useful.
- Use agentic coding for syntax, wiring, tests, and troubleshooting, while preserving the user's hands-on setup experience.
- Call out "Good to know" notes when a full-stack convention differs from embedded or systems development expectations.
- Report transient local machine findings in chat first. Commit only durable project decisions, recommended baselines, setup notes, and security-relevant gotchas.
- Keep public documentation lean. Avoid committing chat transcripts, temporary confusion, personal scratch answers, or placeholder sections.

Agents should not silently run long setup flows, create cloud resources, install global tools, install host-local project dependencies, or hide important environment details from the user.

## Anti-Drift Rule

Stay within the current phase unless the user explicitly approves a scope change.

Before adding a new technology, service, library, architectural pattern, or workflow, explain:

- Why it is needed now
- What it teaches
- What complexity it adds
- Whether it can wait for a later phase

If the idea is useful but not needed yet, document it under follow-up tasks instead of implementing it.

## Setup Philosophy

Prefer official initialization commands over hand-written scaffolding when learning value exists.

Examples:

- For React, guide the user through `npm create vite@latest` when starting the frontend.
- For FastAPI, explain the package setup and project structure before creating files.
- For Docker, guide the user through `docker compose up`, `docker compose down`, logs, ports, volumes, and service names.

The agent may edit generated files after the user has run an init command.

Do not pre-create application directories that would conflict with official init tools unless the user asks.

Use containers as the reproducible project baseline when they teach the deployment model or reduce host-machine drift. Local tools are still useful for learning the ecosystem, quick editor integration, and understanding what the container is replacing.

## Recommended Stack Path

Use this default path unless the user changes direction:

- Frontend: React with Vite first.
- Optional later learning phase: Next.js comparison or migration spike, after plain React basics are understood.
- Backend: FastAPI.
- Python environment: start with familiar `venv` and `pip` concepts when explaining Python packaging. Prefer Python 3.12+ or a documented container baseline for new backend work. Consider `uv` as an optional modern tooling note or later improvement, not as required early knowledge.
- Database: SQL Server in Docker for local development, to stay close to Azure SQL while avoiding an always-running local database service.
- Cloud: Azure App Service first, AKS only near the end.

## Docker and Local Services

Local databases and infrastructure services should be containerized.

For Node and Python application work:

- Prefer local official init commands when the learning value is high.
- Prefer Dockerfiles and Docker Compose for reproducible runs, CI parity, and dependency isolation.
- Explain how commands can be run inside containers and how generated files/artifacts appear through bind mounts or copied build outputs.
- Do not run host-local dependency installation commands such as `npm install`, `pip install`, or global tool installs for normal project work unless the user explicitly asks for that local setup path.
- For the React frontend, use the containerized workflow as the baseline. `dev-start.cmd` / `scripts/start-dev.ps1` starts the Compose `frontend` service, which runs `npm install` inside the `node:22-bookworm` container and stores dependencies in the `frontend-node-modules` Docker volume.
- For frontend checks, prefer the standardized launcher command `.\dev-build.cmd`, or `.\scripts\start-dev.ps1 -ChecksOnly` from PowerShell. If Docker Desktop is not running or the command cannot be executed, stop and ask the user to run the command rather than falling back to host-local installs.
- For a destructive fresh-state review, use `.\dev-fresh.cmd`. Explain that it deletes local Docker volumes before running checks and starting the app. Do not use it casually when preserving local posts/comments matters.
- Do not treat containers as a complete security boundary. They reduce host pollution and provide process/filesystem isolation, but dependency scripts can still affect mounted project files and use network access.

For SQL Server:

- Prefer Docker Compose.
- Explain container lifecycle clearly.
- Make it clear that `docker compose down` stops services.
- Explain named volumes if data persists across restarts.
- Explain how to remove volumes when the user wants a full reset.

Avoid requiring always-on local services.

## Azure Cost and Risk Rule

Before creating or guiding creation of Azure resources, agents must provide:

- Expected resource types
- Rough cost/risk notes
- Free tier or credit considerations when relevant
- Cleanup instructions
- Secret/security considerations

Assume the user may use Azure trial credits, but still teach cost awareness.

## Git Workflow

Preferred public repo workflow for now:

- `main`: active solo development branch and future CI/CD deployment source
- `develop`: optional later integration branch if CI/CD, deployment gating, or collaboration creates a real need
- feature branches: optional for larger phase work

At the end of each phase, suggest:

- Files changed
- Tests or checks run
- A commit message
- Whether to tag the phase

Suggested tag format:

- `phase-00-agentic-workflow`
- `phase-01-backend-foundation`
- `phase-02-react-frontend`

Do not run destructive git commands. If the repository has not been initialized, guide the user through `git init`, branch setup, and first commit.

## CI/CD Guidance

Introduce CI/CD incrementally.

Early CI should verify:

- Backend formatting/linting/tests when backend exists
- Frontend build/tests when frontend exists
- Docker Compose validation when compose files exist

Deployment automation should come after the app can run locally and after Azure resource choices are understood.

Use GitHub Actions by default.

## Documentation Timing

Every completed phase should create or update a document in:

`docs/phases/`

Naming format:

`phaseXX_short_description.md`

Examples:

- `phase00_agentic_workflow_setup.md`
- `phase01_backend_foundation.md`
- `phase02_react_frontend.md`

Update phase documentation:

- At the start of a phase, only if a new phase document or checklist is useful.
- During a phase, only for durable decisions, commands that matter, architecture notes, or follow-up tasks.
- At the end of a phase, always update the phase summary, verification notes, lessons, quiz, and follow-up tasks.

Do not update phase docs after every small chat exchange. Keep transient debugging, local terminal oddities, and the user's quiz answers in chat unless the user explicitly asks to commit them.

Each phase document should include:

- Summary
- What Changed
- Commands I Ran
- What I Learned
- Good To Know
- Portfolio Talking Points
- Quiz
- Follow-up Tasks

The Quiz section should contain questions only. Organize quiz questions by learning depth when a phase introduces several concepts:

- Conceptual: broad ideas, tradeoffs, and why a technology exists.
- Architecture: how services, boundaries, data flow, and deployment choices fit together.
- Implementation: concrete files, commands, code paths, and framework conventions.
- Operations: running, debugging, resetting, and verifying the system.

If a phase is very small, a single quiz list is fine. If the user wants to practice, the practice should be done in different chat window specifically meant for the quiz and review.

Because this is a public repository, use "Portfolio Talking Points" instead of private interview coaching language. It is fine for the repository to show deliberate learning, but avoid writing fake expertise or overly personal notes.

## Testing and Verification

Agents should verify changes with the narrowest useful checks.

Examples:

- Backend: unit tests, FastAPI route checks, OpenAPI/Swagger sanity check
- Frontend: build, component tests when present, browser smoke test
- Docker: `docker compose config`, service startup, logs
- CI: GitHub Actions workflow syntax and local equivalents when possible

If a check cannot be run, say why and document the residual risk.

## Secrets and Public Repository Safety

Never commit secrets.

Use `.env.example` for required configuration names and placeholder values.

Use local `.env` files only when ignored by git.

For Azure phases, prefer managed identities and Key Vault when the phase introduces them.

## Phase Stop Checklist

At the end of a phase, agents must provide:

- Short recap
- Verification results
- Phase document location
- Suggested commit message
- Suggested tag, if appropriate
- Recommended next phase
