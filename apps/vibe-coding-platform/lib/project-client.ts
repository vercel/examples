import { z } from 'zod'

export const projectSchema = z.object({
  sessionId: z.string(),
  token: z.string(),
})
export type Project = z.infer<typeof projectSchema>
export const PROJECT_KEY = 'vibe-project'
let activeProject: Project | null = null

export function setActiveProject(project: Project) {
  activeProject = project
}

export function savedProject(): Project | null {
  try {
    const parsed = projectSchema.safeParse(
      JSON.parse(localStorage.getItem(PROJECT_KEY) ?? 'null')
    )
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export async function projectFetch(url: string, init: RequestInit = {}) {
  const project = activeProject ?? savedProject()
  const headers = new Headers(init.headers)
  if (project) headers.set('authorization', `Bearer ${project.token}`)
  const response = await fetch(url, { ...init, headers })
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response
}
