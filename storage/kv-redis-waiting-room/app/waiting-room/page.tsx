export default function WaitingRoom() {
  return (
    <div className="w-full py-16 mx-auto">
      <div className="container mx-auto max-w-xl px-4">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            You are now in line. Thanks for your patience.
          </h1>
          <p className="max-w-[900px] text-zinc-600">
            We are experiencing a high volume of traffic. Please sit tight and
            we will let you in soon. This page will automatically refresh,
            please do not close your browser.
          </p>
        </div>
      </div>
    </div>
  )
}
