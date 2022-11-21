// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ key: "process.env.CMS_ENV", value: process.env.CMS_ENV })
}
