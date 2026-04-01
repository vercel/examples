from __future__ import annotations

import time
from typing import Any

from worker.celery import QUEUE_NAME, app
from worker.store import update_job


def _fibonacci_number(n: int) -> int:
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b


@app.task(queue=QUEUE_NAME, name="worker.tasks.calculate_fibonacci")
def calculate_fibonacci(job_id: str, n: int) -> dict[str, Any]:
    target = max(0, int(n))
    try:
        checkpoints = max(4, min(target or 1, 10))
        for i in range(checkpoints):
            update_job(job_id, status="running", progress={
                "step": f"Calculating chunk {i + 1} of {checkpoints}",
                "percent": int((i / checkpoints) * 100),
            })
            time.sleep(0.25)

        result = {"fibonacci": _fibonacci_number(target), "input": target}
        update_job(job_id, status="completed", result=result, progress={"step": "Done", "percent": 100})
        return result
    except Exception as exc:
        update_job(job_id, status="failed", result={"error": str(exc)})
        return {"error": str(exc)}


@app.task(queue=QUEUE_NAME, name="worker.tasks.prime_factorize")
def prime_factorize(job_id: str, number: int) -> dict[str, Any]:
    original = int(number)
    value = abs(original)
    try:
        if value < 2:
            result = {"number": original, "factors": [original], "is_prime": False}
            update_job(job_id, status="completed", result=result, progress={"step": "Done", "percent": 100})
            return result

        remaining = value
        divisor = 2
        factors: list[int] = []
        max_divisor = max(2, int(value**0.5))

        update_job(job_id, status="running", progress={"step": "Scanning factors", "percent": 0})
        while divisor * divisor <= remaining:
            while remaining % divisor == 0:
                factors.append(divisor)
                remaining //= divisor

            if divisor == 2 or divisor % 100 == 0 or divisor * divisor > remaining:
                update_job(job_id, status="running", progress={
                    "step": f"Testing divisor {divisor}",
                    "percent": min(95, int((divisor / max_divisor) * 100)),
                })
                time.sleep(0.02)

            divisor += 1

        if remaining > 1:
            factors.append(remaining)

        result = {"number": original, "factors": factors, "is_prime": len(factors) == 1}
        update_job(job_id, status="completed", result=result, progress={"step": "Done", "percent": 100})
        return result
    except Exception as exc:
        update_job(job_id, status="failed", result={"error": str(exc)})
        return {"error": str(exc)}
