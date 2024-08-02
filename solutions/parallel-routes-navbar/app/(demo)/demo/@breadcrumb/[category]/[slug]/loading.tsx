export default function BreadcrumbLoading() {
  return (
    <nav className="flex gap-4 text-sm opacity-80">
      <div className="flex gap-1 text-sm">
        <span className="capitalize">{`>`}</span>
        <span className="w-[36px] bg-gray-200 animate-pulse rounded"></span>
      </div>
      <span> / </span>
      <span className="w-[55px] bg-gray-200 animate-pulse rounded"></span>
    </nav>
  )
}
