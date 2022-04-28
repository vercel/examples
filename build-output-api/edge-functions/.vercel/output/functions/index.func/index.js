export default function middleware(request, event) {
  return new Response(`Hello, from the Edge!`)
}
