const fetcher = async (...args) => {
  const res = await fetch(...args)
  const json = await res.json()
  if (res.status === 200) {
    return json
  } else {
    const error = new Error(`${res.status}: ${json.error.message}`)
    error.error = json.error
    throw error
  }
}

export default fetcher
