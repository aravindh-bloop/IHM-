"""add_unit_field_to_orders.

Revision ID: 83f95d39aa1d
Revises: 60235f94aafa
Create Date: 2025-11-22 20:57:45.718816

"""

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "83f95d39aa1d"
down_revision = "60235f94aafa"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Run the migration."""
    # Add unit field to orders table
    op.add_column('orders', sa.Column('unit', sa.String(), nullable=True))


def downgrade() -> None:
    """Undo the migration."""
    # Remove unit field from orders table
    op.drop_column('orders', 'unit')
