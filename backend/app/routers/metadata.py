from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db

router = APIRouter(prefix="/metadata", tags=["metadata"])


@router.get("")
def read_metadata(db: Session = Depends(get_db)) -> dict[str, str | None]:
    try:
        schema_version = db.execute(text("SELECT TOP 1 version_num FROM alembic_version")).scalar_one_or_none()
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=503, detail="Database metadata is not available.") from exc

    return {
        "app_env": settings.app_env,
        "database": settings.mssql_database,
        "schema_version": schema_version,
    }
