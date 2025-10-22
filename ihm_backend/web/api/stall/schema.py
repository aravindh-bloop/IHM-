from typing import List, Optional

from pydantic import BaseModel


class Item(BaseModel):
    item_name: str
    quantity: int


class ItemRequest(BaseModel):
    items: List[Item]


class ItemUpdate(BaseModel):
    item_name: Optional[str] = None
    quantity: Optional[int] = None


class RawMaterialRequestResponse(BaseModel):
    message: str
    stall_id: str
    stall_name: str
    requests: List[dict]
