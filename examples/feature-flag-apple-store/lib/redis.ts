interface Response {
  result: string;
}

export default async function get(key) {
  const req = await fetch(
    `https://us1-perfect-amoeba-34886.upstash.io/get/${key}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_SECRET}`,
      },
    }
  );

  const response: Response = await req.json();
  return response.result === 'true';
}
