import { NextResponse } from "next/server";

const FASTAPI_DIRECT_URL = process.env.FASTAPI_DIRECT_URL;

export async function GET() {
  if (!FASTAPI_DIRECT_URL) {
    return NextResponse.json(
      { error: "FASTAPI_DIRECT_URL is not set" },
      { status: 500 }
    );
  }

  let res;
  try {
    res = await fetch(`${FASTAPI_DIRECT_URL}/status`, { cache: "no-store" });
  } catch (err) {
    console.error("[direct-fastapi] fetch failed", { url: FASTAPI_DIRECT_URL, error: err.message });
    return NextResponse.json({ error: err.message }, { status: 502 });
  }

  const body = await res.text();

  if (!res.ok) {
    console.error("[direct-fastapi] upstream error", { status: res.status, url: FASTAPI_DIRECT_URL });
  }

  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
