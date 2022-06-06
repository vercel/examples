export default function Index() {
  return null
}

export async function getServerSideProps({ req, res }) {
  res.setHeader('WWW-authenticate', 'Basic realm="Secure Area"')
  res.statusCode = 401

  return {
    props: {},
  }
}
