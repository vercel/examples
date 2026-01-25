'use client'

import { useCallback, useRef, useState } from 'react'
import Editor, { OnMount, OnChange } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { Loader2 } from 'lucide-react'

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  readOnly?: boolean
  height?: string | number
  theme?: 'vs-dark' | 'light'
  minimap?: boolean
  lineNumbers?: boolean
  wordWrap?: boolean
  fontSize?: number
  onSave?: (value: string) => void
}

// Language detection based on file extension
export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()

  const languageMap: Record<string, string> = {
    // JavaScript/TypeScript
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    mjs: 'javascript',
    cjs: 'javascript',

    // Web
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'scss',
    less: 'less',

    // Data
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    toml: 'ini',

    // Markdown
    md: 'markdown',
    mdx: 'markdown',

    // Python
    py: 'python',
    pyw: 'python',
    pyi: 'python',

    // Shell
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    fish: 'shell',

    // Config
    env: 'ini',
    gitignore: 'ini',
    dockerfile: 'dockerfile',

    // Other languages
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    java: 'java',
    kt: 'kotlin',
    swift: 'swift',
    c: 'c',
    cpp: 'cpp',
    h: 'c',
    hpp: 'cpp',
    cs: 'csharp',
    sql: 'sql',
    graphql: 'graphql',
    gql: 'graphql',
    prisma: 'prisma',
  }

  return languageMap[ext || ''] || 'plaintext'
}

export function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  readOnly = false,
  height = '100%',
  theme = 'vs-dark',
  minimap = false,
  lineNumbers = true,
  wordWrap = true,
  fontSize = 14,
  onSave,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor
      setIsLoading(false)

      // Add keyboard shortcuts
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        if (onSave) {
          onSave(editor.getValue())
        }
      })

      // Configure editor options
      editor.updateOptions({
        tabSize: 2,
        insertSpaces: true,
        formatOnPaste: true,
        formatOnType: true,
        autoIndent: 'full',
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        wordBasedSuggestions: 'currentDocument',
        parameterHints: { enabled: true },
        bracketPairColorization: { enabled: true },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
      })

      // Register custom theme
      monaco.editor.defineTheme('vibe-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'FF79C6' },
          { token: 'string', foreground: 'F1FA8C' },
          { token: 'number', foreground: 'BD93F9' },
          { token: 'type', foreground: '8BE9FD' },
          { token: 'function', foreground: '50FA7B' },
        ],
        colors: {
          'editor.background': '#18181B',
          'editor.foreground': '#F4F4F5',
          'editor.lineHighlightBackground': '#27272A',
          'editor.selectionBackground': '#3F3F4680',
          'editorCursor.foreground': '#F4F4F5',
          'editorIndentGuide.background': '#3F3F46',
          'editorLineNumber.foreground': '#71717A',
          'editorLineNumber.activeForeground': '#A1A1AA',
        },
      })

      if (theme === 'vs-dark') {
        monaco.editor.setTheme('vibe-dark')
      }
    },
    [onSave, theme]
  )

  const handleChange: OnChange = useCallback(
    (newValue) => {
      if (onChange && newValue !== undefined) {
        onChange(newValue)
      }
    },
    [onChange]
  )

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      )}
      <Editor
        height={height}
        language={language}
        value={value}
        theme={theme}
        onChange={handleChange}
        onMount={handleMount}
        loading={null}
        options={{
          readOnly,
          minimap: { enabled: minimap },
          lineNumbers: lineNumbers ? 'on' : 'off',
          wordWrap: wordWrap ? 'on' : 'off',
          fontSize,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'all',
          renderWhitespace: 'selection',
          guides: {
            bracketPairs: true,
            indentation: true,
          },
        }}
      />
    </div>
  )
}

// Multi-tab editor component
interface EditorTab {
  id: string
  filename: string
  content: string
  language: string
  isDirty: boolean
}

interface MultiTabEditorProps {
  tabs: EditorTab[]
  activeTabId: string
  onTabChange: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onContentChange: (tabId: string, content: string) => void
  onSave?: (tabId: string, content: string) => void
}

export function MultiTabEditor({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onContentChange,
  onSave,
}: MultiTabEditorProps) {
  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex bg-zinc-800 border-b border-zinc-700 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer border-r border-zinc-700 ${
              tab.id === activeTabId
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="truncate max-w-[120px]">{tab.filename}</span>
            {tab.isDirty && <span className="text-blue-400">●</span>}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTabClose(tab.id)
              }}
              className="ml-1 text-zinc-500 hover:text-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1">
        {activeTab ? (
          <CodeEditor
            value={activeTab.content}
            language={activeTab.language}
            onChange={(content) => onContentChange(activeTab.id, content)}
            onSave={onSave ? (content) => onSave(activeTab.id, content) : undefined}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500">
            No file selected
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeEditor
