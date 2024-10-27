import React, { PropsWithChildren } from 'react'
import Link from 'next/link'
import Image, { ImageProps } from 'next/image'
import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import { serialize } from 'next-mdx-remote/serialize'

function Table({ data }: { data: { headers: React.ReactNode[]; rows: React.ReactNode[][] } }) {
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

function CustomLink({ href, children, ...props }: React.LinkHTMLAttributes<HTMLAnchorElement>) {
  if (href?.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  if (href?.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props: ImageProps) {
  return (
    <Image 
      {...props} 
      alt={props.alt} 
      className="rounded-lg"  
    />
  )
}

function Code({ children, ...props }: PropsWithChildren) {
  let codeHTML = highlight(children?.toString() ?? "")
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level: number) {
  const Heading = ({ children }: PropsWithChildren) => {
    let slug = slugify(children?.toString() ?? '')
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

export default async function CustomMDX(
  props: MDXRemoteProps
) {
  const serializedSource = await serialize(props.source)

  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      {...serializedSource}
    />
  )
}
