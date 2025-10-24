'use client'

import { useState } from 'react'

export default function Home() {
  const [nodeId, setNodeId] = useState('')
  const [edgeId, setEdgeId] = useState('')
  const [nodeResult, setNodeResult] = useState('')
  const [edgeResult, setEdgeResult] = useState('')

  const fetchNode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/node?id=${nodeId}`)
      const data = await response.json()
      setNodeResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setNodeResult(`Error: ${error}`)
    }
  }

  const fetchEdge = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/edge?id=${edgeId}`)
      const data = await response.json()
      setEdgeResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setEdgeResult(`Error: ${error}`)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Neptune Analytics Graph Query</h1>
      
      <form onSubmit={fetchNode} style={{ marginBottom: '30px' }}>
        <h2>Get Node</h2>
        <input
          type="text"
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
          placeholder="Enter node ID"
          required
        />
        <button type="submit">Fetch Node</button>
        <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
          {nodeResult}
        </pre>
      </form>

      <form onSubmit={fetchEdge}>
        <h2>Get Edge</h2>
        <input
          type="text"
          value={edgeId}
          onChange={(e) => setEdgeId(e.target.value)}
          placeholder="Enter edge ID"
          required
        />
        <button type="submit">Fetch Edge</button>
        <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
          {edgeResult}
        </pre>
      </form>
    </div>
  )
}
