import type { FC } from 'react'
import Button from './button'

const VERCEL_CLONE = 'https://vercel.com/new/clone'

export interface DeployButtonProps {
  repositoryUrl: string
  env?: string[]
  projectName?: string
  repositoryName?: string
}

const DeployButton: FC<DeployButtonProps> = (props) => {
  const params = [
    ['repository-url', props.repositoryUrl],
    ['env', props.env?.join(',')],
    ['project-name', props.projectName],
    ['repository-name', props.repositoryName],
  ]
  const query = params
    .reduce<string[]>((arr, [k, v]) => {
      if (v) arr.push(`${k}=${encodeURIComponent(v)}`)
      return arr
    }, [])
    .join('&')

  return (
    <Button
      Component="a"
      href={`${VERCEL_CLONE}${query ? `?${query}` : ''}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Clone & Deploy
    </Button>
  )
}

export default DeployButton
