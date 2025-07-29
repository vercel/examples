export default defineCachedEventHandler(async () => {
  return `Response generated at ${new Date().toISOString()}`
})
