export function commandLine(command: string, args: string[]) {
  return [command, ...args]
    .map((value) => `'${value.replaceAll("'", "'\\''")}'`)
    .join(' ')
}

export async function readOutputTail(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let output = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      output = (output + decoder.decode(value, { stream: !done })).slice(-16000)
      if (done) return output
    }
  } finally {
    reader.releaseLock()
  }
}
