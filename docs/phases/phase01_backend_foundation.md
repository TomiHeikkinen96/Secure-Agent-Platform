# Phase 01 - Backend Foundation

## Summary

Build the first FastAPI backend foundation with SQL Server persistence, Docker Compose, SQLAlchemy models, Alembic migrations, and simple community-board routes.

## What Changed

- Added a backend FastAPI service structure.
- Added SQLAlchemy models for users, posts, and comments.
- Added Pydantic schemas and API routers.
- Added Alembic for database schema versioning.
- Added Docker Compose with a SQL Server container and backend container.
- Added a development-only seed script.
- Added database notes for local lifecycle, persistence, and reset behavior.

## Commands I Ran

```powershell
docker compose build backend
docker compose up -d db
docker compose run --rm backend python -m app.db.create_database
docker compose run --rm backend alembic upgrade head
docker compose run --rm backend python -m app.seed_dev
docker compose up backend
docker compose config
git diff --check
```

The backend was verified through the Python 3.12 container rather than relying on a host Python installation.

Swagger UI loaded at `http://localhost:8000/docs`, and manual API checks can be performed through Swagger UI or Postman.

Manual verification completed:

- Docker Compose setup ran locally.
- `.env.example` was copied to `.env` with matching local SQL Server passwords.
- Alembic migrations were applied.
- Development seed data was loaded.
- Swagger UI loaded at `/docs`.
- API routes were exercised through Swagger UI and Postman.

## What I Learned

- Docker Compose services can communicate over a private network using service names such as `db`.
- A SQL Server container stores durable data in a Docker named volume when configured with one.
- Alembic tracks schema history and records the current database revision in the `alembic_version` table.
- Development seed data should be explicitly separated from production behavior.
- A Dockerfile defines how to build one container image, while Docker Compose defines how services run together.

## Good To Know

- Inside Docker Compose, `localhost` means the current container. The backend reaches SQL Server with `db:1433`.
- `docker compose down` stops and removes containers but keeps named volumes.
- `docker compose down -v` removes named volumes and wipes the local database state.
- Likes are better modeled as a future `post_likes` table than as a single integer counter, because the table can prevent duplicate likes and support unlike behavior.
- SQL Server does not create the application database automatically when the container starts; the project includes an explicit helper for that.
- The backend source is organized by responsibility: `core` for settings, `db` for database wiring, `models` for SQLAlchemy tables, `schemas` for API data shapes, and `routers` for endpoint groups.

## Portfolio Talking Points

- The backend uses FastAPI for a typed, documented REST API.
- SQLAlchemy keeps database access explicit while Alembic provides a migration trail.
- Local SQL Server in Docker mirrors the future Azure SQL target without requiring a permanent local database installation.
- The environment model separates development and production configuration.

## Quiz

### Conceptual

1. What problem does FastAPI solve in this project?
2. Why use SQL Server locally instead of SQLite for this learning project?
3. What problem does Alembic solve?
4. Why is seed data useful during development?
5. Why might a `post_likes` table be better than a `likes_count` column?

### Architecture

1. Why does the backend connect to `db:1433` instead of `localhost:1433` inside Docker Compose?
2. What responsibilities belong to the backend service versus the database service?
3. How does Docker Compose keep the backend and database decoupled but still connected?
4. Why should development and production databases be separate?
5. Which Phase 1 pieces are intentionally temporary until Microsoft Entra authentication is added?

### Implementation

1. What is the role of `backend/app/main.py` in a FastAPI application?
2. What belongs in `backend/app/models/` versus `backend/app/schemas/`?
3. Why are routes split into files under `backend/app/routers/`?
4. What does `backend/app/db/session.py` provide to request handlers?
5. What does `backend/app/core/config.py` centralize?
6. What does `seed_dev.py` do, and why should it be safe to run more than once?
7. What does the `alembic_version` database table tell you?
8. Why did `entra_object_id` need a filtered unique index in SQL Server?

### Operations

1. What is the difference between `docker compose build backend` and `docker compose up backend`?
2. What does `docker compose run --rm backend ...` do differently from starting the long-running backend service?
3. What does `backend/Dockerfile` define, and what does `docker-compose.yml` define?
4. Why does the project have both `MSSQL_SA_PASSWORD` and `MSSQL_PASSWORD` while using the `sa` user locally?
5. How would you wipe only the local database state and start fresh?
6. How would you test `POST /posts` manually with Swagger UI or Postman?
7. How would you confirm that a migration has been applied?
