"""Shared billing helpers (invoice numbering)."""
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ihm_backend.db.models.compiled_orders import CompiledOrders

CATEGORY_PREFIX = {
    "seafood": "SEA",
    "vegetables_fruits": "VEG",
    "general_provisions": "GEN",
}


async def generate_invoice_number(db: AsyncSession, category: str | None) -> str:
    """INV-YYYYMMDD-CAT-NNN, where NNN is the count of today's invoices for that category + 1."""
    prefix = CATEGORY_PREFIX.get(category or "", "GEN")
    today = datetime.utcnow().strftime("%Y%m%d")
    base = f"INV-{today}-{prefix}-"
    result = await db.execute(
        select(func.count()).select_from(CompiledOrders).where(
            CompiledOrders.invoice_number.like(f"{base}%")
        )
    )
    count = result.scalar() or 0
    return f"{base}{count + 1:03d}"
