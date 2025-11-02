import Link from "next/link";

export default function ErrorComponent({
  error,
  title,
}: {
  error: Error & { digest?: string };
  title: string;
}) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <h1 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        {title}
      </h1>
      <p className="text-red-600 dark:text-red-300">{error.message}</p>
      <Link
        href="/"
        className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
