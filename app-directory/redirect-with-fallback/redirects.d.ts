export interface Redirect {
  source: string
  destination: string
  permanent?: boolean
  statusCode?: number
}

export const simpleRedirects: Redirect[]
export const complexRedirects: Redirect[]
