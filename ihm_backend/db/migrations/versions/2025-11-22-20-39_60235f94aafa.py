"""add_price_fields_to_orders.

Revision ID: 60235f94aafa
Revises: 167332d2af21
Create Date: 2025-11-22 20:39:06.387149

"""

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "60235f94aafa"
down_revision = "167332d2af21"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Run the migration."""
    # Add price fields to orders table
    op.add_column('orders', sa.Column('unit_price', sa.Numeric(10, 2), nullable=True))
    op.add_column('orders', sa.Column('total_price', sa.Numeric(10, 2), nullable=True))
    
    # Add total_price field to compiled_orders table
    op.add_column('compiled_orders', sa.Column('total_price', sa.Numeric(10, 2), nullable=True))


def downgrade() -> None:
    """Undo the migration."""
    # Remove price fields from orders table
    op.drop_column('orders', 'total_price')
    op.drop_column('orders', 'unit_price')
    
    # Remove total_price from compiled_orders table
    op.drop_column('compiled_orders', 'total_price')
