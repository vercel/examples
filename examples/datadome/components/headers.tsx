import { useState, useEffect } from 'react';

export default function Headers({ path }: { path: string }) {
  const [latency, setLatency] = useState(0);
  const [headers, setHeaders] = useState({
    'x-datadome': 'loading...',
    'x-datadome-latency': 'loading...',
  });

  useEffect(() => {
    const start = Date.now();
    fetch(path, { method: 'HEAD' }).then((res) => {
      if (res.ok) {
        setLatency(Math.round(Date.now() - start));
        setHeaders({
          'x-datadome': res.headers.get('x-datadome'),
          'x-datadome-latency': res.headers.get('x-datadome-latency'),
        });
      }
    });
  }, []);

  return (
    <div>
      <p>
        If we do a HEAD request to this page the response takes:{' '}
        <b>~{latency}ms</b>
      </p>
      <p>And the headers are:</p>
      <pre>{JSON.stringify(headers, null, 2)}</pre>
    </div>
  );
}
