import { visit } from 'unist-util-visit'
import type { Literal, Node } from 'unist'
import { getTweets } from './twitter'

interface NodesToChange {
  node: Node
}

export function replaceTweets<T extends Node>() {
  return (tree: T) =>
    new Promise<void>(async (resolve, reject) => {
      const nodesToChange = new Array<NodesToChange>()

      visit(tree, 'text', (node: any) => {
        if (
          node.value.match(
            /https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)([^\?])(\?.*)?/g
          )
        ) {
          nodesToChange.push({
            node,
          })
        }
      })
      for (const { node } of nodesToChange) {
        try {
          const data = await getTweet(node as Literal<string>)

          node.type = 'mdxJsxFlowElement'
          // @ts-expect-error - Node is a generic type, but we are creating a JSX node here
          node.name = 'Tweet'
          // @ts-expect-error - Node is a generic type, but we are creating a JSX node here
          node.attributes = [
            {
              type: 'mdxJsxAttribute',
              name: 'id',
              value: data.id,
            },
            {
              type: 'mdxJsxAttribute',
              name: 'metadata',
              value: data.metadata,
            },
          ]
        } catch (e) {
          console.log('ERROR', e)
          return reject(e)
        }
      }

      resolve()
    })
}

async function getTweet(node: Literal<string>) {
  const regex = /\/status\/(\d+)/gm

  const matches = regex.exec(node.value)
  if (!matches) throw new Error(`Failed to get tweet: ${node}`)

  const id = matches[1]
  let tweetData = null
  try {
    tweetData = await getTweets(id)
  } catch (e) {
    console.log('ERROR', e)
  }
  return {
    id,
    metadata: JSON.stringify(tweetData),
  }
}
