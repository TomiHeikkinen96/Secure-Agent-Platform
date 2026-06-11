from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    content: Mapped[str] = mapped_column(String(2000), nullable=False)
    created_at = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.sysutcdatetime())
    updated_at = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.sysutcdatetime(),
        onupdate=func.sysutcdatetime(),
    )

    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
