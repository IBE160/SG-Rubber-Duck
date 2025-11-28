"""Initial migration: create Project, Task, Risk, SimulationRun, EventLog tables

Revision ID: 001_initial
Revises: 
Create Date: 2025-11-28 17:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create project table
    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('budget', sa.Float(), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_projects_name'), 'projects', ['name'], unique=False)

    # Create task table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('text', sa.String(), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('duration', sa.Integer(), nullable=True),
        sa.Column('progress', sa.Float(), nullable=True),
        sa.Column('cost', sa.Float(), nullable=True),
        sa.Column('dependencies', sa.JSON(), nullable=True),
        sa.Column('parent', sa.Integer(), nullable=True),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tasks_text'), 'tasks', ['text'], unique=False)

    # Create risk table
    op.create_table(
        'risks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('probability', sa.Float(), nullable=True),
        sa.Column('impact', sa.String(), nullable=True),
        sa.Column('duration_impact', sa.Integer(), nullable=True),
        sa.Column('cost_impact', sa.Float(), nullable=True),
        sa.Column('affected_task_ids', sa.JSON(), nullable=True),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_risks_description'), 'risks', ['description'], unique=False)

    # Create simulation_run table
    op.create_table(
        'simulation_runs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('seed', sa.Integer(), nullable=True),
        sa.Column('total_duration', sa.Integer(), nullable=True),
        sa.Column('total_cost', sa.Float(), nullable=True),
        sa.Column('critical_path', sa.JSON(), nullable=True),
        sa.Column('results', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create event_log table
    op.create_table(
        'event_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('simulation_run_id', sa.Integer(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.Column('event_type', sa.String(), nullable=True),
        sa.Column('task_id', sa.Integer(), nullable=True),
        sa.Column('risk_id', sa.Integer(), nullable=True),
        sa.Column('details', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['simulation_run_id'], ['simulation_runs.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_event_logs_event_type'), 'event_logs', ['event_type'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_event_logs_event_type'), table_name='event_logs')
    op.drop_table('event_logs')
    op.drop_table('simulation_runs')
    op.drop_index(op.f('ix_risks_description'), table_name='risks')
    op.drop_table('risks')
    op.drop_index(op.f('ix_tasks_text'), table_name='tasks')
    op.drop_table('tasks')
    op.drop_index(op.f('ix_projects_name'), table_name='projects')
    op.drop_table('projects')
