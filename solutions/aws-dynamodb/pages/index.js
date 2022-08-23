import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

// Learn more about using SWR to fetch data from
// your API routes -> https://swr.vercel.app/
// This is a placeholder ID, you could swap out with real data
export default function App() {
  const { data, error } = useSWR(
    '/api/item?id=aee1700b-68d5-4afa-8e53-a52a56efeb73',
    fetcher
  );

  if (error) return 'An error has occurred.';
  if (!data) return 'Loading...';
  return <code>{JSON.stringify(data, null, 2)}</code>;
}
