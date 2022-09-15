export type Template = {
  name: string
  slug: string
  description: string
  framework: string[]
  type: string[]
  css: string[]
  githubUrl: string
  deployUrl: string
  demoUrl: string
  publisher: string
  relatedTemplates: LinkValue[]
  overview?: string
}

export type Patch =
  | {
      op: 'add'
      path: string
      value: AddValue
    }
  | {
      op: 'replace'
      path: string
      value: PatchValue
    }
  | {
      op: 'remove'
      path: string
    }

export type PatchValue = string | string[] | LinkValue[]

export type AddValue = { [lang: string]: PatchValue }

export type LinkValue = { sys: { id: string; type: 'Link'; linkType: 'Entry' } }
