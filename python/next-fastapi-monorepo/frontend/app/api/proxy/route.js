import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL;

  const res = await fetch(`${backendUrl}/status`, { cache: "no-store" });
  const data = await res.json();

  return NextResponse.json({
    source: "Next.js API route (/api/proxy)",
    backend: data,
  });
}
