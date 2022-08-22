export type CMSComponent =
  | string
  | {
      name: string
      props?: {}
      children?: CMSComponent[]
    }

export type CMSRoute = { layout: CMSComponent; page: CMSComponent }

export type CMSRoutes = Record<string, CMSRoute | undefined>
