from fastapi import FastAPI

from app.core.config import settings
from app.routers import comments, health, metadata, posts, users

app = FastAPI(title=settings.project_name)

app.include_router(health.router)
app.include_router(metadata.router)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(comments.router)
