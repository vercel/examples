import { Button } from './button.js'

const VERCEL_CLONE = 'https://vercel.com/new/clone'

export interface DeployButtonProps {
  repositoryUrl: string
  env?: string[]
  projectName?: string
  repositoryName?: string
  customDeployUrl?: string
}

export const DeployButton = (props: DeployButtonProps) => {
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
      href={
        props.customDeployUrl
          ? props.customDeployUrl
          : `${VERCEL_CLONE}${query ? `?${query}` : ''}`
      }
      target="_blank"
      rel="noreferrer"
    >
      Clone & Deploy
    </Button>
  )
}
