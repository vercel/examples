import { useRouter } from 'next/router'

const AllowedPage: React.FC = () => {
  const {
    query: { country },
  } = useRouter()

  return <p>{`Greetings from ${country}, where you are not blocked.`}</p>
}

export default AllowedPage
