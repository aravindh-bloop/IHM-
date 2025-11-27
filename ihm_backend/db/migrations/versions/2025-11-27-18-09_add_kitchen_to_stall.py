"""add_kitchen_to_stall.

Revision ID: add_kitchen_to_stall
Revises: 83f95d39aa1d
Create Date: 2025-11-27 18:09:00.000000

"""

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "add_kitchen_to_stall"
down_revision = "83f95d39aa1d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Run the migration."""
    # Create enum type for Kitchen if it doesn't exist
    kitchen_enum = sa.Enum('ATK', 'BTK', 'QTK', 'CRAFT', name='kitchen')
    kitchen_enum.create(op.get_bind(), checkfirst=True)
    
    # Add kitchen field to stall table
    op.add_column('stall', sa.Column('kitchen', kitchen_enum, nullable=True))
    
    # Update existing stalls - set kitchen based on stall_name
    # BTK -> BTK, ATK -> ATK, QTK -> QTK, CRAFT -> CRAFT
    op.execute("""
        UPDATE stall 
        SET kitchen = CASE 
            WHEN stall_name = 'BTK' THEN 'BTK'::kitchen
            WHEN stall_name = 'ATK' THEN 'ATK'::kitchen
            WHEN stall_name = 'QTK' THEN 'QTK'::kitchen
            WHEN stall_name = 'CRAFT' THEN 'CRAFT'::kitchen
            ELSE 'BTK'::kitchen
        END
        WHERE kitchen IS NULL
    """)
    
    # Make kitchen non-nullable
    op.alter_column('stall', 'kitchen', nullable=False)


def downgrade() -> None:
    """Undo the migration."""
    # Remove kitchen field from stall table
    op.drop_column('stall', 'kitchen')
    
    # Drop enum type
    sa.Enum(name='kitchen').drop(op.get_bind(), checkfirst=True)
