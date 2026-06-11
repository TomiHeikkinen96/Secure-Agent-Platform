from sqlalchemy import select

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User


def seed_development_data() -> None:
    if settings.app_env != "development":
        raise RuntimeError("Refusing to seed data unless APP_ENV=development.")

    with SessionLocal() as db:
        ada = _get_or_create_user(db, "Ada Lovelace", "ada.lovelace@example.com", "admin")
        grace = _get_or_create_user(db, "Grace Hopper", "grace.hopper@example.com", "user")
        db.flush()

        post = db.scalar(select(Post).where(Post.content == "Hello from the first seeded post."))
        if post is None:
            post = Post(author_id=ada.id, content="Hello from the first seeded post.")
            db.add(post)
            db.flush()

        comment = db.scalar(select(Comment).where(Comment.content == "Seed data keeps demos repeatable."))
        if comment is None:
            db.add(Comment(post_id=post.id, author_id=grace.id, content="Seed data keeps demos repeatable."))

        db.commit()
        print("Development seed data is ready.")


def _get_or_create_user(db, display_name: str, email: str, role: str) -> User:
    user = db.scalar(select(User).where(User.email == email))
    if user is not None:
        return user

    user = User(display_name=display_name, email=email, role=role)
    db.add(user)
    return user


if __name__ == "__main__":
    seed_development_data()
