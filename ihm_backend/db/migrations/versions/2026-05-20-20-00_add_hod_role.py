"""add hod role and hod approval statuses.

Revision ID: add_hod_role
Revises: add_approved_quantity
Branch labels: None
Depends on: None

"""

import sqlalchemy as sa
from alembic import op

revision = "add_hod_role"
down_revision = "add_approved_quantity"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add 'HOD' value to the userrole enum (DB stores uppercase names)
    op.execute("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'HOD'")


def downgrade() -> None:
    # PostgreSQL does not support removing enum values directly;
    # a full recreation would be needed — skip for dev purposes
    pass
