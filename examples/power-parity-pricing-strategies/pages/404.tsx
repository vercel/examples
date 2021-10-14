import Link from "next/link"

function NotFoundPage(): JSX.Element {
  
  return (
    <section className="border border-gray-300 bg-white rounded-lg shadow-lg w-full max-w-[480px] hover:shadow-2xl p-4 mt-8">
      <p>This product is not available in your region.</p>
      <p>
        You can check the <span className="underline"><Link href="/static">static</Link></span> version.
      </p>
    </section>
  );
}

export default NotFoundPage;
