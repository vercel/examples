import { NextResponse } from 'next/server'
import * as NG from '@aws-sdk/client-neptune-graph'

const client = new NG.NeptuneGraphClient({})
const GRAPH_ID = process.env.GRAPH_ID

if (!GRAPH_ID) {
  throw new Error('GRAPH_ID environment variable is required')
}

/**
 * Execute Neptune Analytics query with parameters
 */
async function executeQuery(
  queryString: string,
  parameters: Record<string, any>
) {
  const input = {
    graphIdentifier: GRAPH_ID,
    queryString,
    language: NG.QueryLanguage.OPEN_CYPHER,
    parameters,
  }

  const cmd = new NG.ExecuteQueryCommand(input)
  const response = await client.send(cmd)
  const responseStr = await response.payload.transformToString()
  return JSON.parse(responseStr)
}

/**
 * Handle errors with consistent logging and response format
 */
function handleError(error: any, method: string) {
  console.error(`${method} /api/edge error:`, error)
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

/**
 * Validate ID parameter from query string
 */
function validateId(id: string | null) {
  if (!id) {
    return NextResponse.json(
      { error: 'id parameter is required' },
      { status: 400 }
    )
  }
  return null
}

/**
 * Validate request body contains required fields for edge creation
 */
function validateEdgeBody(body: any) {
  if (!body?.fromId || !body?.toId || !body?.type) {
    return NextResponse.json(
      { error: 'Request body with fromId, toId, and type is required' },
      { status: 400 }
    )
  }
  return null
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const error = validateId(id)
    if (error) return error

    const result = await executeQuery(
      'MATCH()-[r]->() WHERE id(r) = $EDGE_ID RETURN r',
      { EDGE_ID: id }
    )

    return NextResponse.json(result)
  } catch (error) {
    return handleError(error, 'GET')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const error = validateEdgeBody(body)
    if (error) return error

    const { fromId, toId, type, ...properties } = body

    const result = await executeQuery(
      'MATCH (from), (to) WHERE id(from) = $FROM_ID AND id(to) = $TO_ID CREATE (from)-[r:' +
        type +
        ']->(to) SET r += $PROPERTIES RETURN r',
      { FROM_ID: fromId, TO_ID: toId, PROPERTIES: properties }
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return handleError(error, 'POST')
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body?.id) {
      return NextResponse.json(
        { error: 'Request body with id is required' },
        { status: 400 }
      )
    }

    const { id, ...properties } = body

    const result = await executeQuery(
      'MATCH()-[r]->() WHERE id(r) = $EDGE_ID SET r = $PROPERTIES RETURN r',
      { EDGE_ID: id, PROPERTIES: properties }
    )

    return NextResponse.json(result)
  } catch (error) {
    return handleError(error, 'PUT')
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const error = validateId(id)
    if (error) return error

    const result = await executeQuery(
      'MATCH()-[r]->() WHERE id(r) = $EDGE_ID DELETE r',
      { EDGE_ID: id }
    )

    return NextResponse.json(result)
  } catch (error) {
    return handleError(error, 'DELETE')
  }
}
