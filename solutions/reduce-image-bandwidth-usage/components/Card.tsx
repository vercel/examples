import React from 'react'

interface Props {
  children: React.ReactElement
}

const Card: React.VFC<Props> = ({ children }: Props) => {
  return (
    <article className="shadow bg-white rounded h-64 w-64 relative">
      {children}
    </article>
  )
}

export default Card
