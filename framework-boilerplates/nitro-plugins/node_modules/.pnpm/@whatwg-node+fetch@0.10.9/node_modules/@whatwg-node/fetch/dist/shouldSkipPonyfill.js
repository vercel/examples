
function isNextJs() {
  return Object.keys(globalThis).some(key => key.startsWith('__NEXT'))
}

module.exports = function shouldSkipPonyfill() {
  if (globalThis.Deno) {
    return true
  }
  if (globalThis.Bun) {
    return true
  }
  if (isNextJs()) {
    return true
  }
  return false
}