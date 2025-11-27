"""add_approved_quantity.

Revision ID: add_approved_quantity
Revises: add_kitchen_to_stall
Create Date: 2025-11-27 18:12:00.000000

"""

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "add_approved_quantity"
down_revision = "add_kitchen_to_stall"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Run the migration."""
    # Add approved_quantity field to raw_material_requests table
    op.add_column('raw_material_requests', sa.Column('approved_quantity', sa.Integer(), nullable=True))


def downgrade() -> None:
    """Undo the migration."""
    # Remove approved_quantity field from raw_material_requests table
    op.drop_column('raw_material_requests', 'approved_quantity')
