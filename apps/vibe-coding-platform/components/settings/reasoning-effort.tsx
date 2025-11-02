import { Models } from '@/ai/constants'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useModelId, useReasoningEffort } from './use-settings'

export function ReasoningEffort() {
  const [modelId] = useModelId()
  const [effort, setEffort] = useReasoningEffort()
  if (modelId !== Models.OpenAIGPT5) {
    return null
  }

  return (
    <div
      className="flex items-center justify-between cursor-pointer hover:bg-accent/50 rounded p-2 -m-2"
      onClick={() => setEffort(effort === 'medium' ? 'low' : 'medium')}
    >
      <div className="space-y-1 flex-1 pointer-events-none">
        <Label className="text-sm text-foreground" htmlFor="effort-level">
          Higher Effort Level
        </Label>
        <p className="text-sm text-muted-foreground leading-relaxed">
          With GPT-5, you can request higher reasoning effort level.
        </p>
      </div>
      <Checkbox
        id="effort-level"
        className="ml-3 pointer-events-none"
        checked={effort === 'medium'}
        onCheckedChange={(checked) =>
          setEffort(checked === true ? 'medium' : 'low')
        }
      />
    </div>
  )
}
