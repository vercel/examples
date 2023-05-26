const redirects = [
  {
    source: '/simple-redirect-source',
    destination: '/simple-redirect-destination',
    permanent: true,
  },
  {
    source: '/complex-redirect-source/:path*',
    destination: '/complex-redirect-destination/:path*',
    permanent: false,
  },
]

function pathIsComplex(path) {
  // ignore trailing slash syntax
  const cleanPath = path.replace(/\{\/\}\?$/, '')
  return /:|\(|\{|\?|\+|\*/.test(cleanPath)
}

function redirectIsComplex(redirect) {
  return redirect.has || redirect.missing || pathIsComplex(redirect.source)
}

const simpleRedirects = []
const complexRedirects = []

for (const redirect of redirects) {
  if (redirectIsComplex(redirect)) {
    complexRedirects.push(redirect)
  } else {
    simpleRedirects.push(redirect)
  }
}

module.exports.simpleRedirects = simpleRedirects
module.exports.complexRedirects = complexRedirects
