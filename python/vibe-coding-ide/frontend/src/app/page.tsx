'use client'

import React from 'react'
import App from './App'
import { RunProvider } from '../context/RunContext'
import { ProjectsProvider } from '../context/ProjectsContext'

export default function Home() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  return (
    <RunProvider>
      <ProjectsProvider>
        <App />
      </ProjectsProvider>
    </RunProvider>
  )
}
