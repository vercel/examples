import Layout from '@/components/app/Layout'
import useSWR from 'swr'
import { useDebounce } from 'use-debounce'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import TextareaAutosize from 'react-textarea-autosize'
import { useRouter } from 'next/router'
import isHotkey from 'is-hotkey'
import LoadingDots from '@/components/app/loading-dots'
import Loader from '@/components/app/Loader'
import Leaf from '@/components/editor/Leaf'
import Element from '@/components/editor/Element'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const HOTKEYS = {
  'cmd+b': 'bold',
  'cmd+i': 'italic',
  'cmd+u': 'underline',
  'cmd+c': 'code',
}

const formatSavedTime = (time) => {
  const date = new Date(time)
  const month = Intl.DateTimeFormat('en', { month: 'short' }).format(date)
  const day = Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  const mins = Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
  return `Last saved at ${month} ${day} ${mins}`
}

const isMarkActive = (editor, format) => {
  return !!Editor.marks(editor) ? Editor.marks(editor)[format] : false
}

const Button = ({ active, ...rest }) => {
  return (
    <span
      {...rest}
      className={`${active && 'font-bold'} cursor-pointer mr-3 p-1`}
    />
  )
}

const ToolbarButton = ({ format, icon, setCurrentMark, toggleMark }) => {
  const editor = useSlate()

  useEffect(() => {
    if (isMarkActive(editor, format)) {
      setCurrentMark(format)
    }
  }, [editor, format])

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

export default function Post() {
  const router = useRouter()
  const { id: postId } = router.query
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const [currentMark, setCurrentMark] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [savedState, setSavedState] = useState('Saving post')
  const [postData, setPostData] = useState() // The created post.
  const [debouncedData] = useDebounce(postData, 1000)

  const { data: post, isValidating } = useSWR(
    `/api/post?postId=${postId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: () => {
        router.push('/')
      },
    }
  )

  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title,
        description: post.description,
        content: post.content,
      })
      setSavedState(formatSavedTime(post.updatedAt))
    }
  }, [post])

  useEffect(() => {
    if (debouncedData?.title) {
      saveChanges(debouncedData)
    }
  }, [debouncedData])

  useEffect(() => {
    if (
      postData?.title &&
      postData?.description &&
      postData?.content &&
      !publishing
    )
      setDisabled(false)
    else setDisabled(true)
  }, [publishing, postData])

  useEffect(() => {
    const clickedSave = (e) => {
      let charCode = String.fromCharCode(e.which).toLowerCase()
      if ((e.ctrlKey || e.metaKey) && charCode === 's') {
        e.preventDefault()
        saveChanges(postData)
      }
    }
    window.addEventListener('keydown', clickedSave)
    return () => {
      window.removeEventListener('keydown', clickedSave)
    }
  }, [postData])

  const saveChanges = async (data) => {
    setSavedState('Saving changes...')

    const response = await fetch('/api/post', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: postId,
        title: data.title,
        description: data.description,
        content: data.content,
      }),
    })
    if (response.ok) {
      const responseData = await response.json()

      setSavedState(formatSavedTime(responseData.updatedAt))
    } else {
      setSavedState('Failed to save.')
    }
  }

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  const publish = async () => {
    setPublishing(true)

    // R: This should be a @lib and a one liner.
    const response = await fetch(`/api/post`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: postId,
        title: postData.title,
        description: postData.description,
        content: postData.content,
        published: true,
      }),
    })
    await response.json()
    // R: NEXT_PUBLIC_for reusability
    router.push(`https://${post.site.subdomain}.vercel.im/${post.slug}`)
  }

  if (isValidating && !post?.site.id) {
    return (
      <Layout>
        <Loader />
      </Layout>
    )
  }

  return (
    <>
      <Layout siteId={post?.site.id}>
        <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-10 mb-16">
          <TextareaAutosize
            name="title"
            onInput={(e) => setPostData({ ...postData, title: e.target.value })}
            className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
            placeholder="Untitled Post"
            value={postData?.title}
          />
          <TextareaAutosize
            name="description"
            onInput={(e) =>
              setPostData({ ...postData, description: e.target.value })
            }
            className="w-full px-2 py-3 text-gray-800 placeholder-gray-400 text-xl mb-3 resize-none border-none focus:outline-none focus:ring-0"
            placeholder="No description provided. Click to edit."
            value={postData?.description}
          />

          <div className="relative mb-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
          </div>
          {postData?.content ? (
            <Slate
              editor={editor}
              value={postData?.content}
              onChange={(content) => setPostData({ ...postData, content })}
            >
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-2 bg-gray-50 flex items-center justify-between">
                <div className="">
                  <ToolbarButton
                    format="bold"
                    icon="B"
                    setCurrentMark={setCurrentMark}
                    toggleMark={toggleMark}
                  />
                  <ToolbarButton
                    format="italic"
                    setCurrentMark={setCurrentMark}
                    toggleMark={toggleMark}
                    icon={<span className="italic">I</span>}
                  />
                  <ToolbarButton
                    format="underline"
                    setCurrentMark={setCurrentMark}
                    toggleMark={toggleMark}
                    icon={<span className="underline">U</span>}
                  />
                  <ToolbarButton
                    setCurrentMark={setCurrentMark}
                    toggleMark={toggleMark}
                    format="code"
                    icon={<span>{`< >`}</span>}
                  />
                  <ToolbarButton
                    setCurrentMark={setCurrentMark}
                    toggleMark={toggleMark}
                    format="heading-one"
                    icon="H1"
                  />
                  <ToolbarButton
                    setCurrentMark={setCurrentMark}
                    format="heading-two"
                    toggleMark={toggleMark}
                    icon="H2"
                  />
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
          ) : null}
        </div>
        <footer className="h-20 z-5 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
          <div className="max-w-screen-xl mx-auto px-10 sm:px-20 h-full flex justify-between items-center">
            <div className="text-sm">
              <strong>
                <p>{post?.imlished ? 'Published' : 'Draft'}</p>
              </strong>
              <p>{savedState}</p>
            </div>
            <button
              onClick={async () => {
                await publish()
              }}
              title={
                disabled
                  ? 'Post must have a title, description, and content to be published.'
                  : 'Publish'
              }
              disabled={disabled}
              className={`${
                disabled
                  ? 'cursor-not-allowed bg-gray-300 border-gray-300'
                  : 'bg-black hover:bg-white hover:text-black border-black'
              } mx-2 w-32 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
            >
              {publishing ? <LoadingDots /> : 'Publish  →'}
            </button>
          </div>
        </footer>
      </Layout>
    </>
  )
}
