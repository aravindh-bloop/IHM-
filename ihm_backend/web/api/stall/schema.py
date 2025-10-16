from typing import List

from pydantic import BaseModel


class Item(BaseModel):
    name: str
    qty: int
    id: int


class ItemRequest(BaseModel):
    items: List[Item]
