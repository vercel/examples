const TOOL_RESULT_ECHO_RE = /Used\s+\w+:\s*\{[\s\S]{200,}/g

export function stripToolResultEchoes(text: string): string {
  return text.replace(TOOL_RESULT_ECHO_RE, '').trim()
}
