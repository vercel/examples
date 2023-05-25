const redirects = [
  {
    source: '/simple-redirect-source',
    permanent: true,
    destination: '/simple-redirect-destination',
  },
  {
    source: '/:test/complex-redirect-source',

    destination: '/complex-redirect-destination',
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
