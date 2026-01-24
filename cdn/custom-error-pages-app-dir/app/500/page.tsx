export default function ServerError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">500</h1>
      <p className="mt-4 text-lg text-gray-600">Internal Server Error</p>
      <p className="mt-2 text-sm text-gray-500">
        Something went wrong on our end. Please try again later.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Request ID: ::vercel:REQUEST_ID::
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Error: ::vercel:ERROR_CODE::
      </p>
      <a href="/" className="mt-6 text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded">
        Go back home
      </a>
    </div>
  );
}
