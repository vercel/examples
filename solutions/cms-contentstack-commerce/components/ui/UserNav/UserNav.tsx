import type { FC } from 'react'
import cn from 'classnames'
import { Bag } from '@components/icons'

interface Props {
  className?: string
}

const UserNav: FC<Props> = ({ className }) => {
  return (
    <nav className={cn('relative', className)}>
      <div>
        <ul className="flex flex-row items-center justify-items-end h-full">
          <li className="mr-6 cursor-pointer relative transition ease-in-out duration-100 flex items-center outline-none text-black hover:text-accents-6 hover:scale-110 last:mr-0 focus:outline-none active:outline-none">
            <Bag />
            <span className="border border-accents-1 bg-black text-white h-4 w-4 absolute rounded-full right-3 top-3 flex items-center justify-center font-bold text-xs">
              2
            </span>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default UserNav
