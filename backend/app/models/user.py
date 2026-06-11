from sqlalchemy import DateTime, Index, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    role: Mapped[str] = mapped_column(String(32), nullable=False, default="user")
    entra_object_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.sysutcdatetime())
    updated_at = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.sysutcdatetime(),
        onupdate=func.sysutcdatetime(),
    )

    posts = relationship("Post", back_populates="author")
    comments = relationship("Comment", back_populates="author")


Index(
    "ix_users_entra_object_id",
    User.entra_object_id,
    unique=True,
    mssql_where=User.entra_object_id.is_not(None),
)
