from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException


app = FastAPI(
    title="Next.js + FastAPI Services Demo",
    description="Minimal backend service mounted under /svc/api on Vercel Services",
    version="1.0.0"
)

SAMPLE_ITEMS = [
    {"id": 1, "name": "Service Item 1", "value": 100},
    {"id": 2, "name": "Service Item 2", "value": 200},
    {"id": 3, "name": "Service Item 3", "value": 300},
]


@app.get("/")
def read_root():
    return {
        "message": "FastAPI service is running",
        "mountedAt": "/svc/api",
        "docs": "/svc/api/docs",
    }


@app.get("/status")
def get_status():
    return {
        "service": "backend",
        "framework": "fastapi",
        "mountedAt": "/svc/api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/items")
def get_items():
    return {
        "items": SAMPLE_ITEMS,
        "count": len(SAMPLE_ITEMS),
    }


@app.get("/items/{item_id}")
def get_item(item_id: int):
    item = next((value for value in SAMPLE_ITEMS if value["id"] == item_id), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    return {"item": item}
