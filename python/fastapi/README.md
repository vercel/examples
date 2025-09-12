[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Ffastapi)

# FastAPI + Vercel

Use FastAPI on Vercel with Serverless Functions using the Python Runtime.

## How it Works

- The ASGI app is exported as `app` in `main.py` and serves `/`:

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
```

- Vercel builds and routes all requests to `main.py` with `@vercel/python`:

```json
// vercel.json
{
  "builds": [{ "src": "main.py", "use": "@vercel/python" }],
  "routes": [{ "src": "/(.*)", "dest": "main.py" }]
}
```

## Running Locally

```bash
uvicorn main:app --reload
# or
python main.py
```

App available at `http://localhost:8000`.

## One-Click Deploy

Deploy with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Ffastapi)


