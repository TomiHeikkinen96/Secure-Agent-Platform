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

See [README.md](../README.md) for the active branch and current local commands.

Default flow:

1. Work on the active branch named in the README.
2. Finish a phase.
3. Run checks.
4. Write or update the phase document.
5. Commit with a clear phase-oriented message.
6. Tag important milestones when useful.

Tag format:

```text
phase-XX-short-description
```

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
5. Deployment from the configured deployment branch after local and Azure resource setup are understood.

The goal is not only automation. The goal is to understand what each automated check protects.

## Public Learning Notes

Phase documents should be written in a public-friendly way. Good:

- "What I learned"
- "Good to know"
- "Portfolio talking points"
- "Quiz"

Avoid making notes sound like private interview coaching or pretending that future knowledge has already been mastered.

Quiz answers can stay in chat while practicing. Commit answer sections only when they are intentionally polished as public study notes.
