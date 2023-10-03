import { GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

interface Props {
  country: string
}

interface Params extends ParsedUrlQuery {
  country: string
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params: { country },
}) => {
  return {
    props: {
      country,
    },
  }
}

const AllowedPage = ({ country }: Props) => {
  return <p>{`Greetings from ${country}, where you are not blocked.`}</p>
}

export default AllowedPage
