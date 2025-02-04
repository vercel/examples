import { createClient } from "redis";

export default eventHandler(async () => {
	const redis = await createClient({
		url: process.env.REDIS_URL ?? process.env.KV_URL,
	}).connect();
	const views = await redis.incr("views");

	return {
		pageVisits: views,
	};
});
