from pydantic import BaseModel
from typing import List

class Item(BaseModel):
    name: str
    qty: int
    id: int
class ItemRequest(BaseModel):
    items : List[Item]
