export * from './layout.js'
export * from './head.js'
export * from './text.js'
export * from './input.js'
export * from './button.js'
export * from './loading-dots.js'
export * from './page.js'
export * from './link.js'
export * from './code.js'
export * from './list.js'
export * from './snippet.js'

export const getMetadata = ({
  title,
  description,
}: {
  title?: string
  description?: string
} = {}) => ({
  title: title ? `${title} - Vercel Examples` : 'Vercel Example',
  description,
})
