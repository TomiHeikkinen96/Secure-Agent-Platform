import re

from sqlalchemy import create_engine, text

from app.core.config import settings


def create_database_if_missing() -> None:
    if not re.fullmatch(r"[A-Za-z0-9_]+", settings.mssql_database):
        raise ValueError("Database name may only contain letters, numbers, and underscores.")

    engine = create_engine(
        settings.sqlalchemy_master_url,
        isolation_level="AUTOCOMMIT",
        pool_pre_ping=True,
    )
    with engine.connect() as connection:
        exists = connection.execute(
            text("SELECT name FROM sys.databases WHERE name = :database_name"),
            {"database_name": settings.mssql_database},
        ).scalar_one_or_none()

        if exists:
            print(f"Database already exists: {settings.mssql_database}")
            return

        connection.execute(text(f"CREATE DATABASE [{settings.mssql_database}]"))
        print(f"Created database: {settings.mssql_database}")


if __name__ == "__main__":
    create_database_if_missing()
