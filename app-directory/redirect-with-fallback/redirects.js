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

/**
 * Check if a path uses path matching
 * test path contains any of the following characters: :, (, {, ?, +, *.
 *
 * @param string path
 * @returns
 */
function pathIsComplex(path) {
  return /:|\(|\{|\?|\+|\*/.test(path)
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
