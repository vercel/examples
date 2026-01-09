'use client'

import { useState } from 'react'

export default function Home() {
  const [getNodeId, setGetNodeId] = useState('')
  const [createNodeName, setCreateNodeName] = useState('')
  const [createNodeType, setCreateNodeType] = useState('')
  const [updateNodeId, setUpdateNodeId] = useState('')
  const [updateNodeName, setUpdateNodeName] = useState('')
  const [updateNodeType, setUpdateNodeType] = useState('')
  const [deleteNodeId, setDeleteNodeId] = useState('')
  const [edgeId, setEdgeId] = useState('')
  const [createEdgeSourceId, setCreateEdgeSourceId] = useState('')
  const [createEdgeTargetId, setCreateEdgeTargetId] = useState('')
  const [createEdgeType, setCreateEdgeType] = useState('')
  const [updateEdgeId, setUpdateEdgeId] = useState('')
  const [updateEdgeSourceId, setUpdateEdgeSourceId] = useState('')
  const [updateEdgeTargetId, setUpdateEdgeTargetId] = useState('')
  const [updateEdgeType, setUpdateEdgeType] = useState('')
  const [deleteEdgeId, setDeleteEdgeId] = useState('')
  const [nodeResult, setNodeResult] = useState('')
  const [edgeResult, setEdgeResult] = useState('')

  const fetchNode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/node?id=${getNodeId}`)
      const data = await response.json()
      setNodeResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setNodeResult(`Error: ${error}`)
    }
  }

  const createNode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: createNodeName, type: createNodeType })
      })
      const data = await response.json()
      setNodeResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setNodeResult(`Error: ${error}`)
    }
  }

  const updateNode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/node', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: updateNodeId, name: updateNodeName, type: updateNodeType })
      })
      const data = await response.json()
      setNodeResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setNodeResult(`Error: ${error}`)
    }
  }

  const deleteNode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/node?id=${deleteNodeId}`, { method: 'DELETE' })
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

  const createEdge = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/edge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromId: createEdgeSourceId, toId: createEdgeTargetId, type: createEdgeType })
      })
      const data = await response.json()
      setEdgeResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setEdgeResult(`Error: ${error}`)
    }
  }

  const updateEdge = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/edge', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: updateEdgeId, fromId: updateEdgeSourceId, toId: updateEdgeTargetId, type: updateEdgeType })
      })
      const data = await response.json()
      setEdgeResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setEdgeResult(`Error: ${error}`)
    }
  }

  const deleteEdge = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/edge?id=${deleteEdgeId}`, { method: 'DELETE' })
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
          value={getNodeId}
          onChange={(e) => setGetNodeId(e.target.value)}
          placeholder="Enter node ID"
          required
        />
        <button type="submit">Fetch Node</button>
      </form>

      <form onSubmit={createNode} style={{ marginBottom: '30px' }}>
        <h2>Create Node</h2>
        <input
          type="text"
          value={createNodeName}
          onChange={(e) => setCreateNodeName(e.target.value)}
          placeholder="Node name"
          required
        />
        <input
          type="text"
          value={createNodeType}
          onChange={(e) => setCreateNodeType(e.target.value)}
          placeholder="Node type"
          required
        />
        <button type="submit">Create Node</button>
      </form>

      <form onSubmit={updateNode} style={{ marginBottom: '30px' }}>
        <h2>Update Node</h2>
        <input
          type="text"
          value={updateNodeId}
          onChange={(e) => setUpdateNodeId(e.target.value)}
          placeholder="Node ID"
          required
        />
        <input
          type="text"
          value={updateNodeName}
          onChange={(e) => setUpdateNodeName(e.target.value)}
          placeholder="Node name"
          required
        />
        <input
          type="text"
          value={updateNodeType}
          onChange={(e) => setUpdateNodeType(e.target.value)}
          placeholder="Node type"
          required
        />
        <button type="submit">Update Node</button>
      </form>

      <form onSubmit={deleteNode} style={{ marginBottom: '30px' }}>
        <h2>Delete Node</h2>
        <input
          type="text"
          value={deleteNodeId}
          onChange={(e) => setDeleteNodeId(e.target.value)}
          placeholder="Enter node ID"
          required
        />
        <button type="submit">Delete Node</button>
      </form>

      <pre style={{ background: '#f5f5f5', padding: '10px', marginBottom: '30px' }}>
        {nodeResult}
      </pre>

      <form onSubmit={fetchEdge} style={{ marginBottom: '30px' }}>
        <h2>Get Edge</h2>
        <input
          type="text"
          value={edgeId}
          onChange={(e) => setEdgeId(e.target.value)}
          placeholder="Enter edge ID"
          required
        />
        <button type="submit">Fetch Edge</button>
      </form>

      <form onSubmit={createEdge} style={{ marginBottom: '30px' }}>
        <h2>Create Edge</h2>
        <input
          type="text"
          value={createEdgeSourceId}
          onChange={(e) => setCreateEdgeSourceId(e.target.value)}
          placeholder="Source node ID"
          required
        />
        <input
          type="text"
          value={createEdgeTargetId}
          onChange={(e) => setCreateEdgeTargetId(e.target.value)}
          placeholder="Target node ID"
          required
        />
        <input
          type="text"
          value={createEdgeType}
          onChange={(e) => setCreateEdgeType(e.target.value)}
          placeholder="Relationship type"
          required
        />
        <button type="submit">Create Edge</button>
      </form>

      <form onSubmit={updateEdge} style={{ marginBottom: '30px' }}>
        <h2>Update Edge</h2>
        <input
          type="text"
          value={updateEdgeId}
          onChange={(e) => setUpdateEdgeId(e.target.value)}
          placeholder="Edge ID"
          required
        />
        <input
          type="text"
          value={updateEdgeSourceId}
          onChange={(e) => setUpdateEdgeSourceId(e.target.value)}
          placeholder="Source node ID"
          required
        />
        <input
          type="text"
          value={updateEdgeTargetId}
          onChange={(e) => setUpdateEdgeTargetId(e.target.value)}
          placeholder="Target node ID"
          required
        />
        <input
          type="text"
          value={updateEdgeType}
          onChange={(e) => setUpdateEdgeType(e.target.value)}
          placeholder="Relationship type"
          required
        />
        <button type="submit">Update Edge</button>
      </form>

      <form onSubmit={deleteEdge} style={{ marginBottom: '30px' }}>
        <h2>Delete Edge</h2>
        <input
          type="text"
          value={deleteEdgeId}
          onChange={(e) => setDeleteEdgeId(e.target.value)}
          placeholder="Enter edge ID"
          required
        />
        <button type="submit">Delete Edge</button>
      </form>

      <pre style={{ background: '#f5f5f5', padding: '10px' }}>
        {edgeResult}
      </pre>
    </div>
  )
}
