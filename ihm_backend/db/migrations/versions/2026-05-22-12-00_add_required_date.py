"""add required_date to raw_material_requests and compiled_orders, add draft status.

Revision ID: add_required_date
Revises: big_overhaul
Branch labels: None
Depends on: None

"""

import sqlalchemy as sa
from alembic import op

revision = "add_required_date"
down_revision = "big_overhaul"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. raw_material_requests.required_date
    op.add_column(
        "raw_material_requests",
        sa.Column("required_date", sa.Date(), nullable=True),
    )
    # Backfill existing rows with tomorrow's date so the NOT NULL constraint passes
    op.execute(
        "UPDATE raw_material_requests "
        "SET required_date = CURRENT_DATE + INTERVAL '1 day' "
        "WHERE required_date IS NULL"
    )
    op.alter_column("raw_material_requests", "required_date", nullable=False)

    # 2. compiled_orders.required_date (nullable — historic compiled orders had no date)
    op.add_column(
        "compiled_orders",
        sa.Column("required_date", sa.Date(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("compiled_orders", "required_date")
    op.drop_column("raw_material_requests", "required_date")
