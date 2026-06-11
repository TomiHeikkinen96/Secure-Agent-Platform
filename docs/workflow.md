# Learning Workflow

This project is built in phases. Each phase should be small enough to understand, run, review, document, and commit.

## Human-in-the-Loop Setup

When a phase needs setup commands, the agent should:

1. Explain why the command is needed.
2. Show the exact command.
3. Ask the user to run it locally.
4. Review the output if needed.
5. Continue with code edits and verification.

This is especially important for:

- Node and React initialization
- Python environment setup
- Docker Compose
- Azure CLI commands
- GitHub Actions and deployment setup

## Branch Strategy

Use:

- `main` for stable work and future deployment triggers.
- `develop` for active integration and learning.

Suggested flow:

1. Work on `develop`.
2. Finish a phase.
3. Run checks.
4. Write or update the phase document.
5. Commit with a clear phase-oriented message.
6. Merge to `main` when the phase is stable.
7. Tag important milestones.

Suggested tags:

- `phase-00-agentic-workflow`
- `phase-01-backend-foundation`
- `phase-02-react-frontend`

## Commit Guidance

At the end of a phase, the agent should suggest a commit message.

Example:

```text
docs: establish learning-first project workflow
```

If a phase produces a working milestone, consider a tag:

```text
phase-00-agentic-workflow
```

## CI/CD Path

Add CI/CD gradually:

1. Documentation-only checks when the repository is mostly docs.
2. Backend tests and linting when FastAPI exists.
3. Frontend build and tests when React exists.
4. Docker Compose validation when compose files exist.
5. Deployment from `main` after local and Azure resource setup are understood.

The goal is not only automation. The goal is to understand what each automated check protects.

## Public Learning Notes

Phase documents should be written in a public-friendly way. Good:

- "What I learned"
- "Good to know"
- "Portfolio talking points"
- "Quiz"

Avoid making notes sound like private interview coaching or pretending that future knowledge has already been mastered.

