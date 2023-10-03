export const config = {
  'runtime': 'edge'
};

export default function handler(req) {
  return Response.json({ location: req.headers.get('x-vercel-ip-city') || 'world' });
}
