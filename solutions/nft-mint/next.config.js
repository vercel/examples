const withTM = require('@vercel/examples-ui/transpile')()

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'xfnr2b9o4lok.usemoralis.com',
      'hang.mypinata.cloud',
      'gateway.pinata.cloud',
      'boonjiprojectcom.s3.us-east-2.amazonaws.com',
      'd1kjtx52rxv2sn.cloudfront.net',
      'link.us1.storjshare.io',
    ],
  },
})
