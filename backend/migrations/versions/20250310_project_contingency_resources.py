"""Add project contingency and resources table; ensure predecessors support

Revision ID: 20250310_project_contingency_resources
Revises: 20250101_sync_models
Create Date: 2025-03-10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20250310_project_contingency_resources"
down_revision: Union[str, Sequence[str], None] = "20250101_sync_models"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # Add contingency to projects if missing
    project_cols = {col["name"] for col in inspector.get_columns("projects")}
    if "contingency" not in project_cols:
        op.add_column("projects", sa.Column("contingency", sa.Float(), server_default="0"))

    # Add resources table if missing
    if "resources" not in inspector.get_table_names():
        op.create_table(
            "resources",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("name", sa.String(), nullable=False),
            sa.Column("cost_per_day", sa.Float(), server_default="0"),
            sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False, index=True),
        )


def downgrade() -> None:
    op.drop_table("resources")
    op.drop_column("projects", "contingency")
