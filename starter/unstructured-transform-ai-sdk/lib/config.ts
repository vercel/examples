/**
 * Whether the app has the API keys it needs to actually run.
 *
 * When this template is deployed as a gallery demo without secrets, both keys
 * are absent — the UI then renders in "preview mode" instead of erroring on the
 * first request. A real deployment (via the Deploy button) sets both keys.
 */
export function isConfigured(): boolean {
  return Boolean(
    process.env.ANTHROPIC_API_KEY && process.env.UNSTRUCTURED_API_KEY,
  );
}
