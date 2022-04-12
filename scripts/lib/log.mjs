export default function log(...args) {
  if (process.env.DEBUG !== '0') {
    console.log(...args)
  }
}
