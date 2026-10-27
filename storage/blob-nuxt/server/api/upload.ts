import { put } from '@vercel/blob'

import formidable from 'formidable';

/**
 * @see https://nuxt.com/docs/guide/concepts/server-engine
 * @see https://github.com/unjs/h3
 */
export default defineEventHandler(async (event) => {
  let body;
  const headers = getRequestHeaders(event);

  if (headers['content-type']?.includes('multipart/form-data')) {
    body = await parseMultipartNodeRequest(event.node.req);
  } else {
    body = await readBody(event);
  }
  console.log(body);
  const { url } = await put('Test.png', body, { access: 'public' })
  return { url };
});

/**
 * @param {import('http').IncomingMessage} req
 */
function parseMultipartNodeRequest(req) {
  return new Promise((resolve, reject) => {
    /** @see https://github.com/node-formidable/formidable/ */
    const form = formidable({ multiples: true })
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ ...fields, ...files });
    });
  });
}


// function doSomethingWithNodeRequest(req) {
//   return new Promise((resolve, reject) => {
//     /** @type {any[]} */
//     const chunks = [];
//     req.on('data', (data) => {
//       chunks.push(data);
//     });
//     req.on('end', () => {
//       const payload = Buffer.concat(chunks).toString()
//       resolve(payload);
//     });
//     req.on('error', reject);
//   });
// }

// export default defineEventHandler(async (event) => {
//   const body = await doSomethingWithNodeRequest(event.node.req);
//   console.log(body)
//   const { url } = await put('Test.png', body, { access: 'public' })
//   return { url }
// })
