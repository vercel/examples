import type { FC, ReactNode } from 'react'
import cn from 'classnames'
import { Bag } from '@components/icons'
import s from './UserNav.module.css'

interface Props {
  className?: string
}

const UserNav: FC<Props> = ({ className }) => {
  return (
    <nav className={cn(s.root, className)}>
      <div className={s.mainContainer}>
        <ul className={s.list}>
          <li className={s.item}>
            <Bag />
            <span className={s.bagCount}>{2}</span>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default UserNav
