import { createMemorySaveTool } from './memory-save'
import { createMemorySearchTool } from './memory-search'
import { createScheduleTool } from './schedule'
export { searchMemoriesForContext } from './memory-search'

export function createCustomTools(instanceId: string, userTimezone = 'UTC') {
  return {
    memory_save: createMemorySaveTool(instanceId),
    memory_search: createMemorySearchTool(instanceId),
    schedule: createScheduleTool(instanceId, userTimezone),
  }
}
