import React, { FC } from 'react'
import Image from 'next/image'
import s from './Hero.module.css'
import cn from 'classnames'
import Link from 'next/link'

interface Props {
  variant?: 'slim' | 'to-r' | string
  data?: any
  priority?: boolean
}

const Hero: FC<Props> = ({ data, variant, priority = false }) => {
  if (variant === 'to-r') {
    return (
      <div className={s.toR} style={{ height: '467px' }}>
        {data.background_image ? (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              className="object-fill"
              alt="img"
              src={data.background_image}
              layout="fill"
              quality="75"
              priority={priority}
            />
          </div>
        ) : null}
        <div className="flex-1" />
        <div className="flex flex-1 flex-col items-center justify-center z-10 bg-gray-50 md:bg-transparent p-6 m-6 md:p-0 md:m-0">
          {data.title && (
            <h2 className="mb-2 text-lg font-medium tracking-wide text-center">
              {data.title}
            </h2>
          )}
          <div
            className={cn(s.description)}
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
          {data.link && (
            <Link
              href={
                data.link.url ? data.link.url : 'https://www.chicos.com/store/'
              }
              passHref
            >
              <a className="uppercase font-semibold tracking-wide underline text-sm">
                {data.link.title}
              </a>
            </Link>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'slim') {
    const styleProps = data.background_image
      ? {
          minHeight: '220px',
        }
      : {}

    return (
      <div
        className="py-4 relative text-center mb-4 text-white bg-gradient-to-r from-red-dark to-red-light"
        style={styleProps}
      >
        {data.background_image ? (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ height: 220 }}
          >
            <Image
              className="object-fill"
              alt="img"
              src={data.background_image}
              layout="fill"
              quality="75"
              priority={priority}
            />
          </div>
        ) : null}
        <div className="relative z-10 text-center my-2 mx-6">
          <h2 className="mb-2 text-lg font-medium tracking-wide">
            {data.title}
          </h2>
          <div
            className={cn(s.description, 'mb-2 text-center')}
            dangerouslySetInnerHTML={{ __html: data.description }}
          />

          <Link
            href={
              data.link.url ? data.link.url : 'https://www.chicos.com/store/'
            }
            passHref
          >
            <a className="uppercase font-semibold tracking-wide underline text-sm">
              {data.link.title}
            </a>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex items-center justify-center text-center mb-4 bg-red"
      style={{ height: '467px' }}
    >
      {data.background_image ? (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            className="object-cover"
            alt="img"
            src={data.background_image}
            layout="fill"
            priority
          />
        </div>
      ) : null}
      <div className="bg-white p-6 m-6 w-96 z-10">
        <h2 className="text-lg uppercase px-12 mb-2">{data.title}</h2>
        <p
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
        <Link
          href={data.link.url ? data.link.url : 'https://www.chicos.com/store/'}
          passHref
        >
          <a className="uppercase font-semibold tracking-wide underline text-sm">
            {data.link.title}
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Hero
// export default () => null
