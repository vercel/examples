export const getContent = async () => {
  try {
    const req = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json',
      },
    })
    const res = await req.json()

    return res.joke as string
  } catch (e) {
    return `No joke for you today, API is down.  Instead here is a random number ${Math.floor(
      Math.random() * 100
    )}`
  }
}
