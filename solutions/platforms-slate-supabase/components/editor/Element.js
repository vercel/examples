export default function Element({ attributes, children, element }) {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'italic':
      return (
        <em className="italic" {...attributes}>
          {children}
        </em>
      )
    case 'underline':
      return (
        <p {...attributes} className="underline">
          {children}
        </p>
      )

    case 'heading-one':
      return (
        <h1 className="text-4xl" {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 className="text-2xl" {...attributes}>
          {children}
        </h2>
      )
    case 'code':
      return (
        <code className="bg-gray-50 p-2 m-2" {...attributes}>
          {children}
        </code>
      )

    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}
