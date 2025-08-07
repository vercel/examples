export interface FileNode {
  children?: FileNode[]
  content?: string
  expanded?: boolean
  name: string
  path: string
  type: 'file' | 'folder'
}

interface FileNodeBuilder {
  children?: { [key: string]: FileNodeBuilder }
  content?: string
  expanded?: boolean
  name: string
  path: string
  type: 'file' | 'folder'
}

export function buildFileTree(paths: string[]): FileNode[] {
  const root: { [key: string]: FileNodeBuilder } = {}

  paths.forEach((path) => {
    const parts = path.split('/').filter(Boolean)
    let current = root
    let currentPath = ''

    parts.forEach((part, index) => {
      currentPath += '/' + part
      const isFile = index === parts.length - 1

      if (!current[part]) {
        current[part] = {
          name: part,
          type: isFile ? 'file' : 'folder',
          path: currentPath,
          content: isFile
            ? `// Content for ${currentPath}\n// This will be loaded when the file is selected`
            : undefined,
          children: isFile ? undefined : {},
          expanded: false,
        }
      }

      if (!isFile) {
        current = current[part].children!
      }
    })
  })

  const convertToArray = (obj: {
    [key: string]: FileNodeBuilder
  }): FileNode[] => {
    return Object.values(obj)
      .map(
        (node): FileNode => ({
          ...node,
          children: node.children ? convertToArray(node.children) : undefined,
        })
      )
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1
        }
        return a.name.localeCompare(b.name)
      })
  }

  return convertToArray(root)
}
