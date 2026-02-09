interface Params {
  args?: Record<string, unknown>
  action: string
  error: unknown
}

interface ErrorFields {
  message: string
  json?: unknown
  text?: string
}

/**
 * Allows to parse a thrown error to check its metadata and construct a rich
 * message that can be handed to the LLM.
 */
export function getRichError({ action, args, error }: Params) {
  const fields = getErrorFields(error)
  let message = `Error during ${action}: ${fields.message}`
  if (args) message += `\nParameters: ${JSON.stringify(args, null, 2)}`
  if (fields.json) message += `\nJSON: ${JSON.stringify(fields.json, null, 2)}`
  if (fields.text) message += `\nText: ${fields.text}`
  return {
    message: message,
    error: fields,
  }
}

function getErrorFields(error: unknown): ErrorFields {
  if (!(error instanceof Error)) {
    return {
      message: String(error),
      json: error,
    }
  }

  // Handle E2B errors - they typically have a message and may include additional data
  const e2bError = error as Error & {
    response?: { data?: unknown }
    status?: number
  }
  if (e2bError.response?.data) {
    return {
      message: e2bError.message,
      json: e2bError.response.data,
    }
  }

  return {
    message: error.message,
    json: error,
  }
}
