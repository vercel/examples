import { NextResponse } from "next/server";

const FASTAPI_DIRECT_URL = process.env.FASTAPI_DIRECT_URL;

export async function GET() {
  if (!FASTAPI_DIRECT_URL) {
    return NextResponse.json(
      { error: "FASTAPI_DIRECT_URL is not set" },
      { status: 500 }
    );
  }

  const res = await fetch(`${FASTAPI_DIRECT_URL}/status`, {
    cache: "no-store",
  });

  const body = await res.text();

  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
