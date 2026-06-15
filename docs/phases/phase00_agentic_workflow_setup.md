# Phase 00 - Agentic Workflow Setup

## Summary

Started the project as a learning-first public portfolio repository. The main output of this phase is not application code yet. It is the workflow that future agents should follow while helping build the Azure AI Community Board.

## What Changed

- Added repository-level agent instructions.
- Added public-facing project README.
- Added workflow, architecture, and repository structure notes.
- Added a Phase 00 setup guide with git and toolchain steps.
- Added a reusable phase documentation template.
- Added a starter `.gitignore` for public-repository safety.

## Commands I Ran

```powershell
git --version
node --version
npm.cmd --version
python --version
docker --version
az --version
```

## What I Learned

- The project should start with plain React and Vite before considering Next.js.
- Local infrastructure should use Docker so services can be started and stopped deliberately.
- SQL Server in Docker is a good local stepping stone toward Azure SQL.
- Containers can be the reproducible project baseline while local tools remain useful for learning and official init commands.
- CI/CD should be introduced gradually once there is code to verify.
- Phase documentation can double as learning material and portfolio evidence.

## Good To Know

- A public repository can include learning notes if they are framed professionally.
- "Portfolio Talking Points" is a better public heading than private interview notes.
- Future agents should avoid doing setup invisibly. The setup itself is part of the learning.
- On Windows PowerShell, `npm.cmd` may work even when `npm` is blocked by script execution policy.
- Node `v22.20.0` is acceptable for this project because it is on an LTS line.
- Python `3.10.6` can remain installed locally, but the project should target Python 3.12+ or a newer backend container baseline.
- Docker was available and `docker run hello-world` passed during setup verification.
- Azure CLI is not required for the first local phases. Azure Cloud Shell can provide browser-based Azure CLI access for early Azure exploration.
- Containers help isolate and reproduce development environments, but mounted files and dependency scripts still need normal security caution.

## Portfolio Talking Points

- The repository is intentionally structured around incremental delivery and explainability.
- The workflow shows awareness of CI/CD, cloud cost, secret management, and scope control before application code begins.
- The project values human-in-the-loop AI coding instead of fully opaque automation.

## Quiz

1. Why start with plain React and Vite before considering Next.js?
2. Why use SQL Server in Docker instead of installing a local database service?
3. Why should a project choose a simple branch workflow before adding CI/CD complexity?
4. Why should Azure cost and cleanup be discussed before creating resources?
5. What should happen at the end of each phase?
