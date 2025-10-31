import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MessageSquare, Loader, Box, Settings } from 'lucide-react'
import type { Action, ExecResultAction } from '../../../types/run'
import { PreviewCard } from './PreviewCard'
import { MiniTerminal } from './MiniTerminal'
import { RuntimePill } from './RuntimePill'
import { ExecResultItem } from './ExecResultItem'

interface ChatTimelineProps {
  actions: Action[]
  isEmpty: boolean
  loading: boolean
  onOpenFile?: (path: string) => void
  refreshToken?: number
}

export const ChatTimeline: React.FC<ChatTimelineProps> = ({
  actions,
  isEmpty,
  loading,
  onOpenFile,
  refreshToken,
}) => {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  const isLongText = (text: string | undefined) => {
    if (!text) return false
    const lines = text.split('\n')
    return lines.length > 18 || text.length > 4000
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {isEmpty ? (
        <div
          className="text-center py-24"
          style={{ color: 'var(--vscode-muted)' }}
        >
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Ask me anything about your code!</p>
        </div>
      ) : (
        <>
          {actions.map((action, idx) => {
            const key = action.timestamp
              ? `${action.id}_${action.timestamp}`
              : `${action.id}_${idx}`
            switch (action.kind) {
              case 'user_message':
                return (
                  <div key={key} className="ml-4">
                    <div
                      className="px-3 py-2 rounded-lg ml-auto"
                      style={{
                        backgroundColor: 'var(--vscode-accent)',
                        color: '#ffffff',
                      }}
                    >
                      <p
                        className="text-sm whitespace-pre-wrap break-words"
                        style={{
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word',
                        }}
                      >
                        {action.content}
                      </p>
                    </div>
                  </div>
                )
              case 'system_notice':
                return (
                  <div key={key} className="mr-4">
                    <div
                      className="px-3 py-2 rounded-lg"
                      style={{
                        backgroundColor: 'var(--vscode-surface)',
                        color: 'var(--vscode-text)',
                      }}
                    >
                      <div
                        className="text-sm prose prose-invert max-w-none break-words"
                        style={{
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word',
                        }}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {action.message || ''}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )
              case 'exec_result': {
                const execAction = action as ExecResultAction
                const long = isLongText(execAction.output)
                const open = Boolean(expanded[action.id])
                return (
                  <div key={key} className="mr-4">
                    <div
                      className="relative rounded"
                      style={{
                        background: 'var(--vscode-bg)',
                        border: '1px solid var(--vscode-panel-border)',
                      }}
                    >
                      <ExecResultItem
                        actionId={action.id}
                        output={execAction.output}
                        long={long}
                        open={open}
                        onToggle={toggle}
                      />
                    </div>
                  </div>
                )
              }
              case 'tool_completed': {
                const res = action.result as
                  | {
                      url?: string
                      exit_code?: number
                      file_path?: string
                      find_start_line?: number
                      find_end_line?: number
                      new_code?: string
                      new_file_content?: string
                      created?: boolean
                      old_path?: string
                      new_path?: string
                      folder_path?: string
                      deleted?: boolean
                      removed_files?: number
                      moved_files?: number
                    }
                  | undefined
                if (action.toolName === 'think') return null
                if (action.toolName === 'sandbox_create') {
                  const info =
                    (res as unknown as {
                      runtime?: string
                      sandbox_id?: string
                      synthetic_runtime?: boolean
                      effective_runtime?: string
                    }) || {}
                  const runtime =
                    info?.runtime ||
                    (action as unknown as { arguments?: { runtime?: string } })
                      .arguments?.runtime ||
                    'auto'
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 text-xs ml-4"
                      style={{ color: 'var(--vscode-subtle)' }}
                    >
                      <Box className="w-3 h-3" />
                      <span>Acquired sandbox</span>
                      <RuntimePill runtime={runtime} />
                    </div>
                  )
                }
                if (action.toolName === 'sandbox_show_preview' && res?.url) {
                  const origin = (() => {
                    try {
                      return new URL(res.url).host
                    } catch {
                      return res.url
                    }
                  })()
                  const previewLabel =
                    (res as unknown as { label?: string; name?: string })
                      ?.label ||
                    (res as unknown as { label?: string; name?: string })?.name
                  return (
                    <PreviewCard
                      key={key}
                      url={res.url}
                      origin={origin}
                      contextLabel={previewLabel}
                      refreshToken={refreshToken}
                    />
                  )
                }
                if (action.toolName === 'sandbox_run') {
                  const args = (
                    action as unknown as {
                      arguments?: {
                        command?: string
                        cwd?: string
                        name?: string
                      }
                    }
                  ).arguments
                  const status: 'running' | 'done' | 'failed' =
                    typeof res?.exit_code === 'number'
                      ? res.exit_code === 0
                        ? 'done'
                        : 'failed'
                      : 'done'
                  return (
                    <div key={key} className="mr-4">
                      <MiniTerminal
                        command={args?.command || ''}
                        cwd={args?.cwd}
                        status={status}
                        output={
                          (action as unknown as { logs?: string }).logs || ''
                        }
                        sandboxName={args?.name}
                      />
                    </div>
                  )
                }
                if (
                  action.toolName === 'edit_code' &&
                  res?.file_path &&
                  res.find_start_line &&
                  res.find_end_line
                ) {
                  return (
                    <div key={key} className="text-xs text-purple-400">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenFile?.(
                            (res.file_path as unknown as string).replace(
                              /^\//,
                              ''
                            )
                          )
                        }
                        className="text-gray-300 underline-offset-2 hover:underline"
                        style={{ cursor: 'pointer' }}
                        title="Open file"
                      >
                        {res.file_path}
                      </button>{' '}
                      {res.find_start_line === res.find_end_line
                        ? `edited line ${res.find_start_line}`
                        : `edited lines ${res.find_start_line}-${res.find_end_line}`}
                    </div>
                  )
                }
                if (action.toolName === 'create_file' && res?.file_path) {
                  return (
                    <div key={key} className="text-xs text-green-400">
                      created{' '}
                      <button
                        type="button"
                        onClick={() =>
                          onOpenFile?.(
                            (res.file_path as unknown as string).replace(
                              /^\//,
                              ''
                            )
                          )
                        }
                        className="text-gray-300 underline-offset-2 hover:underline"
                        style={{ cursor: 'pointer' }}
                        title="Open file"
                      >
                        {res.file_path}
                      </button>
                    </div>
                  )
                }
                if (
                  action.toolName === 'rename_file' &&
                  res?.old_path &&
                  res?.new_path
                ) {
                  return (
                    <div key={key} className="text-xs text-blue-400">
                      renamed{' '}
                      <span className="text-gray-300">{res.old_path}</span> →{' '}
                      <span className="text-gray-300">{res.new_path}</span>
                    </div>
                  )
                }
                if (action.toolName === 'delete_file' && res?.file_path) {
                  return (
                    <div key={key} className="text-xs text-red-400">
                      deleted {res.file_path}
                    </div>
                  )
                }
                if (action.toolName === 'create_folder' && res?.folder_path) {
                  return (
                    <div key={key} className="text-xs text-green-400">
                      created folder {res.folder_path}
                    </div>
                  )
                }
                if (action.toolName === 'delete_folder' && res?.folder_path) {
                  return (
                    <div key={key} className="text-xs text-red-400">
                      deleted folder {res.folder_path}
                      {typeof res.removed_files === 'number'
                        ? ` (${res.removed_files} files)`
                        : ''}
                    </div>
                  )
                }
                if (
                  action.toolName === 'rename_folder' &&
                  res?.old_path &&
                  res?.new_path
                ) {
                  return (
                    <div key={key} className="text-xs text-blue-400">
                      renamed folder{' '}
                      <span className="text-gray-300">{res.old_path}</span> →{' '}
                      <span className="text-gray-300">{res.new_path}</span>
                      {typeof res.moved_files === 'number'
                        ? ` (${res.moved_files} files)`
                        : ''}
                    </div>
                  )
                }
                if (action.toolName === 'sandbox_set_env') {
                  const info =
                    (res as unknown as {
                      env_keys?: string[]
                      name?: string
                    }) || {}
                  const keys = Array.isArray(info.env_keys) ? info.env_keys : []
                  const shown = keys.slice(0, 3).join(', ')
                  const more =
                    keys.length > 3 ? ` +${keys.length - 3} more` : ''
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 text-xs ml-4"
                      style={{ color: 'var(--vscode-subtle)' }}
                    >
                      <Settings className="w-3 h-3" />
                      <span>Set env for</span>
                      <span className="text-gray-300">
                        {info.name || 'sandbox'}
                      </span>
                      {keys.length > 0 ? (
                        <span>
                          ({shown}
                          {more})
                        </span>
                      ) : null}
                    </div>
                  )
                }
                if (
                  typeof res?.new_code !== 'undefined' ||
                  typeof res?.new_file_content !== 'undefined'
                )
                  return null
                return (
                  <div
                    key={key}
                    className="text-xs"
                    style={{ color: 'var(--vscode-subtle)' }}
                  >
                    Tool {action.toolName} completed
                  </div>
                )
              }
              case 'tool_started':
                if (
                  (action as unknown as { toolName?: string }).toolName ===
                  'sandbox_run'
                ) {
                  const args = (
                    action as unknown as {
                      arguments?: {
                        command?: string
                        cwd?: string
                        name?: string
                      }
                    }
                  ).arguments
                  return (
                    <div key={key} className="mr-4">
                      <MiniTerminal
                        command={args?.command || ''}
                        cwd={args?.cwd}
                        status="running"
                        output={
                          (action as unknown as { logs?: string }).logs || ''
                        }
                        sandboxName={args?.name}
                      />
                    </div>
                  )
                }
                if (
                  (action as unknown as { toolName?: string }).toolName ===
                  'sandbox_create'
                ) {
                  const args = (
                    action as unknown as { arguments?: { runtime?: string } }
                  ).arguments
                  const runtime = args?.runtime || 'auto'
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 text-xs ml-4"
                      style={{ color: 'var(--vscode-subtle)' }}
                    >
                      <Loader className="w-3 h-3 animate-spin" />
                      <span>Creating</span>
                      <RuntimePill runtime={runtime} />
                      <span>sandbox</span>
                    </div>
                  )
                }
                if (
                  (action as unknown as { toolName?: string }).toolName ===
                  'think'
                )
                  return null
                return (
                  <div
                    key={key}
                    className="text-xs"
                    style={{ color: 'var(--vscode-subtle)' }}
                  >
                    Running {action.toolName}...
                  </div>
                )
              case 'assistant_thought':
                return (
                  <div
                    key={key}
                    className="mr-4 px-2 text-xs"
                    style={{
                      color: 'var(--vscode-muted)',
                      fontStyle: 'italic',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {action.content || ''}
                  </div>
                )
              case 'final_answer': {
                const content = action.content || ''
                return (
                  <div key={key} className="mr-4">
                    <div
                      className="px-3 py-2 rounded-lg"
                      style={{
                        backgroundColor: 'var(--vscode-surface)',
                        color: 'var(--vscode-text)',
                      }}
                    >
                      <div
                        className="text-sm prose prose-invert max-w-none break-words"
                        style={{
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word',
                        }}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )
              }
              default:
                return null
            }
          })}
          {loading && (
            <div className="flex items-center gap-1 text-xs text-gray-500 ml-4">
              <Loader className="w-3 h-3 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
