# Repository Structure

Planned structure:

```text
.
|-- AGENTS.md
|-- README.md
|-- docs/
|   |-- plan.md
|   |-- architecture.md
|   |-- workflow.md
|   |-- repository-structure.md
|   |-- templates/
|   |   `-- phase_template.md
|   `-- phases/
|       `-- phase00_agentic_workflow_setup.md
|-- frontend/
|-- backend/
|-- database/
|-- docker/
`-- .github/
    `-- workflows/
```

Application directories should be created when their phase begins.

Reasons:

- React setup should use the official Vite initialization flow.
- Backend structure should be introduced alongside FastAPI concepts.
- Docker Compose should be introduced when there are services to orchestrate.
- GitHub Actions should be introduced when there is something meaningful to verify.

## Planned Directories

`frontend/`

React application. Expected to start with Vite.

`backend/`

FastAPI application, tests, dependency management, and API documentation.

`database/`

Schema, migrations, seed data, and database notes.

`docker/`

Dockerfiles and supporting container configuration if they are not better placed near each service.

`.github/workflows/`

CI/CD workflows.

`docs/phases/`

Phase summaries, lessons, quizzes, and portfolio talking points.

