export async function GET(request, { params }) {
  const { path } = await params;
  const search = request.nextUrl.search;
  const url = `${process.env.BACKEND_URL}${path ? path.join("/") : ""}${search}`;
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
