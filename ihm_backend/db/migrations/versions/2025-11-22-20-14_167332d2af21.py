"""add_kitchen_field_for_stall_owners.

Revision ID: 167332d2af21
Revises: 2193b601f757
Create Date: 2025-11-22 20:14:53.972161

"""

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "167332d2af21"
down_revision = "2193b601f757"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Run the migration."""
    # Create Kitchen enum type
    op.execute("CREATE TYPE kitchen AS ENUM ('ATK', 'BTK', 'QTK', 'CRAFT')")
    
    # Add kitchen column to user table
    op.add_column('user', sa.Column('kitchen', sa.Enum('ATK', 'BTK', 'QTK', 'CRAFT', name='kitchen'), nullable=True))


def downgrade() -> None:
    """Undo the migration."""
    # Remove kitchen column from user table
    op.drop_column('user', 'kitchen')
    
    # Drop Kitchen enum type
    op.execute("DROP TYPE kitchen")
