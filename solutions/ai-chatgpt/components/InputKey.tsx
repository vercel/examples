import { Text } from '@vercel/examples-ui'

export const InputKey = ({ input, setInput, sendMessage }: any) => (
  <div className="pb-20 flex flex-col clear-both">
    <Text className="py-2">
      <strong>OpenAI Key:</strong>
    </Text>
    <input
      type="text"
      aria-label="OpenAI Key"
      required
      className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm"
      value={input}
      onChange={(e) => {
        setInput(e.target.value)
      }}
    />
  </div>
)

export default InputKey
