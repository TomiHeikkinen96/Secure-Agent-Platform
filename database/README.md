# Database

The local development database is SQL Server running in Docker Compose. This keeps the local workflow close to Azure SQL without installing SQL Server as a long-running Windows service.

## Local Database Lifecycle

Create a local `.env` first:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` so `MSSQL_SA_PASSWORD` and `MSSQL_PASSWORD` match. SQL Server requires a strong password.

Build the backend image:

```powershell
docker compose build backend
```

Start only the database:

```powershell
docker compose up -d db
```

Create the application database after SQL Server is running:

```powershell
docker compose run --rm backend python -m app.db.create_database
```

Apply schema migrations:

```powershell
docker compose run --rm backend alembic upgrade head
```

Seed development data:

```powershell
docker compose run --rm backend python -m app.seed_dev
```

Start the backend API:

```powershell
docker compose up backend
```

Open Swagger UI:

```text
http://localhost:8000/docs
```

Stop services while keeping data:

```powershell
docker compose down
```

Stop services and delete the local SQL Server volume:

```powershell
docker compose down -v
```

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

Development seed data is created by the backend helper:

```powershell
docker compose run --rm backend python -m app.seed_dev
```

The seed helper refuses to run unless `APP_ENV=development`.
