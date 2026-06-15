# Local Scripts

## PowerShell Variants

Start without opening browser tabs:

```powershell
.\scripts\start-dev.ps1 -NoBrowser
```

Follow frontend/backend logs in the launcher window:

```powershell
.\scripts\start-dev.ps1 -FollowLogs
```

Run checks and then start the app in one PowerShell session:

```powershell
.\scripts\start-dev.ps1 -RunChecks
```

Run checks only:

```powershell
.\scripts\start-dev.ps1 -ChecksOnly
```

## Local State

Local state is stored in Docker named volumes:

- `sqlserver-data`: SQL Server database files, including posts and comments.
- `frontend-node-modules`: frontend npm dependencies installed inside the container.

Normal shutdown removes containers and the network, but keeps those volumes.

Use `dev-clean.cmd` to delete the local volumes. Use `dev-fresh.cmd` for a clean review run that deletes volumes, runs checks, and starts from seeded data.

The reset path runs `docker compose down -v --remove-orphans` from this repository. Docker Compose scopes containers, networks, and volumes to the Compose project, so this does not delete unrelated Docker containers or databases from other projects.

The practical caveat is project-name collision: Docker Compose derives the default project name from the folder name. Avoid running two unrelated clones from folders with the same name if you need their Docker state to stay separate.
