// @ts-ignore
let nodeFetch: (...args) => Promise<Response> = null;
try {
  var webpackBypass = '';
  nodeFetch = require(`node-fetch${webpackBypass}`);
} catch (err) {
  // Ignore
}

// @ts-ignore
export default function safeFetch(...args): Promise<Response> {
  if (nodeFetch) {
    return nodeFetch(...args);
  } else {
    // @ts-ignore
    return fetch(...args);
  }
}
