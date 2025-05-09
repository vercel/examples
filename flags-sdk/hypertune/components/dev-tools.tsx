'use client'

import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export function DevTools() {
  const router = useRouter()

  const resetCookie = () => {
    const randomValue = Math.random().toString(36).substring(2)
    document.cookie = `nonce=${randomValue}; path=/;`
    router.refresh()
  }

  return (
    <div className="fixed bottom-2 right-2 p-3 bg-[#333333] rounded shadow-lg z-50 flex flex-col gap-2">
      <span className="text-white font-mono text-xs">Dev Tools</span>
      <button
        type="button"
        className="bg-white text-black font-mono text-xs rounded px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors active:bg-gray-300"
        onClick={resetCookie}
      >
        <ArrowPathIcon className="w-4 h-4" />
        Reset Stable ID
      </button>
    </div>
  )
}
