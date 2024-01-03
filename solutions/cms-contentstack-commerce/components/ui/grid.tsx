import type { ReactNode } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

export interface GridEntity {
  grid: GridData
}

export interface GridData {
  item: ItemData
}

export interface ItemData {
  title: string
  description: string
  link: LinkData
  img?: any
}

export interface LinkData {
  title: string
  url: string
}

export interface DataProps {
  title?: string
  description?: string
  grid?: GridData[]
}

interface Props {
  className?: string
  children?: ReactNode
  variant?: 'cols4' | string
  data?: DataProps
}

export const Grid = ({ className, children, variant, data }: Props) => {
  const rootClassName = clsx(
    'grid grid-cols-1 mb-6 gap-3 lg:grid-cols-3 lg:overflow-hidden',
    variant === 'cols4' && 'lg:grid-cols-4',
    className
  )

  // If it contains data we build the childrens.
  if (!data?.grid) return <div className={rootClassName}>{children}</div>

  const meassureProps =
    variant === 'cols4'
      ? {
          width: 263,
          height: 365,
        }
      : {
          width: 365,
          height: 365,
        }

  return (
    <div>
      <div className="text-center my-12">
        {data.title && (
          <h2 className="mb-2 text-4xl font-semibold tracking-wide uppercase">
            {data.title}
          </h2>
        )}
        {data.description && <p className="">{data.description}</p>}
      </div>
      <div className={rootClassName}>
        {data.grid.map(({ item }, i) => (
          <div
            className="flex flex-col items-center text-center mb-10"
            key={`item__${i}`}
          >
            <div className="mb-2">
              {item.img.url && (
                <Image
                  src={item.img.url}
                  alt={item.img.title}
                  {...meassureProps}
                />
              )}
            </div>
            {item.title && (
              <h2 className="mb-2 text-lg font-medium tracking-wide uppercase">
                {item.title}
              </h2>
            )}
            {item.description && (
              <div
                className="mb-2 px-4"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            )}
            <Link
              href={item!.link.url ? item!.link.url : '/'}
              className="mt-4 uppercase font-semibold tracking-wide
          text-xs text-slate-900 bg-white rounded-full
          px-4 py-3 border  border-slate-400 hover:border-black
          transition ease-linear duration-150"
            >
              {item!.link.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
