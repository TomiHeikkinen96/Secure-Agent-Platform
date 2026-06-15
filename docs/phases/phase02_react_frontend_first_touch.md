# Phase 02 - React Frontend First Touch

## Summary

Start the frontend phase by creating a React application with Vite, using Docker as the Node.js runtime so the setup is reproducible and visible.

This phase started with the official scaffold flow, then replaced the starter screen with a read-only API explorer for the existing FastAPI community-board backend. The goal is to understand what files a React app needs, what npm does, how Docker can run frontend tooling, and how Vite can proxy browser requests to the backend during local development.

## What Changed

- Initialized `frontend/` with the official Vite React template.
- Added a `frontend` service to `docker-compose.yml` for running the Vite development server in Docker.
- Added a Vite `/api` proxy that forwards frontend requests to the FastAPI backend.
- Replaced the Vite starter content with a read-only community-board dashboard that shows backend status, metadata, users, posts, and inline comments.
- Added `frontend/src/api/client.js` as the first small frontend API layer.
- Added `start-dev.cmd` and `scripts/start-dev.ps1` as the standard local stack launcher.
- Added `scripts/reset-local-data.ps1` for explicit local Docker volume cleanup.
- Made host ports configurable through `.env` while keeping container ports fixed.
- Removed starter React/Vite images and the host `frontend/node_modules/` folder.
- Recorded the local Docker tooling check before scaffolding the frontend.

## Commands I Ran

```powershell
docker --version
docker compose version
```

Observed local output on 2026-06-14:

```text
Docker version 29.5.3, build d1c06ef
Docker Compose version v5.1.4
```

Frontend scaffold command:

```powershell
docker run --rm -it -v ${PWD}:/work -w /work node:22-bookworm npm create vite@latest frontend -- --template react
```

Verification commands:

```powershell
.\start-dev.cmd
docker compose config --services
docker compose run --rm --no-deps frontend sh -c "npm install && npm run lint && npm run build"
```

## What I Learned

- React is the UI library; Vite is the development server, project scaffold, and production build tool around it.
- `npm create vite@latest` downloads and runs the Vite project generator.
- A bind mount like `./:/work` lets a container write generated files into the repository on the host machine.
- Docker can run frontend tooling while writing generated files back into the repository through a bind mount.
- Vite must listen on `0.0.0.0` inside a container so the host machine can reach it through the published port.
- React's `useEffect` is the first place this app performs side effects: fetching data after the component renders.
- React's `useMemo` is useful for derived lookup structures such as users-by-id and comments-by-post-id.
- A Vite proxy lets browser code call `/api/posts` while the dev server forwards the request to FastAPI.
- A small script can make the repeatable workflow easy while still keeping the Docker commands readable.
- On Windows, a `.cmd` wrapper that stays active during `Ctrl+C` can show `Terminate batch job (Y/N)?`. The launcher avoids that by opening a PowerShell window for the long-running workflow.
- Log following is useful for debugging, but a ready screen is better as the default human-facing launcher state.

## Good To Know

- The Docker image version is the project baseline for this setup step: `node:22-bookworm`.
- The observed Docker Desktop versions are local machine facts, not strict project requirements.
- Containers reduce host-machine dependency drift, but mounted files are still real repository files. A container command can create or modify files in the mounted folder.
- Vite's development server is not the final production web server. It is optimized for local development and hot reload.
- `node_modules/` is generated dependency content. It can contain many files and should not be committed.
- The `frontend-node-modules` Docker volume keeps container-installed dependencies out of the source bind mount during normal Compose runs.
- The browser runs the React JavaScript. Docker runs the Vite development server that serves and rebuilds that JavaScript.
- The Vite proxy is a local development convenience. Production deployment will need an explicit frontend-to-backend routing plan.
- The frontend can render gracefully when the API has no users, posts, or comments.
- If SQL Server is running but the app database has not been created, the frontend can load while API-backed sections show an error state.
- `docker compose down` stops and removes containers and the network, but keeps named volumes.
- `docker compose down -v` also deletes named volumes, including local SQL Server data.
- Host port values are local developer settings; container ports are part of the Compose service contract.

## Portfolio Talking Points

- The frontend was initialized through the official Vite React scaffold flow.
- Docker was used to provide a reproducible Node.js runtime without requiring a specific host Node installation.
- Docker Compose was used to make the setup command inspectable and repeatable.
- The local development server is containerized while still supporting hot reload through a bind-mounted source directory.
- The first frontend integration calls real FastAPI endpoints through a local Vite proxy instead of using hardcoded mock data.
- The UI handles loading, empty, error, and populated states.

## Quiz

### Conceptual

1. What problem does React solve compared with writing plain HTML and JavaScript?
2. What problem does Vite solve around React development?
3. Why might a project use Docker for frontend tooling even when the final site is just static HTML, CSS, and JavaScript?
4. Why is `node_modules/` not committed while `package-lock.json` is committed?

### Architecture

1. What is the difference between source files in `frontend/src/` and production build output in `frontend/dist/`?
2. Why does the React app eventually need to call the FastAPI backend through HTTP instead of importing backend code directly?
3. Where does the browser run React code: inside the Docker container, on the backend server, or in the user's browser?
4. What does the Vite proxy do when the browser calls `/api/users`?
5. Why does the frontend need loading, empty, and error states even for a small app?

### Implementation

1. What does the `-v ${PWD}:/work` bind mount do in the scaffold command?
2. What does `-w /work` change inside the container?
3. Why does the Vite command include `frontend` as an argument?
4. What responsibility does `frontend/src/api/client.js` have?
5. Why does `App.jsx` build `usersById` and `commentsByPostId` before rendering posts?

### Operations

1. What does `start-dev.cmd` automate?
2. What does `--rm` change about the lifecycle of the one-off container?
3. Why did the first Vite server not open on `localhost` from the host machine?
4. How would you verify that the scaffold command generated files in the expected folder?
5. Why did the API explorer show a backend error before the local database was created and migrated?
6. Which command confirms that the frontend production build succeeds?
7. What is the difference between `start-dev.cmd` and `scripts/reset-local-data.ps1`?
