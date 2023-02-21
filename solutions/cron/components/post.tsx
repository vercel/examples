import ms from 'ms'

export default function Post({
  id,
  title,
  by,
  time,
  score,
  descendants,
}: {
  id: number
  title: string
  by: string
  time: number
  score: number
  descendants: number
}) {
  return (
    <div className="flex justify-between items-center border border-gray-100 shadow-md rounded-lg p-5">
      <div className="grid gap-2">
        <a
          href={`https://news.ycombinator.com/item?id=${id}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <h3 className="text-gray-600 hover:text-black font-semibold transition-all">
            {title}
          </h3>
        </a>
        <div className="flex space-x-1 text-gray-500 text-sm">
          <a
            href={`https://news.ycombinator.com/item?id=${id}`}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:underline hover:text-gray-800 transition-all"
          >
            {score} {score === 1 ? 'point' : 'points'}
          </a>
          <p>by</p>
          <a
            href={`https://news.ycombinator.com/user?id=${by}/`}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:underline hover:text-gray-800 transition-all"
          >
            {by}
          </a>
          <p>|</p>
          <a
            href={`https://news.ycombinator.com/item?id=${id}`}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:underline hover:text-gray-800 transition-all"
          >
            {descendants} {descendants === 1 ? 'comment' : 'comments'}
          </a>
        </div>
      </div>
      <p className="text-gray-500 text-sm">{timeAgo(time)}</p>
    </div>
  )
}

const timeAgo = (time: number): string => {
  if (!time) return 'Never'
  return `${ms(Date.now() - new Date(time * 1000).getTime())} ago`
}
