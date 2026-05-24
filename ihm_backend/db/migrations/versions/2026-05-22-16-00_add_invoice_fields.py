"""add invoice_number and delivered_at to compiled_orders.

Revision ID: add_invoice_fields
Revises: add_required_date
Branch labels: None
Depends on: None

"""

import sqlalchemy as sa
from alembic import op

revision = "add_invoice_fields"
down_revision = "add_required_date"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "compiled_orders",
        sa.Column("invoice_number", sa.String(), nullable=True),
    )
    op.add_column(
        "compiled_orders",
        sa.Column("delivered_at", sa.DateTime(), nullable=True),
    )
    op.create_unique_constraint(
        "uq_compiled_orders_invoice_number",
        "compiled_orders",
        ["invoice_number"],
    )
    # Backfill: existing 'completed' rows get delivered_at = created_at, status -> 'delivered'
    op.execute(
        "UPDATE compiled_orders SET delivered_at = created_at WHERE status = 'completed'"
    )
    op.execute("UPDATE compiled_orders SET status = 'delivered' WHERE status = 'completed'")


def downgrade() -> None:
    op.execute("UPDATE compiled_orders SET status = 'completed' WHERE status = 'delivered'")
    op.drop_constraint("uq_compiled_orders_invoice_number", "compiled_orders", type_="unique")
    op.drop_column("compiled_orders", "delivered_at")
    op.drop_column("compiled_orders", "invoice_number")
