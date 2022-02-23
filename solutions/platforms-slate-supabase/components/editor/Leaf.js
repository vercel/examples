import Highlight from 'react-highlight'

export default function Leaf({ attributes, children, leaf }) {
  if (leaf.bold) {
    children = <strong className="font-bold">{children}</strong>
  }

  if (leaf.code) {
    children = <code className="bg-grey-50">{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf['heading-one']) {
    children = <h1 className="text-4xl">{children}</h1>
  }

  if (leaf['heading-two']) {
    children = <h2 className="text-2xl">{children}</h2>
  }

  return <span {...attributes}>{children}</span>
}
