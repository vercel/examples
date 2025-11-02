from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel


class Item(BaseModel):
    id: int
    name: str
    price: float
    description: str | None = None


router = APIRouter()

# Sample, read-only data suitable for stateless/serverless deployments
SAMPLE_ITEMS: list[Item] = [
    Item(id=1, name="Widget", price=9.99, description="A simple widget"),
    Item(id=2, name="Gadget", price=19.99, description="A useful gadget"),
    Item(id=3, name="Doohickey", price=4.50),
]


@router.get("/", response_model=list[Item])
def list_items(q: str | None = Query(default=None)) -> list[Item]:
    items = SAMPLE_ITEMS
    if q:
        query = q.lower()
        return [i for i in items if query in i.name.lower()]
    return items


@router.get("/{item_id}", response_model=Item)
def get_item(item_id: int) -> Item:
    for item in SAMPLE_ITEMS:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")
