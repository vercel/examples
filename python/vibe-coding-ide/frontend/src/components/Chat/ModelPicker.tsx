import React from 'react'
import { API_BASE } from '../../constants'

interface ModelsResponse {
  models?: string[]
  error?: string
}

interface ModelPickerProps {
  value: string
  onChange: (model: string) => void
}

export const ModelPicker: React.FC<ModelPickerProps> = ({
  value,
  onChange,
}) => {
  const [models, setModels] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    const fetchModels = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/models`)
        if (!res.ok) throw new Error(`Failed to load models (${res.status})`)
        const data: ModelsResponse = await res.json()
        const list = Array.isArray(data.models) ? data.models : []
        if (mounted) setModels(list)
      } catch (e: unknown) {
        if (mounted) {
          setError(e instanceof Error ? e.message : 'Failed to load models')
          setModels([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchModels()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="w-full flex justify-end">
      <select
        aria-label="Model"
        title={error ? `Model: ${error}` : 'Model'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="text-sm rounded-sm px-2 py-1 disabled:opacity-50 w-auto min-w-[160px]"
        style={{
          backgroundColor: 'var(--vscode-contrast)',
          border: '1px solid var(--vscode-panel-border)',
          color: 'var(--vscode-text)',
        }}
      >
        {models.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  )
}
