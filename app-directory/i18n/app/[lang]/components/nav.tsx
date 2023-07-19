import Image from 'next/image'
import Link from 'next/link'

const Nav = () => (
  <nav className="flex gap-2 mb-4">
    <Link href="/en" scroll={false}>
      <Image
        alt="US Flag"
        height={18}
        src="https://flag.vercel.app/m/US.svg"
        width={24}
      />
    </Link>
    <Link href="/es" scroll={false}>
      <Image
        alt="ES Flag"
        height={18}
        src="https://flag.vercel.app/m/ES.svg"
        width={24}
      />
    </Link>
    <Link href="/de" scroll={false}>
      <Image
        alt="DE Flag"
        height={18}
        src="https://flag.vercel.app/m/DE.svg"
        width={24}
      />
    </Link>
  </nav>
)

export default Nav
