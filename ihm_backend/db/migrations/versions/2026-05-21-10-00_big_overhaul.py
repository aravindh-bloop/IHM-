"""big overhaul: vendor_category, hod_quantity, inventory table.

Revision ID: big_overhaul
Revises: add_hod_role
Branch labels: None
Depends on: None

"""

import sqlalchemy as sa
from alembic import op

revision = "big_overhaul"
down_revision = "add_hod_role"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Add VendorCategory enum type
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE vendorcategory AS ENUM (
                'seafood', 'vegetables_fruits', 'general_provisions'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    """)

    # 2. Add vendor_category column to user table (stored as plain string)
    op.add_column(
        "user",
        sa.Column("vendor_category", sa.String(), nullable=True)
    )

    # 3. Add hod_quantity to raw_material_requests
    op.add_column(
        "raw_material_requests",
        sa.Column("hod_quantity", sa.Integer(), nullable=True)
    )

    # 4. Add vendor_category to compiled_orders
    op.add_column(
        "compiled_orders",
        sa.Column("vendor_category", sa.String(), nullable=True)
    )

    # 5. Create inventory table
    op.create_table(
        "inventory",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("item_name", sa.String(), nullable=False),
        sa.Column("quantity", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("unit", sa.String(), nullable=False),
        sa.Column("vendor_category", sa.String(), nullable=False, server_default="general_provisions"),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )
    op.create_index("ix_inventory_item_name", "inventory", ["item_name"])


def downgrade() -> None:
    op.drop_index("ix_inventory_item_name", "inventory")
    op.drop_table("inventory")
    op.drop_column("compiled_orders", "vendor_category")
    op.drop_column("raw_material_requests", "hod_quantity")
    op.drop_column("user", "vendor_category")
    sa.Enum(name="vendorcategory").drop(op.get_bind(), checkfirst=True)
