const redirects = [
  {
    source: '/simple-redirect-source',
    destination: '/simple-redirect-destination',
    permanent: false,
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
  // we check if a redirect uses path matching to group our redirects into simple and complex
  // path matching: https://nextjs.org/docs/app/api-reference/next-config-js/redirects#path-matching
  if (redirectIsComplex(redirect)) {
    complexRedirects.push(redirect)
  } else {
    simpleRedirects.push(redirect)
  }
}

module.exports.simpleRedirects = simpleRedirects
module.exports.complexRedirects = complexRedirects
