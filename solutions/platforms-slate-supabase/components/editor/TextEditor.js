import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import Element from './Element'
import Leaf from './Leaf'

const HOTKEYS = {
  'cmd+b': 'bold',
  'cmd+i': 'italic',
  'cmd+u': 'underline',
  'cmd+c': 'code',
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Button = React.forwardRef(({ active, ...children }) => (
  <span
    {...children}
    className={`${active && 'font-bold'} cursor-pointer mr-3 p-1`}
  />
))

const TextEditor = (props) => {
  const [value, setValue] = useState(props.initialValue)
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [currentMark, setCurrentMark] = useState(null)

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  const ToolbarButton = ({ format, icon }) => {
    const editor = useSlate()

    if (isMarkActive(editor, format)) {
      setCurrentMark(format)
    }

    return (
      <Button
        active={isMarkActive(editor, format)}
        onMouseDown={(event) => {
          event.preventDefault()
          toggleMark(editor, format)
        }}
      >
        {icon}
      </Button>
    )
  }

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-2 bg-gray-50 flex items-center justify-between">
        <div className="">
          <ToolbarButton format="bold" icon="B" />
          <ToolbarButton
            format="italic"
            icon={<span className="italic">I</span>}
          />
          <ToolbarButton
            format="underline"
            icon={<span className="underline">U</span>}
          />
          <ToolbarButton format="code" icon={<span>{`< >`}</span>} />
          <ToolbarButton format="heading-one" icon="H1" />
          <ToolbarButton format="heading-two" icon="H2" />
        </div>
      </div>
      <Editable
        className="mt-4"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            toggleMark(editor, currentMark)
            setCurrentMark(null)
          }
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
              setCurrentMark(mark)
            }
          }
        }}
      />
    </Slate>
  )
}

export default TextEditor
