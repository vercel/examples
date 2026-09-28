import { Streamdown } from 'streamdown'

export function Text({ part }: { part: { text: string } }) {
  return (
    <div className="text-sm px-3.5 py-3 border bg-secondary/90 text-secondary-foreground border-gray-300 rounded-md font-mono">
      <Streamdown>{part.text}</Streamdown>
    </div>
  )
}
