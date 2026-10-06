from typing import Any

from vercel.queue import Message, subscribe

from store import result_store


async def complete_task(
    message: Message[dict[str, Any]],
    consumer: str,
) -> None:
    task_id = str(message.payload["taskId"])
    await result_store.set(
        f"task:{task_id}:completion:{consumer}",
        {
            "result": {
                "messageId": message.message_id,
                "deliveryCount": message.metadata.delivery_count,
                "received": message.payload,
            },
        },
    )


@subscribe(topic="demo-next-to-python")
async def receive_from_next(message: Message[dict[str, Any]]) -> None:
    await complete_task(message, "python")
    print(
        "[python consumer] received from Next.js",
        {
            "payload": message.payload,
            "message_id": message.message_id,
            "delivery_count": message.metadata.delivery_count,
            "topic": message.metadata.topic,
        },
    )


@subscribe(topic="demo-fanout")
async def receive_fanout(message: Message[dict[str, Any]]) -> None:
    await complete_task(message, "python")
    print(
        "[python fanout consumer] received a copy",
        {
            "payload": message.payload,
            "message_id": message.message_id,
            "consumer_group": message.metadata.consumer_group,
            "delivery_count": message.metadata.delivery_count,
        },
    )
