export default function log(...args: any[]) {
  if (process.env.DEBUG !== '0') {
    console.log(...args)
  }
}
