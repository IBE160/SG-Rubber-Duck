"""Sync schema with current models (Task cost/dependencies, Risk impacts)

Revision ID: 20250101_sync_models
Revises: 001_initial
Create Date: 2025-12-02
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20250101_sync_models"
down_revision: Union[str, Sequence[str], None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Bring DB schema in line with SQLAlchemy models, add only if missing."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    task_cols = {col["name"] for col in inspector.get_columns("tasks")}
    risk_cols = {col["name"] for col in inspector.get_columns("risks")}

    with op.batch_alter_table("tasks") as batch_op:
        if "cost" not in task_cols:
            batch_op.add_column(sa.Column("cost", sa.Float(), server_default="0"))
        if "dependencies" not in task_cols:
            batch_op.add_column(sa.Column("dependencies", sa.JSON(), server_default="[]"))

    with op.batch_alter_table("risks") as batch_op:
        if "duration_impact" not in risk_cols:
            batch_op.add_column(sa.Column("duration_impact", sa.Integer(), server_default="0"))
        if "cost_impact" not in risk_cols:
            batch_op.add_column(sa.Column("cost_impact", sa.Float(), server_default="0"))
        if "affected_task_ids" not in risk_cols:
            batch_op.add_column(sa.Column("affected_task_ids", sa.JSON(), server_default="[]"))


def downgrade() -> None:
    """Revert schema changes."""
    with op.batch_alter_table("risks") as batch_op:
        batch_op.drop_column("affected_task_ids")
        batch_op.drop_column("cost_impact")
        batch_op.drop_column("duration_impact")

    with op.batch_alter_table("tasks") as batch_op:
        batch_op.drop_column("dependencies")
        batch_op.drop_column("cost")
