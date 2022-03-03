import supabase from '@/lib/supabase'

export default async function checkSubdomain(req, res) {
  const { subdomain } = req.query
  const sub = subdomain.replace(/[^a-zA-Z0-9/-]+/g, '')

  const { data } = await supabase
    .from('site')
    .select('subdomain')
    .eq('subdomain', sub)

  const available = data.length === 0 && sub.length !== 0

  res.status(200).json(available)
}
