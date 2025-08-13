'use client'

import { BarLoader } from 'react-spinners'
import {
  CompassIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  RocketIcon,
} from 'lucide-react'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import Link from 'next/link'

interface Props {
  className?: string
  disabled?: boolean
  url?: string
  paths: string[]
  sandboxId: string | undefined
}

interface DeploymentStatus {
  readyState?: 'INITIALIZING' | 'BUILDING' | 'READY' | 'ERROR'
  url: string
  id: string
  error?: string
}

type DeploymentState =
  | { status: 'idle' }
  | { status: 'deploying'; progress: string }
  | { status: 'polling'; deploymentId: string; url?: string; progress: string }
  | { status: 'ready'; url: string }
  | { status: 'error'; message: string }

function useDeployment() {
  const [deploymentId, setDeploymentId] = useState<string | null>(null)
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)

  const { trigger: deploy, isMutating: isDeploying } = useSWRMutation(
    '/api/deploy',
    (
      url,
      {
        arg,
      }: {
        arg: { paths: string[]; sandboxId: string; projectId: string | null }
      }
    ) =>
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
      }).then(
        (res) =>
          res.json() as Promise<{
            url: string
            id: string
            projectId: string
          }>
      )
  )

  const { data: currentStatus, isLoading: isPolling } =
    useSWR<DeploymentStatus>(
      deploymentId ? `/api/deploy?id=${deploymentId}` : null,
      (url) => fetch(url).then((res) => res.json()),
      {
        refreshInterval: deploymentId ? 10000 : 0,
        revalidateOnFocus: false,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 2000,
      }
    )

  const startDeployment = useCallback(
    async (paths: string[], sandboxId: string, projectId: string | null) => {
      const result = await deploy({ paths, sandboxId, projectId })
      setDeploymentUrl(result.url)
      setDeploymentId(result.id)
      return result
    },
    [deploy]
  )

  const getDeploymentState = useCallback((): DeploymentState => {
    if (isDeploying) {
      return { status: 'deploying', progress: 'Starting deployment...' }
    }

    if (currentStatus?.readyState === 'ERROR') {
      return {
        status: 'error',
        message: currentStatus.error || 'Your deployment failed.',
      }
    }

    if (deploymentId && currentStatus) {
      const progress =
        currentStatus.readyState === 'BUILDING'
          ? 'Building application...'
          : 'Initializing deployment...'

      if (currentStatus.readyState === 'READY') {
        return { status: 'ready', url: currentStatus.url }
      }

      return {
        status: 'polling',
        deploymentId,
        url: deploymentUrl || currentStatus.url,
        progress,
      }
    }

    if (deploymentId && isPolling) {
      return {
        status: 'polling',
        deploymentId,
        url: deploymentUrl || undefined,
        progress: 'Checking deployment status...',
      }
    }

    return { status: 'idle' }
  }, [isDeploying, deploymentId, currentStatus, deploymentUrl, isPolling])

  return { state: getDeploymentState(), startDeployment, deploymentUrl }
}

export function DeployButton({
  paths,
  sandboxId,
}: Pick<Props, 'paths' | 'sandboxId'>) {
  const { state, startDeployment, deploymentUrl } = useDeployment()
  const [projectId, setProjectId] = useState<string | null>(null)

  const handleDeploy = useCallback(async () => {
    if (!sandboxId) {
      return
    }
    const result = await startDeployment(paths, sandboxId, projectId)
    setProjectId(result.projectId)
  }, [paths, sandboxId, startDeployment, projectId])

  const isDisabled =
    !sandboxId ||
    state.status === 'deploying' ||
    state.status === 'polling' ||
    paths.length === 0

  const getButtonContent = () => {
    switch (state.status) {
      case 'deploying':
      case 'polling':
        return (
          <span className="inline-flex items-center">
            <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
            {'progress' in state ? state.progress : 'Deploying...'}
          </span>
        )
      case 'ready':
        return 'Redeploy'
      default:
        return 'Deploy'
    }
  }

  const buttonContent = getButtonContent()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer px-1 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
          type="button"
          disabled={!sandboxId}
          aria-label="Deploy to Vercel"
        >
          <RocketIcon className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-3 w-80 font-mono">
        <div className="text-sm text-zinc-600 mb-3">
          Publish to the web using Vercel. This will create a project in your
          personal account.
        </div>

        {!projectId || state.status === 'idle' ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 h-8 text-xs"
              disabled={isDisabled}
              onClick={handleDeploy}
              type="button"
            >
              {buttonContent}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 flex-col">
            <Button className="flex-1 h-16 text-xs" asChild variant={'outline'}>
              {state.status === 'deploying' ||
              state.status === 'polling' ||
              state.status === 'error' ? (
                <Link href={`https://${deploymentUrl}`} target="_blank">
                  Inspect Deployment
                  <ExternalLinkIcon className="w-4 h-4" />
                </Link>
              ) : (
                <Link href={`https://${state.url}`} target="_blank">
                  Visit Deployment
                  <ExternalLinkIcon className="w-4 h-4" />
                </Link>
              )}
            </Button>
            <Button
              className="flex-1 h-16 text-xs"
              onClick={handleDeploy}
              disabled={
                state.status === 'deploying' || state.status === 'polling'
              }
            >
              {buttonContent}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export function Preview({ className, disabled, url, paths, sandboxId }: Props) {
  const [currentUrl, setCurrentUrl] = useState(url)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState(url || '')
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const loadStartTime = useRef<number | null>(null)
  const hasVercelJson = paths.some((path) => path === 'vercel.json')

  useEffect(() => {
    setCurrentUrl(url)
    setInputValue(url || '')
  }, [url])

  const refreshIframe = () => {
    if (iframeRef.current && currentUrl) {
      setIsLoading(true)
      setError(null)
      loadStartTime.current = Date.now()
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentUrl
        }
      }, 10)
    }
  }

  const loadNewUrl = () => {
    if (iframeRef.current && inputValue) {
      if (inputValue !== currentUrl) {
        setIsLoading(true)
        setError(null)
        loadStartTime.current = Date.now()
        iframeRef.current.src = inputValue
      } else {
        refreshIframe()
      }
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError('Failed to load the page')
  }

  return (
    <Panel className={className}>
      <PanelHeader>
        <div className="absolute flex items-center space-x-1">
          <a href={currentUrl} target="_blank" className="cursor-pointer px-1">
            <CompassIcon className="w-4" />
          </a>
          <button
            onClick={refreshIframe}
            type="button"
            className={cn('cursor-pointer px-1', {
              'animate-spin': isLoading,
            })}
          >
            <RefreshCwIcon className="w-4" />
          </button>
          {hasVercelJson && (
            <DeployButton paths={paths} sandboxId={sandboxId} />
          )}
        </div>

        <div className="m-auto h-6">
          {url && (
            <input
              type="text"
              className="font-mono text-xs h-6 border border-gray-200 px-4 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[300px]"
              onChange={(event) => setInputValue(event.target.value)}
              onClick={(event) => event.currentTarget.select()}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.currentTarget.blur()
                  loadNewUrl()
                }
              }}
              value={inputValue}
            />
          )}
        </div>
      </PanelHeader>

      <div className="flex h-[calc(100%-2rem-1px)] relative">
        {currentUrl && !disabled && (
          <>
            <ScrollArea className="w-full">
              <iframe
                ref={iframeRef}
                src={currentUrl}
                className="w-full h-full"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="Browser content"
              />
            </ScrollArea>

            {isLoading && !error && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center flex-col gap-2">
                <BarLoader color="#666" />
                <span className="text-gray-500 text-xs">Loading...</span>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 bg-white flex items-center justify-center flex-col gap-2">
                <span className="text-red-500">Failed to load page</span>
                <button
                  className="text-blue-500 hover:underline text-sm"
                  type="button"
                  onClick={() => {
                    if (currentUrl) {
                      setIsLoading(true)
                      setError(null)
                      const newUrl = new URL(currentUrl)
                      newUrl.searchParams.set('t', Date.now().toString())
                      setCurrentUrl(newUrl.toString())
                    }
                  }}
                >
                  Try again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Panel>
  )
}
