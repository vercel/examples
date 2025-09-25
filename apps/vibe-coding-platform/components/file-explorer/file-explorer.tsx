'use client'

import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  FileIcon,
} from 'lucide-react'
import { FileContent } from '@/components/file-explorer/file-content'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { buildFileTree, type FileNode } from './build-file-tree'
import { useState, useMemo, useEffect, useCallback, memo } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  className: string
  disabled?: boolean
  paths: string[]
  sandboxId?: string
}

export const FileExplorer = memo(function FileExplorer({
  className,
  disabled,
  paths,
  sandboxId,
}: Props) {
  const fileTree = useMemo(() => buildFileTree(paths), [paths])
  const [selected, setSelected] = useState<FileNode | null>(null)
  const [fs, setFs] = useState<FileNode[]>(fileTree)

  useEffect(() => {
    setFs(fileTree)
  }, [fileTree])

  const toggleFolder = useCallback((path: string) => {
    setFs((prev) => {
      const updateNode = (nodes: FileNode[]): FileNode[] =>
        nodes.map((node) => {
          if (node.path === path && node.type === 'folder') {
            return { ...node, expanded: !node.expanded }
          } else if (node.children) {
            return { ...node, children: updateNode(node.children) }
          } else {
            return node
          }
        })
      return updateNode(prev)
    })
  }, [])

  const selectFile = useCallback((node: FileNode) => {
    if (node.type === 'file') {
      setSelected(node)
    }
  }, [])

  const renderFileTree = useCallback(
    (nodes: FileNode[], depth = 0) => {
      return nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          depth={depth}
          selected={selected}
          onToggleFolder={toggleFolder}
          onSelectFile={selectFile}
          renderFileTree={renderFileTree}
        />
      ))
    },
    [selected, toggleFolder, selectFile]
  )

  return (
    <Panel className={className}>
      <PanelHeader>
        <FileIcon className="w-4 mr-2" />
        <span className="font-mono uppercase font-semibold">
          Sandbox Remote Filesystem
        </span>
        {selected && !disabled && (
          <span className="ml-auto text-gray-500">{selected.path}</span>
        )}
      </PanelHeader>

      <div className="flex text-sm h-[calc(100%-2rem-1px)]">
        <ScrollArea className="w-1/4 border-r border-primary/18 flex-shrink-0">
          <div>{renderFileTree(fs)}</div>
        </ScrollArea>
        {selected && sandboxId && !disabled && (
          <ScrollArea className="w-3/4 flex-shrink-0">
            <FileContent
              sandboxId={sandboxId}
              path={selected.path.substring(1)}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </Panel>
  )
})

// Memoized file tree node component
const FileTreeNode = memo(function FileTreeNode({
  node,
  depth,
  selected,
  onToggleFolder,
  onSelectFile,
  renderFileTree,
}: {
  node: FileNode
  depth: number
  selected: FileNode | null
  onToggleFolder: (path: string) => void
  onSelectFile: (node: FileNode) => void
  renderFileTree: (nodes: FileNode[], depth: number) => React.ReactNode
}) {
  const handleClick = useCallback(() => {
    if (node.type === 'folder') {
      onToggleFolder(node.path)
    } else {
      onSelectFile(node)
    }
  }, [node, onToggleFolder, onSelectFile])

  return (
    <div>
      <div
        className={cn(
          `flex items-center py-0.5 px-1 hover:bg-gray-100 cursor-pointer`,
          { 'bg-gray-200/80': selected?.path === node.path }
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' ? (
          <>
            {node.expanded ? (
              <ChevronDownIcon className="w-4 mr-1" />
            ) : (
              <ChevronRightIcon className="w-4 mr-1" />
            )}
            <FolderIcon className="w-4 mr-2" />
          </>
        ) : (
          <>
            <div className="w-4 mr-1" />
            <FileIcon className="w-4 mr-2 " />
          </>
        )}
        <span className="">{node.name}</span>
      </div>

      {node.type === 'folder' && node.expanded && node.children && (
        <div>{renderFileTree(node.children, depth + 1)}</div>
      )}
    </div>
  )
})
