# Database

The local development database is SQL Server running in Docker Compose. This keeps the local workflow close to Azure SQL without installing SQL Server as a long-running Windows service.

## Local Database Lifecycle

Use the root README for the standard local start, stop, and reset workflow. The launcher is the supported path because it creates the database, applies migrations, loads seed data, and starts the frontend/backend stack consistently.

The persistent local database files are stored in the Docker named volume `sqlserver-data`, mounted to `/var/opt/mssql` inside the SQL Server container.

## Schema Versioning

Schema changes are tracked with Alembic migrations in `backend/alembic/versions/`.

Alembic stores the current schema revision in the database table `alembic_version`.

## Docker Compose and Backend Dockerfile

`docker-compose.yml` describes the local application environment:

- Which services exist, such as `db` and `backend`.
- Which ports are exposed to the host machine.
- Which environment file is loaded.
- Which volumes persist data.
- Which services can talk to each other on the Compose network.

`backend/Dockerfile` describes how to build the backend image:

- Which Python base image to use.
- Which operating-system packages are installed.
- Which Python dependencies are installed.
- Which application files are copied into the image.
- Which default command starts the API.

Good rule of thumb:

- Dockerfile builds one image.
- Docker Compose runs multiple services together.

## Development Seed Data

Development seed data is created by `backend/app/seed_dev.py`. The launcher runs it automatically, and the helper refuses to run unless `APP_ENV=development`.
