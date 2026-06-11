# Phase 00 - Agentic Workflow Setup

## Summary

Started the project as a learning-first public portfolio repository. The main output of this phase is not application code yet. It is the workflow that future agents should follow while helping build the Azure AI Community Board.

## What Changed

- Added repository-level agent instructions.
- Added public-facing project README.
- Added workflow, architecture, and repository structure notes.
- Added a reusable phase documentation template.
- Added a starter `.gitignore` for public-repository safety.

## Commands I Ran

```powershell
# Documentation-only phase. No app initialization commands yet.
```

## What I Learned

- The project should start with plain React and Vite before considering Next.js.
- Local infrastructure should use Docker so services can be started and stopped deliberately.
- SQL Server in Docker is a good local stepping stone toward Azure SQL.
- CI/CD should be introduced gradually once there is code to verify.
- Phase documentation can double as learning material and portfolio evidence.

## Good To Know

- A public repository can include learning notes if they are framed professionally.
- "Portfolio Talking Points" is a better public heading than private interview notes.
- `main` can represent stable work and future deployment triggers, while `develop` can hold active learning work.
- Future agents should avoid doing setup invisibly. The setup itself is part of the learning.

## Portfolio Talking Points

- The repository is intentionally structured around incremental delivery and explainability.
- The workflow shows awareness of CI/CD, cloud cost, secret management, and scope control before application code begins.
- The project values human-in-the-loop AI coding instead of fully opaque automation.

## Quiz

1. Why start with plain React and Vite before considering Next.js?
2. Why use SQL Server in Docker instead of installing a local database service?
3. What is the purpose of keeping `main` and `develop` separate?
4. Why should Azure cost and cleanup be discussed before creating resources?
5. What should happen at the end of each phase?

## My Answers

1. Pending.
2. Pending.
3. Pending.
4. Pending.
5. Pending.

## Follow-up Tasks

- Initialize git if the repository is not already a git repository.
- Create `main` and `develop` branches.
- Start Phase 01 with backend foundation or adjust numbering if Phase 0 will also include local tooling checks.
- Add CI once there is code or documentation validation worth automating.
