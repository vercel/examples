export function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
      {children}
    </main>
  )
}
