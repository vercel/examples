export default async function SaveSiteSettings(req, res) {
  const data = JSON.parse(req.body)

  await supabase
    .from('sites')
    .update({
      name: data.name,
      email: data.email,
      image: data.image,
    })
    .match({ id: data.id })

  res.status(200).json(response)
}
