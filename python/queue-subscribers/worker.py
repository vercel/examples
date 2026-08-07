from vercel.workers import AsyncQueueClient

import tasks

queue = AsyncQueueClient()

__all__ = ["queue", "tasks"]
