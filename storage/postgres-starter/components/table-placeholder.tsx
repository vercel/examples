import RefreshButton from './refresh-button'

export default function TablePlaceholder() {
  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Recent Users</h2>
          <p className="text-sm text-gray-500">Fetching users...</p>
        </div>
        <RefreshButton />
      </div>
      <div className="divide-y divide-gray-900/5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-1">
                <div className="h-6 w-28 rounded-md bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 rounded-md bg-gray-200 animate-pulse" />
              </div>
            </div>
            <div className="h-4 w-12 rounded-md bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
