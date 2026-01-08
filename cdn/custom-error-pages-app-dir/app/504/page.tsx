export default function GatewayTimeout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">504</h1>
      <p className="mt-4 text-lg text-gray-600">Gateway Timeout</p>
      <p className="mt-2 text-sm text-gray-500">
        The server took too long to respond. Please try again later.
      </p>
      <a href="/" className="mt-6 text-blue-600 hover:underline">
        Go back home
      </a>
    </div>
  );
}
