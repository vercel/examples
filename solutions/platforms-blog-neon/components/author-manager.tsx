'use client'

import { useRef, useState, type FormEvent } from 'react'
import { Button, Input, Text } from '@vercel/examples-ui'
import { AuthedImage } from '@/components/authed-image'
import { neon, type Author, type Site } from '@/lib/neon'
import { uploadImage } from '@/lib/upload'

export function AuthorManager({
  site,
  authors,
  onChange,
}: {
  site: Site
  authors: Author[]
  onChange: () => Promise<void>
}) {
  const [name, setName] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  async function createAuthor(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const image_key = file ? await uploadImage(file) : null
      const { error } = await neon.from('authors').insert({
        site_id: site.id,
        name,
        image_key,
        image_alt: image_key ? imageAlt || name : '',
      })
      if (error) throw new Error(error.message)
      setName('')
      setImageAlt('')
      setFile(null)
      if (fileInput.current) fileInput.current.value = ''
      await onChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPending(false)
    }
  }

  async function remove(author: Author) {
    const { error } = await neon.from('authors').delete().eq('id', author.id)
    if (error) setError(error.message)
    else await onChange()
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={createAuthor} className="flex flex-col gap-3">
        <Text variant="h2">Authors</Text>
        <Text className="text-sm text-gray-500">
          Add the people who write on this site. Each can have a photo, and you
          pick one when you publish a post.
        </Text>
        <Input
          placeholder="Author name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <label className="text-sm text-gray-600 flex flex-col gap-1">
          Photo (optional)
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
          />
        </label>
        <Input
          placeholder="Photo alt text (defaults to the author's name)"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.currentTarget.value)}
        />
        <Button type="submit" variant="black" loading={pending}>
          Add author
        </Button>
      </form>

      {error && <Text className="text-red-600">{error}</Text>}

      {authors.length === 0 ? (
        <Text>No authors yet. Add one to start posting.</Text>
      ) : (
        <div className="flex flex-col gap-3">
          {authors.map((author) => (
            <div
              key={author.id}
              className="border rounded-md p-3 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                {author.image_key && (
                  <AuthedImage
                    imageKey={author.image_key}
                    alt={author.image_alt || author.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <Text className="font-semibold truncate">{author.name}</Text>
              </div>
              <Button variant="secondary" onClick={() => remove(author)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
