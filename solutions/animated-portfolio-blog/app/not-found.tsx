import Link from "next/link";

export default function NotFound() {
  return (
    // position: fixed inset-0 anchors the content to the viewport, so the
    // heading + copy + link sit at the visual center of the visible area
    // (not the center of the area above the footer, which is what `flex-1`
    // inside <main> would give — that sits slightly above the viewport
    // center on desktop). The footer is still in the normal flow at the
    // bottom of the body and stays visible (no scroll needed).
    <section className="fixed inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">404 - Page Not Found</h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <Link href="/" className="link-underline">
        ← Back home
      </Link>
    </section>
  );
}
