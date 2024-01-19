export interface RedirectEntry {
  target: string
  permanent: boolean
}

export type RedirectEntries = Record<string, RedirectEntry>
