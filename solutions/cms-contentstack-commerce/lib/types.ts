export interface Entry {
  title: string
  header: any
  seo: Record<string, string>
  modular_blocks: UIComponentEntity[]
  locale: string
}

// Only two types of components are defined but we can create as many as we want
export type UIComponentTypes = 'hero' | 'grid'

interface UIComponentEntity {
  component: UIComponentData
}

interface UIComponentData {
  component_variant: string
  component_type: UIComponentTypes
  grid?: any
}
