import supabase from '@/lib/supabase'

export default async function site(req, res) {
  switch (req.method) {
    case 'GET': {
      const { userId, siteId } = req.query
      if (siteId) {
        // get individual site
        const { siteId } = req.query

        const { data } = await supabase
          .from('site')
          .select('*')
          .eq('id', siteId)

        res.status(200).json(data[0])
      } else {
        // get all sites
        const { data } = await supabase
          .from('site')
          .select('*')
          .eq('userId', userId)
        res.status(200).json(data)
      }

      return
    }
    case 'POST': {
      // create site
      const { name, subdomain, description, userId } = req.body
      const sub = subdomain.replace(/[^a-zA-Z0-9/-]+/g, '')

      const { data } = await supabase.from('site').upsert({
        name,
        description,
        subdomain: sub.length > 0 ? sub : cuid(),
        logo: '/logo.png',
        image: `/placeholder.png`,
        userId,
      })

      res.status(200).json({ siteId: data[0].id })
      return
    }
    case 'DELETE': {
      // delete site
      const { siteId } = req.query

      await supabase.from('post').delete().match({ siteId: siteId })
      await supabase.from('site').delete().match({ id: siteId })

      res.status(200).end()
      return
    }
    case 'PUT': {
      // save site settings
      let {
        id,
        currentSubdomain,
        name,
        description,
        subdomain,
        image,
        imageBlurhash,
      } = req.body

      // processing subdomain
      const sub = subdomain.replace(/[^a-zA-Z0-9/-]+/g, '')
      subdomain = sub.length > 0 ? sub : currentSubdomain

      const { data } = await supabase.from('site').upsert({
        name,
        description,
        subdomain,
        image,
        imageBlurhash,
        id,
      })

      res.status(200).json(data[0])
    }
    default:
      res.status(405).end()
      return
  }
}
