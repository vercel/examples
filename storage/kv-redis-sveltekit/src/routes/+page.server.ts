import { REDIS_URL, KV_URL } from "$env/static/private";
import { createClient } from "redis";

/** @type {import('./$types').PageLoad} */
export async function load() {
	const kv = await createClient({
		url: REDIS_URL ?? KV_URL,
	}).connect();
	const pageVisits = await kv.get("pageVisits");
	await kv.set("pageVisits", Number.parseInt(pageVisits ?? "0", 10) + 1);
	const updatedPageVisits = await kv.get("pageVisits");

	return {
		pageVisits: updatedPageVisits,
	};
}
