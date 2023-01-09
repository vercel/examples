import cn from 'classnames'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useInterval } from '../utils/use-interval'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [messageId, setMessageId] = useState('')
  const [image, setImage] = useState(null)
  const [canShowImage, setCanShowImage] = useState(false)

  useInterval(
    async () => {
      const res = await fetch(`/api/poll?id=${messageId}`)
      const json = await res.json()
      if (res.status === 200) {
        setLoading(false)
        setImage(json.data[0].url)
      }
    },
    loading ? 1000 : null
  )

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    toast('Generating your image...', { position: 'top-center' })
    const response = await fetch(`/api/image?prompt=${prompt}`)
    const json = await response.json()
    setMessageId(json.id)
  }

  const showLoadingState = loading || (image && !canShowImage)

  return (
    <>
      <Head>
        <title>Dall-E 2 AI Image Generator</title>
      </Head>
      <div className="antialiased mx-auto px-4 py-20 h-screen bg-gray-100">
        <Toaster />
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl tracking-tighter pb-10 font-bold text-gray-800">
            Dall-E 2 image generator
          </h1>
          <form
            className="flex w-full sm:w-auto flex-col sm:flex-row mb-10"
            onSubmit={submitForm}
          >
            <input
              className="shadow-sm text-gray-700 rounded-sm px-3 py-2 mb-4 sm:mb-0 sm:min-w-[600px]"
              type="text"
              placeholder="Prompt for DALL-E"
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className="min-h-[40px] shadow-sm sm:w-[100px] py-2 inline-flex justify-center font-medium items-center px-4 bg-green-600 text-gray-100 sm:ml-2 rounded-md hover:bg-green-700"
              type="submit"
            >
              {showLoadingState && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {!showLoadingState ? 'Generate' : ''}
            </button>
          </form>
          <div className="relative flex w-full items-center justify-center">
            {image && (
              <div className="w-full sm:w-[400px] h-[400px] rounded-md shadow-md relative">
                <Image
                  alt={`Dall-E representation of: ${prompt}`}
                  className={cn(
                    'opacity-0 duration-1000 ease-in-out rounded-md shadow-md h-full object-cover',
                    { 'opacity-100': canShowImage }
                  )}
                  src={image}
                  fill={true}
                  onLoadingComplete={() => {
                    setCanShowImage(true)
                  }}
                />
              </div>
            )}

            <div
              className={cn(
                'w-full sm:w-[400px] absolute top-0.5 overflow-hidden rounded-2xl bg-white/5 shadow-xl shadow-black/5',
                {
                  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-500/10 before:to-transparent':
                    showLoadingState,
                  'opacity-0 shadow-none': canShowImage,
                }
              )}
            >
              <div
                className={cn(
                  'w-full sm:w-[400px] h-[400px] bg-gray-200 rounded-md shadow-md flex items-center justify-center'
                )}
              >
                <p className="uppercase text-sm text-gray-400">
                  {showLoadingState
                    ? 'Generating image....'
                    : 'No image selected'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
