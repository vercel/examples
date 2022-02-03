import { FC } from 'react'
import Link from 'next/link'
import cn from 'classnames'

import { Heart, Bag } from '@components/icons'
import DropdownMenu from './DropdownMenu'
import s from './UserNav.module.css'
import Avatar from '@components/ui/Avatar'

interface Props {
  className?: string
}

const UserNav: FC<Props> = ({ className, children, ...props }) => {
  return (
    <nav className={cn(s.root, className)}>
      <div className={s.mainContainer}>
        <ul className={s.list}>
          <li className={s.item}>
            <Bag />
            <span className={s.bagCount}>{20}</span>
          </li>
          <li className={s.item}>
            <Link href="/wishlist">
              <a aria-label="Wishlist">
                <Heart />
              </a>
            </Link>
          </li>
          <li className={s.item}>
            <button className={s.avatarButton} aria-label="Menu">
              <Avatar />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default UserNav
