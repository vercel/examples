import Link from 'next/link'
import Image from 'next/image'
import { highlight } from 'sugar-high'
import React from 'react'

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
}

function parseMarkdown(content: string): string {
  // Handle code blocks first
  content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const highlighted = highlight(code.trim())
    return `<pre><code class="language-${lang || 'text'}">${highlighted}</code></pre>`
  })
  
  // Handle other markdown
  return content
    .replace(/^### (.*$)/gm, '<h3 id="$1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 id="$1">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 id="$1">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .split('\n\n')
    .map(para => para.trim())
    .filter(para => para)
    .map(para => {
      if (para.startsWith('<h') || para.startsWith('<pre>')) {
        return para
      }
      return `<p>${para}</p>`
    })
    .join('\n')
}

export function CustomMDX(props) {
  const htmlContent = parseMarkdown(props.source)
  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: htmlContent }} />
  )
}
