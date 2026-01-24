// Force dynamic rendering so the sleep happens on each request
export const dynamic = "force-dynamic";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function SlowPage() {
  // Sleep for 60 seconds - this will trigger a timeout since maxDuration is 3s
  await sleep(60000);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24 bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Slow Page
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          If you see this, the page did not timeout (waited 60 seconds).
        </p>
      </div>
    </div>
  );
}
