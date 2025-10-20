## Getting Started

First, run the backend development server:

```bash
cd backend

cat .env.template > .env
# Set your env variables

python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

python server.py
```

Open [http://localhost:8081/docs](http://localhost:8081/docs) with your browser to see the backend.

Then, run the frontend development server:

```bash
# in a separate terminal
cd frontend

npm i

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the backend.
