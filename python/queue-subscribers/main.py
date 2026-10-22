import logging
from typing import Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from vercel.queue import send

from store import result_store

logger = logging.getLogger("queue-subscribers")
logger.setLevel(logging.INFO)

app = FastAPI()

INDEX_HTML = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Queue Calculator</title>
  <style>
    :root {
      font-family: Arial, Helvetica, sans-serif;
      background: #fff;
      color: #000;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: #fff;
    }
    main {
      width: min(100%, 720px);
      margin: 0 auto;
      padding: 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      border-top: 1px solid #eaeaea;
      border-left: 1px solid #eaeaea;
    }
    .card {
      padding: 24px;
      border-right: 1px solid #eaeaea;
      border-bottom: 1px solid #eaeaea;
      background: #fff;
    }
    .wide { grid-column: 1 / -1; }
    h2 {
      margin: 0 0 20px;
      font-size: 14px;
      font-weight: 600;
    }
    label {
      display: block;
      margin: 0 0 7px;
      color: #444;
      font-size: 13px;
    }
    input, select, button {
      width: 100%;
      min-height: 40px;
      border-radius: 6px;
      font: inherit;
    }
    input, select {
      border: 1px solid #e1e1e1;
      padding: 8px 10px;
      background: #fff;
      color: #000;
      font-size: 14px;
    }
    input:focus, select:focus, button:focus-visible {
      outline: 2px solid #000;
      outline-offset: 2px;
    }
    .field { margin-bottom: 16px; }
    .operands {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    button {
      border: 1px solid #000;
      padding: 8px 14px;
      background: #000;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    button:hover { background: #333; }
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
      padding: 4px 8px;
      border: 1px solid #eaeaea;
      border-radius: 999px;
      background: #fafafa;
      color: #666;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    output {
      display: block;
      margin-top: 18px;
      color: #666;
      font-size: 13px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
    .answer {
      min-height: 58px;
      color: #000;
      font-size: 42px;
      font-weight: 600;
      letter-spacing: -0.05em;
    }
    @media (max-width: 560px) {
      main { padding: 16px; }
      .grid { grid-template-columns: 1fr; }
      .wide { grid-column: auto; }
      .operands, .check-row { grid-template-columns: 1fr; }
      .check-row button { width: 100%; }
    }
  </style>
</head>
<body>
  <main>
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
    logger.info("Creating task task_id=%s operation=%s", task_id, operation)
    await result_store.set(
        task_id,
        {
            "task_id": task_id,
            "operation": operation,
            "status": "pending",
        },
    )
    try:
        message_id = await send(
            operation,
            {
                "task_id": task_id,
                "left": operands.left,
                "right": operands.right,
            },
        )
    except Exception:
        logger.exception(
            "Failed to enqueue task task_id=%s operation=%s",
            task_id,
            operation,
        )
        try:
            await result_store.delete(task_id)
        except Exception:
            logger.exception(
                "Failed to clean up pending task task_id=%s operation=%s",
                task_id,
                operation,
            )
        raise
    logger.info(
        "Task enqueued task_id=%s operation=%s message_id=%s",
        task_id,
        operation,
        message_id,
    )
    return {"task_id": task_id, "message_id": message_id}


@app.post("/tasks/add", status_code=202)
async def enqueue_add(operands: Operands) -> dict[str, str | None]:
    return await create_task("add", operands)


@app.post("/tasks/multiply", status_code=202)
async def enqueue_multiply(operands: Operands) -> dict[str, str | None]:
    return await create_task("multiply", operands)


@app.get("/tasks/{task_id}")
async def get_task(task_id: str) -> dict[str, object]:
    result = await result_store.get(task_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return result
