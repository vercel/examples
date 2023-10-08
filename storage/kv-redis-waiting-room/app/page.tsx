export default function Home() {
  return (
    <div className="w-full py-16 mx-auto">
      <div className="container mx-auto max-w-xl px-4">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            {`You're in.`}
          </h1>
          <p className="max-w-[900px] text-zinc-600">
            You are one of the first to receive access to our new product.
          </p>
        </div>
        <div className="mt-8 border bg-gray-50 rounded p-4 max-w-2xl">
          <h2 className="font-bold mb-4">💡 What is this?</h2>
          <p className="text-zinc-600">
            This is a demo of a waiting room for a new product launch. It uses{' '}
            <a
              href="https://vercel.com/docs/storage/vercel-kv"
              className="underline decoration-slate-300"
            >
              Vercel KV for Redis
            </a>{' '}
            to create a queue and store the number of people in the queue. If
            more than 10 people are in the queue in a 30 minute period, the
            waiting room will be activated.
          </p>
        </div>
      </div>
    </div>
  )
}
