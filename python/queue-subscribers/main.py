from typing import Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from vercel.cache import AsyncRuntimeCache

from worker import queue

app = FastAPI()
cache = AsyncRuntimeCache(namespace="queue-subscribers")

INDEX_HTML = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Queue Calculator</title>
  <style>
    :root {
      color-scheme: dark;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      background: #09090b;
      color: #fafafa;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background:
        radial-gradient(circle at top, #27272a 0, transparent 42%),
        #09090b;
    }
    main { width: min(100%, 680px); }
    header { margin-bottom: 24px; }
    h1 { margin: 0 0 8px; font-size: clamp(2rem, 7vw, 3.5rem); letter-spacing: -0.05em; }
    header p { margin: 0; color: #a1a1aa; }
    .grid { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .card {
      padding: 20px;
      border: 1px solid #27272a;
      border-radius: 16px;
      background: rgb(24 24 27 / 78%);
      box-shadow: 0 18px 50px rgb(0 0 0 / 30%);
    }
    .wide { grid-column: 1 / -1; }
    h2 { margin: 0 0 16px; font-size: 1rem; }
    label { display: block; margin: 0 0 6px; color: #d4d4d8; font-size: 0.875rem; }
    input, select, button {
      width: 100%;
      min-height: 44px;
      border-radius: 9px;
      font: inherit;
    }
    input, select {
      border: 1px solid #3f3f46;
      padding: 10px 12px;
      background: #18181b;
      color: #fafafa;
    }
    input:focus, select:focus, button:focus-visible {
      outline: 2px solid #a78bfa;
      outline-offset: 2px;
    }
    .field { margin-bottom: 14px; }
    .operands { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    button {
      border: 0;
      padding: 10px 16px;
      background: #8b5cf6;
      color: white;
      font-weight: 650;
      cursor: pointer;
    }
    button:hover { background: #7c3aed; }
    button:disabled { cursor: wait; opacity: 0.65; }
    .check-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
    .check-row button { width: auto; }
    .status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .badge {
      padding: 5px 9px;
      border-radius: 999px;
      background: #27272a;
      color: #d4d4d8;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    output { display: block; margin-top: 16px; color: #a1a1aa; overflow-wrap: anywhere; }
    .answer { color: #fafafa; font-size: 2.25rem; font-weight: 700; letter-spacing: -0.04em; }
    @media (max-width: 560px) {
      .grid { grid-template-columns: 1fr; }
      .wide { grid-column: auto; }
      .operands, .check-row { grid-template-columns: 1fr; }
      .check-row button { width: 100%; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Queue calculator</h1>
      <p>Enqueue arithmetic work and read its cached result.</p>
    </header>

    <div class="grid">
      <form id="enqueue-form" class="card" aria-labelledby="enqueue-title">
        <h2 id="enqueue-title">New task</h2>
        <div class="field">
          <label for="operation">Operation</label>
          <select id="operation">
            <option value="add">Add</option>
            <option value="multiply">Multiply</option>
          </select>
        </div>
        <div class="operands">
          <div class="field">
            <label for="left">Left operand</label>
            <input id="left" type="number" step="any" value="2" required>
          </div>
          <div class="field">
            <label for="right">Right operand</label>
            <input id="right" type="number" step="any" value="3" required>
          </div>
        </div>
        <button id="enqueue-button" type="submit">Enqueue task</button>
      </form>

      <section class="card" aria-labelledby="result-title">
        <div class="status">
          <h2 id="result-title">Result</h2>
          <span id="status" class="badge" role="status">Idle</span>
        </div>
        <div id="answer" class="answer">—</div>
        <output id="details">Submit a task to begin.</output>
      </section>

      <form id="check-form" class="card wide" aria-labelledby="check-title">
        <h2 id="check-title">Check a task</h2>
        <label for="task-id">Task ID</label>
        <div class="check-row">
          <input id="task-id" type="text" placeholder="Paste a task ID" required>
          <button type="submit">Check result</button>
        </div>
      </form>
    </div>
  </main>

  <script>
    const enqueueForm = document.querySelector("#enqueue-form");
    const checkForm = document.querySelector("#check-form");
    const enqueueButton = document.querySelector("#enqueue-button");
    const taskIdInput = document.querySelector("#task-id");
    const statusBadge = document.querySelector("#status");
    const answer = document.querySelector("#answer");
    const details = document.querySelector("#details");
    let pollTimer;

    function renderStatus(status, detail, result = "—") {
      statusBadge.textContent = status;
      details.textContent = detail;
      answer.textContent = String(result);
    }

    async function checkTask({ poll = false } = {}) {
      const taskId = taskIdInput.value.trim();
      if (!taskId) return;

      clearTimeout(pollTimer);
      renderStatus("Checking", `Looking up ${taskId}`);

      try {
        const response = await fetch(`/tasks/${encodeURIComponent(taskId)}`);
        if (response.status === 404) {
          renderStatus("Not found", "No cached task exists with that ID.");
          return;
        }
        if (!response.ok) throw new Error(`Request failed (${response.status})`);

        const task = await response.json();
        if (task.status === "completed") {
          renderStatus("Completed", `${task.operation} task · ${task.task_id}`, task.result);
          return;
        }

        renderStatus("Pending", `${task.operation} task · ${task.task_id}`);
        if (poll) pollTimer = setTimeout(() => checkTask({ poll: true }), 1000);
      } catch (error) {
        renderStatus("Error", error.message);
      }
    }

    enqueueForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearTimeout(pollTimer);
      enqueueButton.disabled = true;
      renderStatus("Enqueuing", "Sending task to Vercel Queues.");

      try {
        const operation = document.querySelector("#operation").value;
        const response = await fetch(`/tasks/${operation}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            left: Number(document.querySelector("#left").value),
            right: Number(document.querySelector("#right").value),
          }),
        });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);

        const task = await response.json();
        taskIdInput.value = task.task_id;
        renderStatus("Pending", `Queued task ${task.task_id}`);
        pollTimer = setTimeout(() => checkTask({ poll: true }), 750);
      } catch (error) {
        renderStatus("Error", error.message);
      } finally {
        enqueueButton.disabled = false;
      }
    });

    checkForm.addEventListener("submit", (event) => {
      event.preventDefault();
      checkTask();
    });
  </script>
</body>
</html>
"""


class Operands(BaseModel):
    left: int | float
    right: int | float


@app.get("/", response_class=HTMLResponse)
async def index() -> HTMLResponse:
    return HTMLResponse(INDEX_HTML)


async def create_task(
    operation: Literal["add", "multiply"],
    operands: Operands,
) -> dict[str, str | None]:
    task_id = str(uuid4())
    await cache.set(
        task_id,
        {
            "task_id": task_id,
            "operation": operation,
            "status": "pending",
        },
        {"ttl": 3600, "tags": ["queue-task-results"]},
    )
    try:
        result = await queue.send(
            operation,
            {
                "task_id": task_id,
                "left": operands.left,
                "right": operands.right,
            },
        )
    except Exception:
        await cache.delete(task_id)
        raise
    return {"task_id": task_id, "message_id": result["messageId"]}


@app.post("/tasks/add", status_code=202)
async def enqueue_add(operands: Operands) -> dict[str, str | None]:
    return await create_task("add", operands)


@app.post("/tasks/multiply", status_code=202)
async def enqueue_multiply(operands: Operands) -> dict[str, str | None]:
    return await create_task("multiply", operands)


@app.get("/tasks/{task_id}")
async def get_task(task_id: str) -> dict[str, object]:
    result = await cache.get(task_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return result
