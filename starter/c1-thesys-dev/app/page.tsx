'use client'

import '@crayonai/react-ui/styles/index.css'
import { Button } from '@crayonai/react-ui'
import { ThemeProvider, C1Component } from '@thesysai/genui-sdk'
import { useUIState } from './hooks/useUIState'
import { Loader } from './components/Loader'

const Page = () => {
  const { state, actions } = useUIState()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-[750px] mx-auto space-y-6">
        <div className="flex gap-4 items-center">
          <input
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300
              bg-white text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              placeholder-gray-500"
            value={state.query}
            placeholder="Enter a prompt"
            onChange={({ target: { value } }) => actions.setQuery(value)}
            onKeyDown={(e) => {
              // make api call only when response loading is not in progress
              if (e.key === 'Enter' && !state.isLoading) {
                actions.makeApiCall(state.query)
              }
            }}
          />
          <Button
            onClick={() => actions.makeApiCall(state.query)}
            disabled={state.query.length === 0 || state.isLoading}
            className="flex items-center justify-center min-w-[100px] h-[45px]"
            size="large"
            variant="primary"
          >
            {state.isLoading ? <Loader /> : 'Submit'}
          </Button>
        </div>

        <div className="max-w-[750px] mx-auto">
          <ThemeProvider>
            <C1Component
              c1Response={state.c1Response}
              isStreaming={state.isLoading}
              updateMessage={(message) => actions.setC1Response(message)}
              onAction={({ llmFriendlyMessage }) => {
                if (!state.isLoading) {
                  actions.makeApiCall(llmFriendlyMessage, state.c1Response)
                }
              }}
            />
          </ThemeProvider>
        </div>
      </div>
    </div>
  )
}

export default Page
