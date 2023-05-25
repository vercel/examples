const redirects = [
  {
    source: '/simple-redirect-suorce',
    permanent: true,
    destination: '/simple-redirect-destination',
  },
  {
    source: 'complex-redirect-suorce',
    has: [
      {
        type: 'cookie',
        key: 'authorization',
      },
    ],
    destination: '/complex-redirect-destination',
    permanent: false,
  },
]

const simpleRedirects = []
const complexRedirects = []
for (const redirect of redirects) {
  if (
    redirect.has ||
    redirect.missing ||
    /:|\(|\{|\?|\+|\*/.test(
      redirect.source./* ignore trailing slash syntax */ replace(
        /\{\/\}\?$/,
        ''
      )
    )
  ) {
    complexRedirects.push(redirect)
  } else {
    simpleRedirects.push(redirect)
  }
}

module.exports.simpleRedirects = simpleRedirects
module.exports.complexRedirects = complexRedirects
