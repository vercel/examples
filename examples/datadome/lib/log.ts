export default async function log(...log: any[]) {
  const str = log.map((l) => l.toString()).join(' ');
  const domain = process.env.UPSTASH_REST_API_DOMAIN;
  const token = process.env.UPSTASH_REST_API_KEY;

  if (!domain || !token) {
    console.log('*[log]', str);
    // Logging with Upstash is disabled
    return;
  }

  console.log('[log]', str);

  try {
    const res = await fetch(`https://${domain}`, {
      method: 'POST',
      body: JSON.stringify(['RPUSH', 'logs', str]),
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(
        `Logging error: ${res.headers.get('content-type')} (${res.status}) ${
          res.statusText
        }`
      );
    }
  } catch (err) {
    console.error('Logging error', err);
  }
}
