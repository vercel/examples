export function ProductDetails() {
  return (
    <>
      <div className="mt-10">
        <h2 className="text-sm font-medium text-gray-900">Description</h2>
        <div className="mt-4 space-y-4 text-sm/6 text-gray-500">
          <p>
            Embrace geometric simplicity with our Circles tee. This modern take
            on casual wear features a clean, minimalist design that speaks
            volumes without saying a word. Each circle pattern is perfectly
            balanced, creating a visual rhythm that makes this tee both a
            statement piece and a versatile wardrobe essential.
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-sm font-medium text-gray-900">
          Quality you can feel
        </h2>
        <div className="mt-4">
          <ul
            role="list"
            className="list-disc space-y-1 pl-5 text-sm/6 text-gray-500 marker:text-gray-300"
          >
            <li className="pl-2">
              Premium-grade cotton blend for exceptional comfort
            </li>
            <li className="pl-2">
              Pre-washed and pre-shrunk for a reliable fit
            </li>
            <li className="pl-2">
              Proudly produced in local partner facilities
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
