export type CMSComponent =
  | string
  | {
      name: string
      props?: {}
      children?: CMSComponent[]
    }

export type CMSComponentMap = Record<string, CMSComponent | undefined>
