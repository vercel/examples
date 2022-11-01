import { FC, useState } from 'react'
import Link from 'next/link'
import cn from 'classnames'
import s from './DropdownMenu.module.css'
import Avatar from '@components/ui/Avatar'

interface DropdownMenuProps {
  open?: boolean
}

const LINKS = [
  {
    name: 'My Orders',
    href: '/orders',
  },
  {
    name: 'My Profile',
    href: '/profile',
  },
  {
    name: 'My Cart',
    href: '/cart',
  },
]

const DropdownMenu: FC<DropdownMenuProps> = ({ open = false }) => {
  const [display, setDisplay] = useState(false)

  return (
    <div>
      <button
        className={s.avatarButton}
        onClick={() => setDisplay(!display)}
        aria-label="Menu"
      >
        <Avatar />
      </button>

      {display && (
        <ul className={s.dropdownMenu}>
          {LINKS.map(({ name, href }) => (
            <li key={href}>
              <div>
                <Link href={href} className={s.link}>
                  {name}
                </Link>
              </div>
            </li>
          ))}
          <li>
            <a className={cn(s.link, 'border-t border-accents-2 mt-4')}>
              Logout
            </a>
          </li>
        </ul>
      )}
    </div>
  )
}

export default DropdownMenu
