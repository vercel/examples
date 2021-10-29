import { NextResponse as Response } from "next/server";

export default function middleware(req) {
  if (req.nextUrl.pathname === "/") {
    return Response.rewrite("/news/1");
  }
}
