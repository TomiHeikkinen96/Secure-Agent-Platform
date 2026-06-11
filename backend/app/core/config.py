from functools import cached_property
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: Literal["development", "test", "production"] = "development"
    project_name: str = "Azure AI Community Board API"

    database_url: str | None = None
    mssql_host: str = "db"
    mssql_port: int = 1433
    mssql_database: str = "community_board_dev"
    mssql_user: str = "sa"
    mssql_password: str = "local-dev-password-not-set"
    mssql_driver: str = "ODBC Driver 18 for SQL Server"
    mssql_trust_server_certificate: bool = True

    @cached_property
    def sqlalchemy_database_url(self) -> str:
        if self.database_url:
            return self.database_url
        return self._build_mssql_url(self.mssql_database)

    @cached_property
    def sqlalchemy_master_url(self) -> str:
        return self._build_mssql_url("master")

    def _build_mssql_url(self, database: str) -> str:
        trust_value = "yes" if self.mssql_trust_server_certificate else "no"
        url = URL.create(
            "mssql+pyodbc",
            username=self.mssql_user,
            password=self.mssql_password,
            host=self.mssql_host,
            port=self.mssql_port,
            database=database,
            query={
                "driver": self.mssql_driver,
                "TrustServerCertificate": trust_value,
            },
        )
        return url.render_as_string(hide_password=False)


settings = Settings()
