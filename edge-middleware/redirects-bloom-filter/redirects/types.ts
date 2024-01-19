export interface Redirect {
  target: string
  permanent: boolean
}

export type Redirects = Record<string, Redirect>
