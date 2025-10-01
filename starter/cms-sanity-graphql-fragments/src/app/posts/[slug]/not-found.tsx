import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The post you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </>
  );
}
