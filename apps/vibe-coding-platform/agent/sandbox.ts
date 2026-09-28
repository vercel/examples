import { defineSandbox } from 'eve/sandbox'
import { ProjectSandbox } from './lib/project-sandbox'

export const environment = ProjectSandbox.environment()
export default defineSandbox(() => environment.open())
