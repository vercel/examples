export type CMSComponentElement = {
  name: string
  props?: {}
  children?: CMSComponent[]
}

export type CMSComponent = string | CMSComponentElement

export type CMSComponentMap = Record<string, CMSComponent | undefined>
