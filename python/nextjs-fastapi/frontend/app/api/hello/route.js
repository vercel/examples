import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "frontend",
    framework: "nextjs",
    message: "Hello from Next.js API route",
    timestamp: new Date().toISOString(),
  });
}
