'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, Input, Text } from '@vercel/examples-ui'
import { AuthorByline } from '@/components/author-byline'
import { AuthedImage } from '@/components/authed-image'
import { Markdown } from '@/components/markdown'
import { excerpt } from '@/lib/markdown'
import { neon, type Author, type Post, type Site } from '@/lib/neon'
import { uploadImage } from '@/lib/upload'

export function PostManager({
  site,
  authors,
}: {
  site: Site
  authors: Author[]
}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [content, setContent] = useState('')
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [imageAlt, setImageAlt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [editing, setEditing] = useState<Post | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!authorId && authors[0]) setAuthorId(String(authors[0].id))
  }, [authorId, authors])

  const load = useCallback(async () => {
    const { data, error } = await neon
      .from('posts')
      .select('*')
      .eq('site_id', site.id)
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setPosts((data as Post[]) ?? [])
  }, [site.id])

  useEffect(() => {
    load()
  }, [load])

  const authorsById = new Map(authors.map((author) => [author.id, author]))

  function resetForm() {
    setEditing(null)
    setTitle('')
    setContent('')
    setImageAlt('')
    setFile(null)
    setTab('write')
    if (authors[0]) setAuthorId(String(authors[0].id))
    if (fileInput.current) fileInput.current.value = ''
  }

  function startEdit(post: Post) {
    setError(null)
    setEditing(post)
    setTitle(post.title)
    setAuthorId(post.author_id ? String(post.author_id) : '')
    setContent(post.content)
    setImageAlt(post.image_alt || '')
    setFile(null)
    setTab('write')
    if (fileInput.current) fileInput.current.value = ''
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function savePost(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const selected = authors.find((author) => String(author.id) === authorId)
      if (!selected) throw new Error('Pick an author')
      const image_key = file
        ? await uploadImage(file)
        : editing?.image_key ?? null
      const fields = {
        title,
        author: selected.name,
        author_id: selected.id,
        content,
        image_key,
        image_alt: image_key ? imageAlt : '',
      }
      const { error } = editing
        ? await neon.from('posts').update(fields).eq('id', editing.id)
        : await neon.from('posts').insert({
            site_id: site.id,
            ...fields,
            is_published: false,
          })
      if (error) throw new Error(error.message)
      resetForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPending(false)
    }
  }

  async function togglePublished(post: Post) {
    const { error } = await neon
      .from('posts')
      .update({ is_published: !post.is_published })
      .eq('id', post.id)
    if (error) setError(error.message)
    else await load()
  }

  async function remove(post: Post) {
    const { error } = await neon.from('posts').delete().eq('id', post.id)
    if (error) setError(error.message)
    else await load()
  }

  return (
    <div className="flex flex-col gap-8">
      <form ref={formRef} onSubmit={savePost} className="flex flex-col gap-3">
        <Text variant="h2">{editing ? 'Edit post' : 'New post'}</Text>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />
        {authors.length === 0 ? (
          <Text className="text-sm text-gray-500">
            Add an author above before writing a post.
          </Text>
        ) : (
          <label className="text-sm text-gray-600 flex flex-col gap-1">
            Author
            <select
              className="border rounded-md p-2 text-sm bg-white"
              value={authorId}
              onChange={(e) => setAuthorId(e.currentTarget.value)}
              required
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              className={`text-sm px-3 py-1 rounded-md border ${
                tab === 'write'
                  ? 'bg-black text-white border-black'
                  : 'bg-white'
              }`}
              onClick={() => setTab('write')}
            >
              Write
            </button>
            <button
              type="button"
              className={`text-sm px-3 py-1 rounded-md border ${
                tab === 'preview'
                  ? 'bg-black text-white border-black'
                  : 'bg-white'
              }`}
              onClick={() => setTab('preview')}
            >
              Preview
            </button>
          </div>
          {tab === 'write' ? (
            <textarea
              className="border rounded-md p-2 text-sm font-mono"
              placeholder="Write in Markdown…"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.currentTarget.value)}
            />
          ) : (
            <div className="border rounded-md p-4 min-h-[16rem]">
              {content.trim() ? (
                <Markdown>{content}</Markdown>
              ) : (
                <Text className="text-gray-500">
                  Nothing to preview yet. Write some Markdown first.
                </Text>
              )}
            </div>
          )}
        </div>
        <Text className="text-sm text-gray-500">
          Switch to Preview to see how the post will look once published.
        </Text>
        {editing?.image_key && !file && (
          <AuthedImage
            imageKey={editing.image_key}
            alt={imageAlt || editing.title}
            className="rounded-md max-h-40 w-auto object-cover"
          />
        )}
        <label className="text-sm text-gray-600 flex flex-col gap-1">
          Cover image{' '}
          {editing ? '(leave empty to keep the current one)' : '(optional)'}
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
          />
        </label>
        <Input
          placeholder="Cover image alt text"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.currentTarget.value)}
          required={!!file}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="black"
            loading={pending}
            disabled={authors.length === 0}
          >
            {editing ? 'Save post' : 'Add post'}
          </Button>
          {editing && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {error && <Text className="text-red-600">{error}</Text>}

      <div className="flex flex-col gap-4">
        <Text variant="h2">Posts</Text>
        {posts.length === 0 && (
          <Text>No posts yet. Add your first one above.</Text>
        )}
        {posts.map((post) => {
          const author = post.author_id
            ? authorsById.get(post.author_id)
            : undefined
          const name = author?.name || post.author
          return (
            <div
              key={post.id}
              className="border rounded-md p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-4">
                <Text className="font-semibold">{post.title}</Text>
                <span className="text-xs text-gray-500">
                  {post.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              {name && (
                <AuthorByline
                  name={name}
                  imageKey={author?.image_key}
                  imageAlt={author?.image_alt || author?.name}
                  authed
                />
              )}
              {post.image_key && (
                <AuthedImage
                  imageKey={post.image_key}
                  alt={post.image_alt || post.title}
                  className="rounded-md max-h-40 w-auto object-cover"
                />
              )}
              {post.content && (
                <Text className="text-gray-600">{excerpt(post.content)}</Text>
              )}
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => startEdit(post)}>
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => togglePublished(post)}
                >
                  {post.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="secondary" onClick={() => remove(post)}>
                  Delete
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
