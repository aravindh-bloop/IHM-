import uuid
from datetime import date, datetime, timedelta
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from ihm_backend.db.dependencies import get_db_session
from ihm_backend.db.models.users import User, UserRole, VendorCategory
from ihm_backend.db.models.raw_material import RawMaterialRequests
from ihm_backend.db.models.orders import Orders
from ihm_backend.db.models.compiled_orders import CompiledOrders
from ihm_backend.db.models.stall import Stall
from ihm_backend.db.models.inventory import Inventory
from ihm_backend.web.api.admin.schema import (
    HodSubmittedResponse, HodSubmittedItem, AdminEditItemRequest,
    InventoryItem, InventoryUpsertRequest, CompileRequest, CompileOrderResponse,
    CompiledOrderDetail, OrderDetail,
    BillsResponse, BillBucket, BillConstituent
)
from ihm_backend.web.dependencies.auth import require_role

router = APIRouter()

VENDOR_CATEGORIES = ["seafood", "vegetables_fruits", "general_provisions"]


# ── INVENTORY ────────────────────────────────────────────────────────────────

@router.get("/inventory", response_model=List[InventoryItem])
async def get_inventory(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    result = await db.execute(select(Inventory).order_by(Inventory.item_name))
    return result.scalars().all()


@router.post("/inventory", response_model=InventoryItem)
async def upsert_inventory(
    data: InventoryUpsertRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Add or update an inventory item (matched by item_name, case-insensitive)."""
    if data.vendor_category not in VENDOR_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"vendor_category must be one of {VENDOR_CATEGORIES}")

    result = await db.execute(
        select(Inventory).where(Inventory.item_name.ilike(data.item_name))
    )
    item = result.scalar_one_or_none()

    if item:
        item.quantity = data.quantity
        item.unit = data.unit
        item.vendor_category = data.vendor_category
    else:
        item = Inventory(
            item_name=data.item_name, quantity=data.quantity,
            unit=data.unit, vendor_category=data.vendor_category
        )
        db.add(item)

    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/inventory/{item_id}")
async def delete_inventory(
    item_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    result = await db.execute(select(Inventory).where(Inventory.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    await db.delete(item)
    await db.commit()
    return {"message": "Deleted", "id": str(item_id)}


# ── ORDERS ────────────────────────────────────────────────────────────────────

@router.get("/orders/pending", response_model=HodSubmittedResponse)
async def get_hod_submitted_orders(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Admin sees HOD-submitted requests with auto-deducted inventory quantities."""
    result = await db.execute(
        select(RawMaterialRequests, Stall)
        .join(Stall, RawMaterialRequests.stall_id == Stall.id)
        .where(RawMaterialRequests.status == "hod_submitted")
        .order_by(RawMaterialRequests.required_date.asc(), RawMaterialRequests.created_at.desc())
    )
    rows = result.all()

    # Load full inventory into a dict for fast lookup
    inv_result = await db.execute(select(Inventory))
    inventory_map = {}
    category_map = {}
    for inv in inv_result.scalars():
        inventory_map[inv.item_name.lower()] = float(inv.quantity)
        category_map[inv.item_name.lower()] = inv.vendor_category

    items = []
    for req, stall in rows:
        hod_qty = req.hod_quantity or req.quantity
        in_stock = inventory_map.get(req.item_name.lower(), 0.0)
        net_required = max(0.0, hod_qty - in_stock)
        vendor_cat = category_map.get(req.item_name.lower(), "general_provisions")

        items.append(HodSubmittedItem(
            id=req.id, stall_id=req.stall_id, stall_name=stall.stall_name,
            kitchen=stall.kitchen.value, item_name=req.item_name,
            chef_quantity=req.quantity, hod_quantity=hod_qty,
            in_stock=in_stock, net_required=net_required,
            final_quantity=req.approved_quantity,
            unit=req.unit, vendor_category=vendor_cat,
            required_date=req.required_date,
            created_at=req.created_at, status=req.status
        ))

    return {"message": "HOD-submitted requests retrieved", "total_items": len(items), "items": items}


@router.patch("/orders/request/{request_id}")
async def admin_edit_request(
    request_id: uuid.UUID,
    edit_data: AdminEditItemRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Admin manually overrides final quantity or vendor category for an item."""
    result = await db.execute(select(RawMaterialRequests).where(RawMaterialRequests.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "hod_submitted":
        raise HTTPException(status_code=400, detail="Only HOD-submitted requests can be edited here")

    if edit_data.final_quantity is not None:
        req.approved_quantity = edit_data.final_quantity
    if edit_data.item_name is not None:
        req.item_name = edit_data.item_name
    if edit_data.unit is not None:
        req.unit = edit_data.unit

    # Persist vendor_category override into inventory if item exists, else create
    if edit_data.vendor_category is not None:
        inv_result = await db.execute(
            select(Inventory).where(Inventory.item_name.ilike(req.item_name))
        )
        inv = inv_result.scalar_one_or_none()
        if inv:
            inv.vendor_category = edit_data.vendor_category
        else:
            db.add(Inventory(
                item_name=req.item_name, quantity=0,
                unit=req.unit, vendor_category=edit_data.vendor_category
            ))

    await db.commit()
    await db.refresh(req)
    return {"message": "Updated", "id": str(req.id)}


@router.post("/orders/compile", response_model=CompileOrderResponse)
async def compile_and_send_to_vendors(
    body: CompileRequest | None = None,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """
    Compile HOD-submitted items into per-(vendor, required_date) orders.
    If body.required_date is set, only items for that date are compiled
    (so admin can approve one day at a time against live inventory).
    Otherwise, all dates are compiled in one shot (sequential mode).
    Items with net_required == 0 (fully covered by inventory) are skipped.
    """
    target_date = body.required_date if body else None

    query = (
        select(RawMaterialRequests, Stall)
        .join(Stall, RawMaterialRequests.stall_id == Stall.id)
        .where(RawMaterialRequests.status == "hod_submitted")
    )
    if target_date is not None:
        query = query.where(RawMaterialRequests.required_date == target_date)

    result = await db.execute(query)
    rows = result.all()
    if not rows:
        msg = (
            f"No HOD-submitted requests for {target_date}"
            if target_date else "No HOD-submitted requests to compile"
        )
        raise HTTPException(status_code=400, detail=msg)

    # Load inventory
    inv_result = await db.execute(select(Inventory))
    inventory_map = {}
    category_map = {}
    for inv in inv_result.scalars():
        inventory_map[inv.item_name.lower()] = float(inv.quantity)
        category_map[inv.item_name.lower()] = inv.vendor_category

    # Load all vendor accounts indexed by category
    vendor_result = await db.execute(
        select(User).where(User.role == UserRole.VENDOR)
    )
    vendors = vendor_result.scalars().all()
    vendor_by_category = {v.vendor_category: v for v in vendors if v.vendor_category}

    # Bucket items by (required_date, vendor_category)
    buckets: dict[tuple, list] = {}

    for req, stall in rows:
        hod_qty = req.hod_quantity or req.quantity
        in_stock = inventory_map.get(req.item_name.lower(), 0.0)
        if req.approved_quantity is not None:
            final_qty = req.approved_quantity
        else:
            final_qty = max(0, hod_qty - in_stock)

        if final_qty <= 0:
            req.status = "admin_rejected"
            continue

        vendor_cat = category_map.get(req.item_name.lower(), "general_provisions")
        key = (req.required_date, vendor_cat)
        buckets.setdefault(key, []).append({
            "req": req,
            "item_name": req.item_name,
            "final_qty": int(final_qty),
            "unit": req.unit,
        })

    compiled_summaries = []
    for (req_date, cat), items in buckets.items():
        vendor = vendor_by_category.get(cat)
        if not vendor:
            raise HTTPException(
                status_code=400,
                detail=f"No vendor account found for category '{cat}'. Please create one first."
            )

        compiled_order = CompiledOrders(
            vendor_id=vendor.id,
            vendor_category=cat,
            required_date=req_date,
            status="pending",
            total_items=len(items)
        )
        db.add(compiled_order)
        await db.flush()

        for it in items:
            order = Orders(
                compiled_order_id=compiled_order.id,
                item_name=it["item_name"],
                total_quantity=it["final_qty"],
                unit=it["unit"]
            )
            db.add(order)
            it["req"].status = "admin_compiled"

        compiled_summaries.append({
            "compiled_order_id": str(compiled_order.id),
            "vendor_category": cat,
            "vendor_email": vendor.email,
            "required_date": req_date.isoformat() if req_date else None,
            "total_items": len(items),
            "items": [{"item_name": i["item_name"], "quantity": i["final_qty"], "unit": i["unit"]} for i in items]
        })

    # Deduct compiled quantities from inventory
    for req, stall in rows:
        if req.status == "admin_compiled":
            inv_result2 = await db.execute(
                select(Inventory).where(Inventory.item_name.ilike(req.item_name))
            )
            inv = inv_result2.scalar_one_or_none()
            if inv:
                hod_qty = req.hod_quantity or req.quantity
                in_stock = float(inv.quantity)
                deduct = min(in_stock, hod_qty)
                inv.quantity = max(0, in_stock - deduct)

    await db.commit()
    return {"message": "Orders compiled and sent to vendors", "compiled_orders": compiled_summaries}


@router.get("/orders/compiled", response_model=List[CompiledOrderDetail])
async def get_compiled_orders(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    result = await db.execute(
        select(CompiledOrders).order_by(
            CompiledOrders.required_date.desc().nullslast(),
            CompiledOrders.created_at.desc(),
        )
    )
    compiled_orders = result.scalars().all()

    # Build a vendor_id -> email map in one query
    vendor_ids = {co.vendor_id for co in compiled_orders if co.vendor_id}
    vendor_email_map = {}
    if vendor_ids:
        vres = await db.execute(select(User).where(User.id.in_(vendor_ids)))
        vendor_email_map = {v.id: v.email for v in vres.scalars()}

    out = []
    for co in compiled_orders:
        orders_res = await db.execute(select(Orders).where(Orders.compiled_order_id == co.id))
        orders = orders_res.scalars().all()
        out.append(CompiledOrderDetail(
            id=str(co.id), created_at=co.created_at,
            vendor_id=str(co.vendor_id) if co.vendor_id else None,
            vendor_email=vendor_email_map.get(co.vendor_id),
            vendor_category=co.vendor_category,
            required_date=co.required_date,
            status=co.status, total_items=co.total_items,
            total_price=float(co.total_price) if co.total_price else None,
            invoice_number=co.invoice_number,
            delivered_at=co.delivered_at,
            items=[
                OrderDetail(
                    order_id=str(o.id), item_name=o.item_name,
                    total_quantity=o.total_quantity, delivered_quantity=o.delivered_quantity,
                    unit=o.unit,
                    unit_price=float(o.unit_price) if o.unit_price else None,
                    total_price=float(o.total_price) if o.total_price else None
                ) for o in orders
            ]
        ))
    return out


# ── BILLS (aggregated by daily / weekly / monthly) ───────────────────────────

CATEGORY_PREFIX = {
    "seafood": "SEA",
    "vegetables_fruits": "VEG",
    "general_provisions": "GEN",
}


def _week_bounds(d: date) -> tuple[date, date, str, str]:
    """Return (monday, sunday, iso_year_week_key, label) for the ISO week containing d."""
    monday = d - timedelta(days=d.weekday())
    sunday = monday + timedelta(days=6)
    iso_year, iso_week, _ = monday.isocalendar()
    key = f"{iso_year}-W{iso_week:02d}"
    label = f"Week {iso_week} · {monday.strftime('%d %b')} – {sunday.strftime('%d %b %Y')}"
    return monday, sunday, key, label


def _month_bounds(d: date) -> tuple[date, date, str, str]:
    first = d.replace(day=1)
    if first.month == 12:
        next_first = first.replace(year=first.year + 1, month=1)
    else:
        next_first = first.replace(month=first.month + 1)
    last = next_first - timedelta(days=1)
    key = f"{first.year}-{first.month:02d}"
    label = first.strftime("%B %Y")
    return first, last, key, label


@router.get("/bills", response_model=BillsResponse)
async def get_bills(
    view: str = Query("daily", pattern="^(daily|weekly|monthly)$"),
    vendor_category: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
):
    """
    Aggregate delivered compiled-orders into daily / weekly / monthly bills,
    grouped per vendor category. Daily buckets map 1:1 to a real invoice;
    weekly/monthly buckets compute a roll-up invoice ref (WK-…, MTH-…).
    """
    query = (
        select(CompiledOrders)
        .where(CompiledOrders.status == "delivered")
        .order_by(CompiledOrders.delivered_at.asc())
    )
    if vendor_category:
        query = query.where(CompiledOrders.vendor_category == vendor_category)
    if start_date is not None:
        query = query.where(CompiledOrders.delivered_at >= datetime.combine(start_date, datetime.min.time()))
    if end_date is not None:
        # inclusive end-of-day
        query = query.where(CompiledOrders.delivered_at < datetime.combine(end_date + timedelta(days=1), datetime.min.time()))

    result = await db.execute(query)
    orders = result.scalars().all()

    # Vendor email lookup
    vendor_ids = {o.vendor_id for o in orders if o.vendor_id}
    vendor_email_map: dict = {}
    if vendor_ids:
        vres = await db.execute(select(User).where(User.id.in_(vendor_ids)))
        vendor_email_map = {v.id: v.email for v in vres.scalars()}

    # Group key: depends on view; always partition by vendor_category
    buckets: dict[tuple, dict] = defaultdict(lambda: {
        "period_start": None, "period_end": None, "label": "",
        "invoice_ref": "", "constituents": [],
        "total_price": 0.0, "total_items": 0,
    })

    for o in orders:
        if not o.delivered_at:
            continue
        delivered_day = o.delivered_at.date()
        cat = o.vendor_category or "general_provisions"
        cat_prefix = CATEGORY_PREFIX.get(cat, "GEN")

        if view == "daily":
            key = delivered_day.isoformat()
            label = delivered_day.strftime("%a, %d %b %Y")
            period_start = period_end = delivered_day
            # Use the order's own invoice; one bill = one order at daily view
            invoice_ref = o.invoice_number or f"INV-{delivered_day.strftime('%Y%m%d')}-{cat_prefix}"
        elif view == "weekly":
            monday, sunday, wkey, label = _week_bounds(delivered_day)
            key = wkey
            period_start, period_end = monday, sunday
            iso_year, iso_week, _ = monday.isocalendar()
            invoice_ref = f"WK-{iso_year}{iso_week:02d}-{cat_prefix}"
        else:  # monthly
            first, last, mkey, label = _month_bounds(delivered_day)
            key = mkey
            period_start, period_end = first, last
            invoice_ref = f"MTH-{first.year}{first.month:02d}-{cat_prefix}"

        bucket_key = (key, cat)
        b = buckets[bucket_key]
        b["period_start"] = period_start
        b["period_end"] = period_end
        b["label"] = label
        b["invoice_ref"] = invoice_ref
        b["vendor_email"] = vendor_email_map.get(o.vendor_id)
        b["vendor_category"] = cat
        b["bucket_key"] = key
        b["total_price"] += float(o.total_price or 0)
        b["total_items"] += int(o.total_items or 0)
        b["constituents"].append(BillConstituent(
            compiled_order_id=str(o.id),
            invoice_number=o.invoice_number,
            delivered_at=o.delivered_at,
            required_date=o.required_date,
            total_price=float(o.total_price or 0),
            total_items=int(o.total_items or 0),
        ))

    # Sort: most recent period first, then category
    out_buckets = sorted(
        buckets.values(),
        key=lambda b: (b["period_start"], b["vendor_category"]),
        reverse=True,
    )

    return BillsResponse(
        view=view,
        start_date=start_date,
        end_date=end_date,
        buckets=[
            BillBucket(
                bucket_key=b["bucket_key"],
                bucket_label=b["label"],
                period_start=b["period_start"],
                period_end=b["period_end"],
                vendor_category=b["vendor_category"],
                vendor_email=b.get("vendor_email"),
                invoice_ref=b["invoice_ref"],
                total_price=round(b["total_price"], 2),
                total_orders=len(b["constituents"]),
                total_items=b["total_items"],
                constituents=b["constituents"],
            )
            for b in out_buckets
        ],
    )
