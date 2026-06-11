"""filter entra object id unique index

Revision ID: 20260611_0002
Revises: 20260611_0001
Create Date: 2026-06-11
"""

from collections.abc import Sequence

from alembic import op

revision: str = "20260611_0002"
down_revision: str | None = "20260611_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_index("ix_users_entra_object_id", table_name="users")
    op.create_index(
        "ix_users_entra_object_id",
        "users",
        ["entra_object_id"],
        unique=True,
        mssql_where="entra_object_id IS NOT NULL",
    )


def downgrade() -> None:
    op.drop_index("ix_users_entra_object_id", table_name="users")
    op.create_index("ix_users_entra_object_id", "users", ["entra_object_id"], unique=True)
