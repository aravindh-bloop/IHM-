from fastapi import APIRouter
from ihm_backend.web.api.stall.schema import ItemRequest


router = APIRouter()

@router.post("/request")
async def handle_request(
    item_data: ItemRequest
    ):
    print(item_data)
    response = {"message": "Items received", "items": item_data.items}
    return response
