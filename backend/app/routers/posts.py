from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostRead

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("", response_model=list[PostRead])
def list_posts(db: Session = Depends(get_db)) -> list[Post]:
    return list(db.scalars(select(Post).order_by(Post.created_at.desc())))


@router.post("", response_model=PostRead, status_code=status.HTTP_201_CREATED)
def create_post(payload: PostCreate, db: Session = Depends(get_db)) -> Post:
    author = db.get(User, payload.author_id)
    if author is None:
        raise HTTPException(status_code=404, detail="Author not found.")

    post = Post(author_id=payload.author_id, content=payload.content)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post
