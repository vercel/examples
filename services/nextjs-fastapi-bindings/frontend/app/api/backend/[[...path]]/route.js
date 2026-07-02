export async function GET(request, { params }) {
  const { path } = await params;
  const url = new URL(path ? path.join("/") : "", process.env.BACKEND_URL);
  url.search = request.nextUrl.search
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
