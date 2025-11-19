import React from 'react'
import { FolderTree, Code2, MessageSquare } from 'lucide-react'

interface ThreePaneProps {
  left: React.ReactNode
  center: React.ReactNode
  right: React.ReactNode
  initialLeftWidth?: number
  minLeftWidth?: number
  maxLeftWidth?: number
  initialRightWidth?: number
  minRightWidth?: number
  maxRightWidth?: number
  // Optional header slot to render above panes (part of layout, not fixed)
  header?: React.ReactNode
}

export const ThreePane: React.FC<ThreePaneProps> = ({
  left,
  center,
  right,
  initialLeftWidth = 260,
  minLeftWidth = 200,
  maxLeftWidth = 420,
  initialRightWidth = 420,
  minRightWidth = 320,
  maxRightWidth = 720,
  header,
}) => {
  const [leftWidth, setLeftWidth] = React.useState(initialLeftWidth)
  const [rightWidth, setRightWidth] = React.useState(initialRightWidth)
  const [resizing, setResizing] = React.useState<'left' | 'right' | null>(null)
  const [isMobile, setIsMobile] = React.useState(false)
  const [activeMobilePane, setActiveMobilePane] = React.useState<
    'files' | 'code' | 'chat'
  >('code')

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 767.98px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const onMouseDownLeft = React.useCallback((e: React.MouseEvent) => {
    setResizing('left')
    e.preventDefault()
  }, [])
  const onMouseDownRight = React.useCallback((e: React.MouseEvent) => {
    setResizing('right')
    e.preventDefault()
  }, [])

  const onMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (resizing === 'left') {
        const newWidth = Math.min(
          Math.max(e.clientX, minLeftWidth),
          maxLeftWidth
        )
        setLeftWidth(newWidth)
      } else if (resizing === 'right') {
        const newWidth = Math.min(
          Math.max(window.innerWidth - e.clientX, minRightWidth),
          maxRightWidth
        )
        setRightWidth(newWidth)
      }
    },
    [resizing, minLeftWidth, maxLeftWidth, minRightWidth, maxRightWidth]
  )

  const onMouseUp = React.useCallback(() => {
    setResizing(null)
  }, [])

  React.useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [resizing, onMouseMove, onMouseUp])

  if (isMobile) {
    return (
      <div
        className="h-screen w-screen flex flex-col"
        style={{ backgroundColor: 'var(--vscode-bg)' }}
      >
        {/* Mobile top bar */}
        <div
          className="fixed inset-x-0 flex items-center justify-between"
          style={{
            top: 0,
            height: 'var(--header-height)',
            backgroundColor: 'var(--vscode-panel)',
            borderBottom: '1px solid var(--vscode-panel-border)',
            zIndex: 100001,
          }}
          role="tablist"
          aria-label="Mobile panes"
        >
          <button
            type="button"
            onClick={() => setActiveMobilePane('files')}
            role="tab"
            aria-selected={activeMobilePane === 'files'}
            className="flex-1 h-full inline-flex items-center justify-center gap-2 text-sm"
            style={{
              color: 'var(--vscode-text)',
              background: 'transparent',
              boxShadow:
                activeMobilePane === 'files'
                  ? 'inset 0 -2px 0 var(--vscode-accent)'
                  : 'none',
            }}
          >
            <FolderTree className="w-4 h-4" />
            <span>Files</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMobilePane('code')}
            role="tab"
            aria-selected={activeMobilePane === 'code'}
            className="flex-1 h-full inline-flex items-center justify-center gap-2 text-sm"
            style={{
              color: 'var(--vscode-text)',
              background: 'transparent',
              boxShadow:
                activeMobilePane === 'code'
                  ? 'inset 0 -2px 0 var(--vscode-accent)'
                  : 'none',
            }}
          >
            <Code2 className="w-4 h-4" />
            <span>Code</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMobilePane('chat')}
            role="tab"
            aria-selected={activeMobilePane === 'chat'}
            className="flex-1 h-full inline-flex items-center justify-center gap-2 text-sm"
            style={{
              color: 'var(--vscode-text)',
              background: 'transparent',
              boxShadow:
                activeMobilePane === 'chat'
                  ? 'inset 0 -2px 0 var(--vscode-accent)'
                  : 'none',
            }}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>
        </div>

        {/* Mobile content area */}
        <div
          className="flex-1 min-h-0 flex flex-col"
          style={{ paddingTop: 'var(--header-height)' }}
        >
          {activeMobilePane === 'files' && (
            <div
              className="flex-1 min-h-0 flex flex-col"
              style={{ backgroundColor: 'var(--vscode-sidebar)' }}
            >
              {left}
            </div>
          )}
          {activeMobilePane === 'code' && (
            <div
              className="flex-1 min-h-0 flex flex-col"
              style={{
                minWidth: 0,
                minHeight: 0,
                paddingBottom: 'var(--statusbar-height)',
              }}
            >
              {center}
            </div>
          )}
          {activeMobilePane === 'chat' && (
            <div
              className="flex-1 min-h-0 flex flex-col"
              style={{ backgroundColor: 'var(--vscode-sidebar)' }}
            >
              {right}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-screen w-screen flex flex-col"
      style={{ backgroundColor: 'var(--vscode-bg)' }}
    >
      {header}
      <div className="flex flex-1 min-h-0">
        <div
          className="flex flex-col"
          style={{
            width: `${leftWidth}px`,
            backgroundColor: 'var(--vscode-sidebar)',
            borderRight: '1px solid var(--vscode-panel-border)',
          }}
        >
          {left}
        </div>
        <div
          onMouseDown={onMouseDownLeft}
          className={`w-1 cursor-col-resize transition-colors ${
            resizing === 'left' ? '' : 'hover:bg-blue-500'
          }`}
          style={{
            backgroundColor:
              resizing === 'left'
                ? 'var(--vscode-accent)'
                : 'var(--vscode-panel-border)',
          }}
        />
        <div
          className="flex-1 flex flex-col"
          style={{
            minWidth: 0,
            minHeight: 0,
            paddingBottom: 'var(--statusbar-height)',
          }}
        >
          {center}
        </div>
        <div
          onMouseDown={onMouseDownRight}
          className={`w-1 cursor-col-resize transition-colors ${
            resizing === 'right' ? '' : 'hover:bg-blue-500'
          }`}
          style={{
            backgroundColor:
              resizing === 'right'
                ? 'var(--vscode-accent)'
                : 'var(--vscode-panel-border)',
          }}
        />
        <div
          className="flex flex-col"
          style={{
            width: `${rightWidth}px`,
            backgroundColor: 'var(--vscode-sidebar)',
            borderLeft: '1px solid var(--vscode-panel-border)',
          }}
        >
          {right}
        </div>
      </div>
    </div>
  )
}

export default ThreePane
