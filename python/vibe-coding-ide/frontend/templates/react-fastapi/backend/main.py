from fastapi import FastAPI
from routes import api_router

app = FastAPI(title="Demo API")

@app.get("/")
def root():
    return {"message": "Hello from FastAPI"}

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
