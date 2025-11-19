import clsx from 'clsx'
import { StarIcon } from '@heroicons/react/20/solid'

export function ProductReviews() {
  return (
    <div className="mt-4">
      <div className="flex items-center">
        <p className="text-sm text-gray-700">4.9</p>
        <div className="ml-1 flex items-center">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              key={rating}
              aria-hidden="true"
              className={clsx('text-yellow-400', 'size-5 shrink-0')}
            />
          ))}
        </div>
        <div aria-hidden="true" className="ml-4 text-sm text-gray-300">
          ·
        </div>
        <div className="ml-4 flex">
          <span className="text-sm text-gray-500">See all 312 reviews</span>
        </div>
      </div>
    </div>
  )
}
