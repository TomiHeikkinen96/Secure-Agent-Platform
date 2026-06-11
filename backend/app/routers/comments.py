from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentRead

router = APIRouter(prefix="/comments", tags=["comments"])


@router.get("", response_model=list[CommentRead])
def list_comments(
    post_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Comment]:
    query = select(Comment).order_by(Comment.created_at.asc())
    if post_id is not None:
        query = query.where(Comment.post_id == post_id)
    return list(db.scalars(query))


@router.post("", response_model=CommentRead, status_code=status.HTTP_201_CREATED)
def create_comment(payload: CommentCreate, db: Session = Depends(get_db)) -> Comment:
    post = db.get(Post, payload.post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found.")

    author = db.get(User, payload.author_id)
    if author is None:
        raise HTTPException(status_code=404, detail="Author not found.")

    comment = Comment(
        post_id=payload.post_id,
        author_id=payload.author_id,
        content=payload.content,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment
