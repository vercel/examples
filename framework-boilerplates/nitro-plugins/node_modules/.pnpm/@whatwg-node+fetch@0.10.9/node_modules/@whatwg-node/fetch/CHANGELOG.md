# @whatwg-node/fetch

## 0.10.9

### Patch Changes

- [#2553](https://github.com/ardatan/whatwg-node/pull/2553)
  [`752b0eb`](https://github.com/ardatan/whatwg-node/commit/752b0ebdc88654ef4ae1e13eb860980f437b4110)
  Thanks [@renovate](https://github.com/apps/renovate)! - Fix the conflict of urlpattern-ponyfill
  and \`@types/node\`

- Updated dependencies
  [[`b69157b`](https://github.com/ardatan/whatwg-node/commit/b69157bd97aba8fb4c761f8d16afc549c35acfa0)]:
  - @whatwg-node/node-fetch@0.7.22

## 0.10.8

### Patch Changes

- [#2424](https://github.com/ardatan/whatwg-node/pull/2424)
  [`28c4ad9`](https://github.com/ardatan/whatwg-node/commit/28c4ad98aad3ec95a1f0893c54f5484d8564f675)
  Thanks [@ardatan](https://github.com/ardatan)! - Performance optimizations
  - Avoid creating `AbortController` and `AbortSignal` if not needed with `new Request` because it
    is expensive
  - Avoid creating a map for `Headers` and try to re-use the init object for `Headers` for
    performance with a single-line `writeHead`.
  - Avoid creating `Buffer` for `string` bodies for performance
  - Use `setHeaders` which accepts `Headers` since Node 18 if needed to forward `Headers` to Node

- Updated dependencies
  [[`28c4ad9`](https://github.com/ardatan/whatwg-node/commit/28c4ad98aad3ec95a1f0893c54f5484d8564f675)]:
  - @whatwg-node/node-fetch@0.7.21

## 0.10.7

### Patch Changes

- [#2383](https://github.com/ardatan/whatwg-node/pull/2383)
  [`9527e8f`](https://github.com/ardatan/whatwg-node/commit/9527e8fe2dc73e362b38060f4a6decbb87a4f597)
  Thanks [@ardatan](https://github.com/ardatan)! - Some implementations like `compression` npm
  package do not implement `response.write(data, callback)` signature, but whatwg-node/server waits
  for it to finish the response stream. Then it causes the response stream hangs when the
  compression package takes the stream over when the response data is larger than its threshold.

  It is actually a bug in `compression` package;
  [expressjs/compression#46](https://github.com/expressjs/compression/issues/46) But since it is a
  common mistake, we prefer to workaround this on our end.

  Now after calling `response.write`, it no longer uses callback but first it checks the result;

  if it is `true`, it means stream is drained and we can call `response.end` immediately. else if it
  is `false`, it means the stream is not drained yet, so we can wait for the `drain` event to call
  `response.end`.

- Updated dependencies
  [[`9527e8f`](https://github.com/ardatan/whatwg-node/commit/9527e8fe2dc73e362b38060f4a6decbb87a4f597)]:
  - @whatwg-node/node-fetch@0.7.19

## 0.10.6

### Patch Changes

- [#2310](https://github.com/ardatan/whatwg-node/pull/2310)
  [`f699a1b`](https://github.com/ardatan/whatwg-node/commit/f699a1ba1558f98406f5844a31c07f77d874eb9b)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - dependencies updates:
  - Updated dependency
    [`@whatwg-node/node-fetch@^0.7.18` ↗︎](https://www.npmjs.com/package/@whatwg-node/node-fetch/v/0.7.18)
    (from `^0.7.11`, in `dependencies`)

## 0.10.5

### Patch Changes

- [#2093](https://github.com/ardatan/whatwg-node/pull/2093)
  [`31f021a`](https://github.com/ardatan/whatwg-node/commit/31f021ac5df1ddd7f16807d4ed6c5776d250ab29)
  Thanks [@ardatan](https://github.com/ardatan)! - Fixes the
  `TypeError: bodyInit.stream is not a function` error thrown when `@whatwg-node/server` is used
  with `node:http2` and attempts the incoming HTTP/2 request to parse with `Request.json`,
  `Request.text`, `Request.formData`, or `Request.blob` methods.

- Updated dependencies
  [[`31f021a`](https://github.com/ardatan/whatwg-node/commit/31f021ac5df1ddd7f16807d4ed6c5776d250ab29)]:
  - @whatwg-node/node-fetch@0.7.11

## 0.10.4

### Patch Changes

- [#2082](https://github.com/ardatan/whatwg-node/pull/2082)
  [`b217e30`](https://github.com/ardatan/whatwg-node/commit/b217e305b5a5d63e164cf83ef45e7d1e95fefa0e)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency
    [`@whatwg-node/node-fetch@^0.7.9` ↗︎](https://www.npmjs.com/package/@whatwg-node/node-fetch/v/0.7.9)
    (from `^0.7.8`, in `dependencies`)

- [#2079](https://github.com/ardatan/whatwg-node/pull/2079)
  [`090b4b0`](https://github.com/ardatan/whatwg-node/commit/090b4b0d2aefbf36707fa236395bc6ea99227b9c)
  Thanks [@ardatan](https://github.com/ardatan)! - Fix the bug when `set-cookies` given is ignored
  in `HeadersInit`;

  ```js
  import { Headers } from '@whatwg-node/fetch'

  const headers = new Headers([
    ['set-cookie', 'a=b'],
    ['set-cookie', 'c=d']
  ])
  expect(headers.getSetCookie()).toEqual(['a=b', 'c=d']) // Previously it was empty
  ```

- Updated dependencies
  [[`090b4b0`](https://github.com/ardatan/whatwg-node/commit/090b4b0d2aefbf36707fa236395bc6ea99227b9c)]:
  - @whatwg-node/node-fetch@0.7.10

## 0.10.3

### Patch Changes

- [#1961](https://github.com/ardatan/whatwg-node/pull/1961)
  [`2785c80`](https://github.com/ardatan/whatwg-node/commit/2785c80be2c887c581ef0fac8150befeab306eba)
  Thanks [@ardatan](https://github.com/ardatan)! - `ReadableStream`'s `Symbol.asyncIterator` now
  returns `AsyncIterableIterator` like before even if it is ok to return `AsyncIterator` right now.
  It is safer to return `AsyncIterableIterator` because it is a common mistake to use
  `AsyncIterator` as `AsyncIterable`.
- Updated dependencies
  [[`2785c80`](https://github.com/ardatan/whatwg-node/commit/2785c80be2c887c581ef0fac8150befeab306eba)]:
  - @whatwg-node/node-fetch@0.7.7

## 0.10.2

### Patch Changes

- [#1929](https://github.com/ardatan/whatwg-node/pull/1929)
  [`b88b85c`](https://github.com/ardatan/whatwg-node/commit/b88b85c301923719f4722bdfe070728725bcc1b5)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency
    [`@whatwg-node/node-fetch@^0.7.5` ↗︎](https://www.npmjs.com/package/@whatwg-node/node-fetch/v/0.7.5)
    (from `^0.7.1`, in `dependencies`)
- Updated dependencies
  [[`b88b85c`](https://github.com/ardatan/whatwg-node/commit/b88b85c301923719f4722bdfe070728725bcc1b5),
  [`9b39c3e`](https://github.com/ardatan/whatwg-node/commit/9b39c3e5db616a60e6dd8472fbd651f4905f3673),
  [`b88b85c`](https://github.com/ardatan/whatwg-node/commit/b88b85c301923719f4722bdfe070728725bcc1b5)]:
  - @whatwg-node/node-fetch@0.7.6

## 0.10.1

### Patch Changes

- [`c68f5ad`](https://github.com/ardatan/whatwg-node/commit/c68f5ad0782476b4b4facf490600b5f3341a4886)
  Thanks [@ardatan](https://github.com/ardatan)! - Pass errors to ReadableStream's cancel method
  properly when it is piped, and piped stream is cancelled

  Implement `ReadableStream.from`

- Updated dependencies
  [[`c68f5ad`](https://github.com/ardatan/whatwg-node/commit/c68f5ad0782476b4b4facf490600b5f3341a4886)]:
  - @whatwg-node/node-fetch@0.7.1

## 0.10.0

### Minor Changes

- [#1782](https://github.com/ardatan/whatwg-node/pull/1782)
  [`6c006e1`](https://github.com/ardatan/whatwg-node/commit/6c006e12eaa6705cdf20b7b43cccc44a1f7ea185)
  Thanks [@ardatan](https://github.com/ardatan)! - \`TextDecoderStream\` and \`TextEncoderStream\`

### Patch Changes

- Updated dependencies
  [[`6c006e1`](https://github.com/ardatan/whatwg-node/commit/6c006e12eaa6705cdf20b7b43cccc44a1f7ea185)]:
  - @whatwg-node/node-fetch@0.7.0

## 0.9.23

### Patch Changes

- Updated dependencies
  [[`637185f`](https://github.com/ardatan/whatwg-node/commit/637185f5c992ccabff13b185d4e14f09680228da)]:
  - @whatwg-node/node-fetch@0.6.0

## 0.9.22

### Patch Changes

- [`77dd1c3`](https://github.com/ardatan/whatwg-node/commit/77dd1c3acde29aeb828b6eb37b6fbdbb47a16c57)
  Thanks [@ardatan](https://github.com/ardatan)! - Use \`globalThis\` instead of \`window\` for the
  global object reference

  Fixes the issues with Deno

- Updated dependencies
  [[`9281e02`](https://github.com/ardatan/whatwg-node/commit/9281e021282a43a3dda8c8a5c9647d340b28698e)]:
  - @whatwg-node/node-fetch@0.5.27

## 0.9.21

### Patch Changes

- [#1577](https://github.com/ardatan/whatwg-node/pull/1577)
  [`99c4344`](https://github.com/ardatan/whatwg-node/commit/99c4344ec82717be079e725538a532a827fbef82)
  Thanks [@ardatan](https://github.com/ardatan)! - - Improve native ReadableStream handling inside
  ponyfills
  - Use `waitUntil` instead of floating promises
  - Handle early termination in `WritableStream`
  - Handle `waitUntil` correctly within a dummy call of `ServerAdapter.fetch` method
- Updated dependencies
  [[`99c4344`](https://github.com/ardatan/whatwg-node/commit/99c4344ec82717be079e725538a532a827fbef82)]:
  - @whatwg-node/node-fetch@0.5.23

## 0.9.20

### Patch Changes

- [#1566](https://github.com/ardatan/whatwg-node/pull/1566)
  [`de1e95a`](https://github.com/ardatan/whatwg-node/commit/de1e95a8eb107083e638aa8472089b96b33bbe4a)
  Thanks [@ardatan](https://github.com/ardatan)! - Avoid constructing DecompressionStream to check
  supported encodings

- Updated dependencies
  [[`de1e95a`](https://github.com/ardatan/whatwg-node/commit/de1e95a8eb107083e638aa8472089b96b33bbe4a)]:
  - @whatwg-node/node-fetch@0.5.22

## 0.9.19

### Patch Changes

- [#1495](https://github.com/ardatan/whatwg-node/pull/1495)
  [`bebc159`](https://github.com/ardatan/whatwg-node/commit/bebc159e0a470a0ea89a8575f620ead3f1b6b594)
  Thanks [@ardatan](https://github.com/ardatan)! - Implement \`CompressionStream\`,
  \`WritableStream\` and \`TransformStream\`

- Updated dependencies
  [[`bebc159`](https://github.com/ardatan/whatwg-node/commit/bebc159e0a470a0ea89a8575f620ead3f1b6b594)]:
  - @whatwg-node/node-fetch@0.5.16

## 0.9.18

### Patch Changes

- [#1328](https://github.com/ardatan/whatwg-node/pull/1328)
  [`36904b4`](https://github.com/ardatan/whatwg-node/commit/36904b46871aaf823055eb05fbd8969453cba9ae)
  Thanks [@ardatan](https://github.com/ardatan)! - Add `skipPonyfill` flag to `createFetch` to skip
  ponyfills and use the native Fetch implementation for Node.js

## 0.9.17

### Patch Changes

- [#1162](https://github.com/ardatan/whatwg-node/pull/1162)
  [`0c6e9ca`](https://github.com/ardatan/whatwg-node/commit/0c6e9ca61ee07b49009b6e4d7d9d5e1d80912450)
  Thanks [@ardatan](https://github.com/ardatan)! - Consume the body with PassThrough

- Updated dependencies
  [[`0c6e9ca`](https://github.com/ardatan/whatwg-node/commit/0c6e9ca61ee07b49009b6e4d7d9d5e1d80912450)]:
  - @whatwg-node/node-fetch@0.5.7

## 0.9.16

### Patch Changes

- [#1102](https://github.com/ardatan/whatwg-node/pull/1102)
  [`d9800cc`](https://github.com/ardatan/whatwg-node/commit/d9800cc1693ceae7893e08cf5a3a4bcc49f0f9d5)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency
    [`urlpattern-polyfill@^10.0.0` ↗︎](https://www.npmjs.com/package/urlpattern-polyfill/v/10.0.0)
    (from `^9.0.0`, in `dependencies`)
- Updated dependencies
  [[`45ec735`](https://github.com/ardatan/whatwg-node/commit/45ec735bd3081f42221bdccb70692b420ce16efa),
  [`a129376`](https://github.com/ardatan/whatwg-node/commit/a1293766bcf8d2465844aec1d80957e2af1b16f1)]:
  - @whatwg-node/node-fetch@0.5.5

## 0.9.15

### Patch Changes

- [`772552c`](https://github.com/ardatan/whatwg-node/commit/772552c0521b883c30d8f4d64c8ea093e75a95a0)
  Thanks [@ardatan](https://github.com/ardatan)! - Skip ponyfilling if NextJS

## 0.9.14

### Patch Changes

- [`68ac24c`](https://github.com/ardatan/whatwg-node/commit/68ac24c342bf2215450bb910c2132f6db0b62993)
  Thanks [@ardatan](https://github.com/ardatan)! - Support TypeScript 5.2.2

- Updated dependencies
  [[`f7e507f`](https://github.com/ardatan/whatwg-node/commit/f7e507f6565a1f9cd50fc8c01594ce21205a05dd)]:
  - @whatwg-node/node-fetch@0.5.0

## 0.9.13

### Patch Changes

- [`854b778`](https://github.com/ardatan/whatwg-node/commit/854b7786f4ef134a00a4f8f4df02721a7a4c77bb)
  Thanks [@ardatan](https://github.com/ardatan)! - Do not try to import node-libcurl in Deno and Bun

## 0.9.12

### Patch Changes

- [`a8467ab`](https://github.com/ardatan/whatwg-node/commit/a8467ab9e3e4701eb0d3101ff904597cd9adc438)
  Thanks [@ardatan](https://github.com/ardatan)! - Fake promise's then method may not take a
  callback function

- Updated dependencies
  [[`a8467ab`](https://github.com/ardatan/whatwg-node/commit/a8467ab9e3e4701eb0d3101ff904597cd9adc438)]:
  - @whatwg-node/node-fetch@0.4.17

## 0.9.11

### Patch Changes

- [`96efb10`](https://github.com/ardatan/whatwg-node/commit/96efb10a4508fa1b86482f5238d63ec6015e0d74)
  Thanks [@ardatan](https://github.com/ardatan)! - Ignore content-length while reading the request
  body

- Updated dependencies
  [[`96efb10`](https://github.com/ardatan/whatwg-node/commit/96efb10a4508fa1b86482f5238d63ec6015e0d74)]:
  - @whatwg-node/node-fetch@0.4.16

## 0.9.10

### Patch Changes

- [#806](https://github.com/ardatan/whatwg-node/pull/806)
  [`9b6911a`](https://github.com/ardatan/whatwg-node/commit/9b6911a8fca0fc046278a8b490e14eb4412da98f)
  Thanks [@ardatan](https://github.com/ardatan)! - Return `Buffer` instead of `ArrayBuffer` in
  `.arrayBuffer` due to a bug in Node.js that returns a bigger ArrayBuffer causing memory overflow
- Updated dependencies
  [[`9b6911a`](https://github.com/ardatan/whatwg-node/commit/9b6911a8fca0fc046278a8b490e14eb4412da98f)]:
  - @whatwg-node/node-fetch@0.4.15

## 0.9.9

### Patch Changes

- [#567](https://github.com/ardatan/whatwg-node/pull/567)
  [`f8715cd`](https://github.com/ardatan/whatwg-node/commit/f8715cd15175e348169a11fd5531b901fec47e62)
  Thanks [@ardatan](https://github.com/ardatan)! - ### Faster HTTP Client experience in Node.js with
  HTTP/2 support

  If you install `node-libcurl` seperately, `@whatwg-node/fetch` will select `libcurl` instead of
  `node:http` which is faster.

  [See benchmarks](https://github.com/JCMais/node-libcurl/tree/develop/benchmark#ubuntu-1910-i7-5500u-24ghz---linux-530-42---node-v12162)

- Updated dependencies
  [[`f8715cd`](https://github.com/ardatan/whatwg-node/commit/f8715cd15175e348169a11fd5531b901fec47e62)]:
  - @whatwg-node/node-fetch@0.4.8

## 0.9.8

### Patch Changes

- [`a1c2140`](https://github.com/ardatan/whatwg-node/commit/a1c2140240388ca11a6f4c7bcec2682c47bdc24d)
  Thanks [@ardatan](https://github.com/ardatan)! - Do not use async iterators to consume incoming
  Readable stream

- Updated dependencies
  [[`a1c2140`](https://github.com/ardatan/whatwg-node/commit/a1c2140240388ca11a6f4c7bcec2682c47bdc24d)]:
  - @whatwg-node/node-fetch@0.4.7

## 0.9.7

### Patch Changes

- [`124bbe5`](https://github.com/ardatan/whatwg-node/commit/124bbe55f125dc9248fdde9c7e86637d905739fe)
  Thanks [@ardatan](https://github.com/ardatan)! - Implement Headers.getSetCookie and a custom
  serializer for node.inspect

- Updated dependencies
  [[`124bbe5`](https://github.com/ardatan/whatwg-node/commit/124bbe55f125dc9248fdde9c7e86637d905739fe)]:
  - @whatwg-node/node-fetch@0.4.6

## 0.9.6

### Patch Changes

- [#614](https://github.com/ardatan/whatwg-node/pull/614)
  [`f07d1c5`](https://github.com/ardatan/whatwg-node/commit/f07d1c5af5d17d64a45162a23a755ae8ce11ac93)
  Thanks [@ardatan](https://github.com/ardatan)! - Performance optimizations

- Updated dependencies
  [[`f07d1c5`](https://github.com/ardatan/whatwg-node/commit/f07d1c5af5d17d64a45162a23a755ae8ce11ac93)]:
  - @whatwg-node/node-fetch@0.4.5

## 0.9.5

### Patch Changes

- [#612](https://github.com/ardatan/whatwg-node/pull/612)
  [`273ca94`](https://github.com/ardatan/whatwg-node/commit/273ca94a35e0d4236d932e28f295f405d9adbd4c)
  Thanks [@ardatan](https://github.com/ardatan)! - Performance optimizations

- Updated dependencies
  [[`273ca94`](https://github.com/ardatan/whatwg-node/commit/273ca94a35e0d4236d932e28f295f405d9adbd4c)]:
  - @whatwg-node/node-fetch@0.4.4

## 0.9.4

### Patch Changes

- [#597](https://github.com/ardatan/whatwg-node/pull/597)
  [`d118d53`](https://github.com/ardatan/whatwg-node/commit/d118d538f3ab75f87728c4c8373b5b53fb8e1d51)
  Thanks [@ardatan](https://github.com/ardatan)! - Performance optimizations

- Updated dependencies
  [[`d118d53`](https://github.com/ardatan/whatwg-node/commit/d118d538f3ab75f87728c4c8373b5b53fb8e1d51)]:
  - @whatwg-node/node-fetch@0.4.3

## 0.9.3

### Patch Changes

- [`d7d9d9f`](https://github.com/ardatan/whatwg-node/commit/d7d9d9ff8903126eb3a346d35dcf621cafff1bd8)
  Thanks [@ardatan](https://github.com/ardatan)! - Bump internal packages

- Updated dependencies
  [[`d7d9d9f`](https://github.com/ardatan/whatwg-node/commit/d7d9d9ff8903126eb3a346d35dcf621cafff1bd8)]:
  - @whatwg-node/node-fetch@0.4.2

## 0.9.2

### Patch Changes

- [#577](https://github.com/ardatan/whatwg-node/pull/577)
  [`99f00e8`](https://github.com/ardatan/whatwg-node/commit/99f00e813fbe9cd1986bbf72c40d66df935a4c5b)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency
    [`urlpattern-polyfill@^9.0.0` ↗︎](https://www.npmjs.com/package/urlpattern-polyfill/v/9.0.0)
    (from `^8.0.0`, in `dependencies`)

## 0.9.1

### Patch Changes

- [`58b733d`](https://github.com/ardatan/whatwg-node/commit/58b733da41ca913348abd30e2253b332370aa51d)
  Thanks [@ardatan](https://github.com/ardatan)! - Bump node-fetch package

## 0.9.0

### Minor Changes

- [#535](https://github.com/ardatan/whatwg-node/pull/535)
  [`01051f8`](https://github.com/ardatan/whatwg-node/commit/01051f8b3408ac26612b8d8ea2702a3f7e6667af)
  Thanks [@ardatan](https://github.com/ardatan)! - Drop Node 14 support

### Patch Changes

- [#535](https://github.com/ardatan/whatwg-node/pull/535)
  [`01051f8`](https://github.com/ardatan/whatwg-node/commit/01051f8b3408ac26612b8d8ea2702a3f7e6667af)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Removed dependency
    [`@peculiar/webcrypto@^1.4.0` ↗︎](https://www.npmjs.com/package/@peculiar/webcrypto/v/1.4.0)
    (from `dependencies`)
  - Removed dependency [`busboy@^1.6.0` ↗︎](https://www.npmjs.com/package/busboy/v/1.6.0) (from
    `dependencies`)
  - Removed dependency
    [`web-streams-polyfill@^3.2.1` ↗︎](https://www.npmjs.com/package/web-streams-polyfill/v/3.2.1)
    (from `dependencies`)
- Updated dependencies
  [[`01051f8`](https://github.com/ardatan/whatwg-node/commit/01051f8b3408ac26612b8d8ea2702a3f7e6667af)]:
  - @whatwg-node/node-fetch@0.4.0

## 0.8.8

### Patch Changes

- [`29b9328`](https://github.com/ardatan/whatwg-node/commit/29b9328509f1b7d5e2d86cc450adcbd773b71d41)
  Thanks [@ardatan](https://github.com/ardatan)! - Export URLPattern constructor not type

## 0.8.7

### Patch Changes

- [#495](https://github.com/ardatan/whatwg-node/pull/495)
  [`1a2a92f`](https://github.com/ardatan/whatwg-node/commit/1a2a92fcc4e06342bcc5b18b8c7f2373edfa1552)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency
    [`urlpattern-polyfill@^8.0.0` ↗︎](https://www.npmjs.com/package/urlpattern-polyfill/v/8.0.0)
    (from `^7.0.0`, in `dependencies`)

- [`6c58ca1`](https://github.com/ardatan/whatwg-node/commit/6c58ca182b2d4538c8f2fe6367add7bbda3c9a38)
  Thanks [@ardatan](https://github.com/ardatan)! - Return correct types in createFetch

## 0.8.6

### Patch Changes

- [#427](https://github.com/ardatan/whatwg-node/pull/427)
  [`e8bda7c`](https://github.com/ardatan/whatwg-node/commit/e8bda7cdf440a7f4bb617ee1b5df8ee1becb4ad6)
  Thanks [@Rugvip](https://github.com/Rugvip)! - Restructure type declarations to avoid polluting
  global namespace.

- Updated dependencies
  [[`f3ce0e8`](https://github.com/ardatan/whatwg-node/commit/f3ce0e815f6085d199590359a39048c39920e6ce)]:
  - @whatwg-node/node-fetch@0.3.6

## 0.8.5

### Patch Changes

- [#475](https://github.com/ardatan/whatwg-node/pull/475)
  [`9dbda2b`](https://github.com/ardatan/whatwg-node/commit/9dbda2bfb2393b8aaee2bfc64a9021b187ecac1e)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency
    [`urlpattern-polyfill@^7.0.0` ↗︎](https://www.npmjs.com/package/urlpattern-polyfill/v/7.0.0)
    (from `^6.0.2`, in `dependencies`)

## 0.8.4

### Patch Changes

- [`207ee1d`](https://github.com/ardatan/whatwg-node/commit/207ee1de374a38e9c2b61bd4896d1591e3e57117)
  Thanks [@ardatan](https://github.com/ardatan)! - Detect Deno if the module is imported via 'npm:'
  or any other Node compatibility method

## 0.8.3

### Patch Changes

- [`bf585a3`](https://github.com/ardatan/whatwg-node/commit/bf585a3b1cafa63bdee86dace6a0e08f98a9b554)
  Thanks [@ardatan](https://github.com/ardatan)! - Support iterable Fetch API methods

- Updated dependencies
  [[`9f242f8`](https://github.com/ardatan/whatwg-node/commit/9f242f8268748345899ea4b6f05dac3c6dcecbeb),
  [`bf585a3`](https://github.com/ardatan/whatwg-node/commit/bf585a3b1cafa63bdee86dace6a0e08f98a9b554)]:
  - @whatwg-node/node-fetch@0.3.3

## 0.8.2

### Patch Changes

- [#380](https://github.com/ardatan/whatwg-node/pull/380)
  [`0df1ac7`](https://github.com/ardatan/whatwg-node/commit/0df1ac7d577ba831ce6431d68628b2028c37762f)
  Thanks [@ardatan](https://github.com/ardatan)! - Some patches for Type Safety

- Updated dependencies
  [[`0df1ac7`](https://github.com/ardatan/whatwg-node/commit/0df1ac7d577ba831ce6431d68628b2028c37762f)]:
  - @whatwg-node/node-fetch@0.3.1

## 0.8.1

### Patch Changes

- Updated dependencies
  [[`c7b9c8a`](https://github.com/ardatan/whatwg-node/commit/c7b9c8a4f58926e923bb3f581cf145feb389880f),
  [`f28ce1f`](https://github.com/ardatan/whatwg-node/commit/f28ce1f11c888187869a6c4df55f6438dc0eaab6)]:
  - @whatwg-node/node-fetch@0.3.0

## 0.8.0

### Minor Changes

- [`ea5d252`](https://github.com/ardatan/whatwg-node/commit/ea5d25298c480d4c5483186af41dccda8197164d)
  Thanks [@ardatan](https://github.com/ardatan)! - New URL and URLSearchParams ponyfills

### Patch Changes

- Updated dependencies
  [[`ea5d252`](https://github.com/ardatan/whatwg-node/commit/ea5d25298c480d4c5483186af41dccda8197164d),
  [`ea5d252`](https://github.com/ardatan/whatwg-node/commit/ea5d25298c480d4c5483186af41dccda8197164d),
  [`ebfbb84`](https://github.com/ardatan/whatwg-node/commit/ebfbb845be1a9f3893f62c850554cf6162f3b6d7)]:
  - @whatwg-node/node-fetch@0.2.0

## 0.7.1

### Patch Changes

- Updated dependencies
  [[`2d6e4aa`](https://github.com/ardatan/whatwg-node/commit/2d6e4aa67fffe2e33eb16b4c30c00f8ea9cf9a9a),
  [`94150b3`](https://github.com/ardatan/whatwg-node/commit/94150b3452f06f5671e87f59f8ae63e6e751289c)]:
  - @whatwg-node/node-fetch@0.1.0

## 0.7.0

### Minor Changes

- [#318](https://github.com/ardatan/whatwg-node/pull/318)
  [`390510b`](https://github.com/ardatan/whatwg-node/commit/390510b39d5d374233eb9798adbd0ef14101e2b7)
  Thanks [@ardatan](https://github.com/ardatan)! - Type-safe `Response.json`

### Patch Changes

- Updated dependencies
  [[`390510b`](https://github.com/ardatan/whatwg-node/commit/390510b39d5d374233eb9798adbd0ef14101e2b7)]:
  - @whatwg-node/node-fetch@0.0.6

## 0.6.9

### Patch Changes

- [#314](https://github.com/ardatan/whatwg-node/pull/314)
  [`3aa1848`](https://github.com/ardatan/whatwg-node/commit/3aa18486d44c507617b25204c3d4a96bc8a4c9e4)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency
    [`@whatwg-node/node-fetch@^0.0.4` ↗︎](https://www.npmjs.com/package/@whatwg-node/node-fetch/v/0.0.4)
    (from `0.0.4`, in `dependencies`)

- [#314](https://github.com/ardatan/whatwg-node/pull/314)
  [`3aa1848`](https://github.com/ardatan/whatwg-node/commit/3aa18486d44c507617b25204c3d4a96bc8a4c9e4)
  Thanks [@ardatan](https://github.com/ardatan)! - Align versions with ranged dependencies and cross
  version support internally

- Updated dependencies
  [[`3aa1848`](https://github.com/ardatan/whatwg-node/commit/3aa18486d44c507617b25204c3d4a96bc8a4c9e4),
  [`3aa1848`](https://github.com/ardatan/whatwg-node/commit/3aa18486d44c507617b25204c3d4a96bc8a4c9e4)]:
  - @whatwg-node/node-fetch@0.0.5

## 0.6.8

### Patch Changes

- Updated dependencies
  [[`01dc91e`](https://github.com/ardatan/whatwg-node/commit/01dc91e0db7f65599d9bc018c0a9396dd0e5ad27)]:
  - @whatwg-node/node-fetch@0.0.4

## 0.6.7

### Patch Changes

- Updated dependencies
  [[`8edd68d`](https://github.com/ardatan/whatwg-node/commit/8edd68d288889e7a1222c8790a708b0930f337e2),
  [`b6c9ac0`](https://github.com/ardatan/whatwg-node/commit/b6c9ac0ae8095ded0970be810f63e23fcca65830)]:
  - @whatwg-node/node-fetch@0.0.3

## 0.6.6

### Patch Changes

- Updated dependencies
  [[`155c354`](https://github.com/ardatan/whatwg-node/commit/155c354aae4179bf233c68fec386e276728a16de),
  [`260d86f`](https://github.com/ardatan/whatwg-node/commit/260d86f50cd1e215b1fe574042da92124636e56b)]:
  - @whatwg-node/node-fetch@0.0.2

## 0.6.5

### Patch Changes

- [`63c96f5`](https://github.com/ardatan/whatwg-node/commit/63c96f5ad14bbc56ccccb95def3447b4107f6013)
  Thanks [@ardatan](https://github.com/ardatan)! - Do not add ponyfills for Bun

## 0.6.4

### Patch Changes

- [`2ce7122`](https://github.com/ardatan/whatwg-node/commit/2ce71227f0cc86644998cad70405048d79c1b104)
  Thanks [@ardatan](https://github.com/ardatan)! - Bun doesn't have URLPattern

## 0.6.3

### Patch Changes

- [#154](https://github.com/ardatan/whatwg-node/pull/154)
  [`9f4fe48`](https://github.com/ardatan/whatwg-node/commit/9f4fe489ff1d08d873a2dd26c02abc54da08dc48)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency
    [`web-streams-polyfill@^3.2.1` ↗︎](https://www.npmjs.com/package/web-streams-polyfill/v/3.2.1)
    (from `^3.2.0`, in `dependencies`)
  - Added dependency
    [`@whatwg-node/node-fetch@0.0.0` ↗︎](https://www.npmjs.com/package/@whatwg-node/node-fetch/v/0.0.0)
    (to `dependencies`)
  - Removed dependency
    [`abort-controller@^3.0.0` ↗︎](https://www.npmjs.com/package/abort-controller/v/3.0.0) (from
    `dependencies`)
  - Removed dependency
    [`form-data-encoder@^1.7.1` ↗︎](https://www.npmjs.com/package/form-data-encoder/v/1.7.1) (from
    `dependencies`)
  - Removed dependency
    [`formdata-node@^4.3.1` ↗︎](https://www.npmjs.com/package/formdata-node/v/4.3.1) (from
    `dependencies`)
  - Removed dependency [`node-fetch@^2.6.7` ↗︎](https://www.npmjs.com/package/node-fetch/v/2.6.7)
    (from `dependencies`)
  - Removed dependency [`undici@^5.12.0` ↗︎](https://www.npmjs.com/package/undici/v/5.12.0) (from
    `dependencies`)

- [#154](https://github.com/ardatan/whatwg-node/pull/154)
  [`9f4fe48`](https://github.com/ardatan/whatwg-node/commit/9f4fe489ff1d08d873a2dd26c02abc54da08dc48)
  Thanks [@ardatan](https://github.com/ardatan)! - New Fetch API implementation for Node

- Updated dependencies
  [[`9f4fe48`](https://github.com/ardatan/whatwg-node/commit/9f4fe489ff1d08d873a2dd26c02abc54da08dc48)]:
  - @whatwg-node/node-fetch@0.0.1

## 0.6.2

### Patch Changes

- [#258](https://github.com/ardatan/whatwg-node/pull/258)
  [`802cb96`](https://github.com/ardatan/whatwg-node/commit/802cb9636eddd8e819b80604fc26d40aac92c828)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - Node ponyfill requests must have an abort
  signal

## 0.6.1

### Patch Changes

- [`9752cca`](https://github.com/ardatan/whatwg-node/commit/9752cca54e7636114d87849ca9c7eb9be3d9dba8)
  Thanks [@ardatan](https://github.com/ardatan)! - Remove unnecessary ponyfill for the envs
  supporting Fetch by default

## 0.6.0

### Minor Changes

- [#241](https://github.com/ardatan/whatwg-node/pull/241)
  [`563cfaa`](https://github.com/ardatan/whatwg-node/commit/563cfaaacf8bb0b08371b7f44887321d7e7c472d)
  Thanks [@ardatan](https://github.com/ardatan)! - Drop itty-router in favor of new URLPattern in
  the fetch ponyfill

### Patch Changes

- [#241](https://github.com/ardatan/whatwg-node/pull/241)
  [`563cfaa`](https://github.com/ardatan/whatwg-node/commit/563cfaaacf8bb0b08371b7f44887321d7e7c472d)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Added dependency
    [`urlpattern-polyfill@^6.0.2` ↗︎](https://www.npmjs.com/package/urlpattern-polyfill/v/6.0.2)
    (to `dependencies`)

## 0.5.4

### Patch Changes

- [#237](https://github.com/ardatan/whatwg-node/pull/237)
  [`166102f`](https://github.com/ardatan/whatwg-node/commit/166102f6ff52d2197ab7f78c63392b95ebca259c)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - http2 support when using Node ponyfill

## 0.5.3

### Patch Changes

- [`188ac01`](https://github.com/ardatan/whatwg-node/commit/188ac01dab264ed483dbc3b897e6958b49085922)
  Thanks [@ardatan](https://github.com/ardatan)! - Fix destroy for Node 18

## 0.5.2

### Patch Changes

- [#179](https://github.com/ardatan/whatwg-node/pull/179)
  [`3297c87`](https://github.com/ardatan/whatwg-node/commit/3297c87409c3bcf8700dd447d603da657acbd821)
  Thanks [@ardatan](https://github.com/ardatan)! - Fix destroy method for ReadableStream to Readable
  conversion

## 0.5.1

### Patch Changes

- [`a8a7cfc`](https://github.com/ardatan/whatwg-node/commit/a8a7cfcbb98c5ca8fff3b4a6d8638e9208690b61)
  Thanks [@ardatan](https://github.com/ardatan)! - Fix for new undici

## 0.5.0

### Minor Changes

- [`ab5fb52`](https://github.com/ardatan/whatwg-node/commit/ab5fb524753bc7a210b1aaf2e1580566907d4713)
  Thanks [@ardatan](https://github.com/ardatan)! - Drop broken `fieldsFirst` flag

## 0.4.7

### Patch Changes

- [`e59cbb6`](https://github.com/ardatan/whatwg-node/commit/e59cbb667dfcbdd9c0cf609fd56dbd904ac85cbd)
  Thanks [@ardatan](https://github.com/ardatan)! - Do not patch global Headers if it is native, and
  support URL as a first parameter of `fetch`

## 0.4.6

### Patch Changes

- [`c918527`](https://github.com/ardatan/whatwg-node/commit/c918527f15eb6096656376648dccdbc8d6898395)
  Thanks [@ardatan](https://github.com/ardatan)! - Bump Undici

- [#148](https://github.com/ardatan/whatwg-node/pull/148)
  [`eb10500`](https://github.com/ardatan/whatwg-node/commit/eb105005fd01bd227eff8d52c22b39ea1a8c6700)
  Thanks [@ardatan](https://github.com/ardatan)! - - On Node 14, fix the return method of
  Response.body's AsyncIterator to close HTTP connection correctly
  - On Node 14, handle ReadableStream's cancel correctly if Response.body is a ReadableStream
  - Do not modify ReadableStream.cancel's behavior but handle it internally
  - On Node 18, do not combine Response.body's return and AbortController which causes a memory leak

## 0.4.5

### Patch Changes

- [#140](https://github.com/ardatan/whatwg-node/pull/140)
  [`5d151df`](https://github.com/ardatan/whatwg-node/commit/5d151df8c59329a470b8ffa6e3547aae72a7e55b)
  Thanks [@ardatan](https://github.com/ardatan)! - Fix Request.formData method

## 0.4.4

### Patch Changes

- [`9502102`](https://github.com/ardatan/whatwg-node/commit/9502102b265945b37ee38b276ec1533fae0f308f)
  Thanks [@ardatan](https://github.com/ardatan)! - Breaking Change: Event API is no longer available
  in this ponyfill; use @whatwg-node/events instead.

## 0.4.3

### Patch Changes

- [`c9f05f2`](https://github.com/ardatan/whatwg-node/commit/c9f05f21fb96f63bc22359e3b7981cb9b3b727b5)
  Thanks [@ardatan](https://github.com/ardatan)! - Add ponyfills for Response.redirect,
  Response.json and Response.error

## 0.4.2

### Patch Changes

- [`7f37b6d`](https://github.com/ardatan/whatwg-node/commit/7f37b6dbeb76cfa54e0ed8672812bf016c1df4fa)
  Thanks [@ardatan](https://github.com/ardatan)! - fix(fetch): respect filesLimit even with
  fieldsFirst

## 0.4.1

### Patch Changes

- [`53753bb`](https://github.com/ardatan/whatwg-node/commit/53753bb5dd83fbc1e7253784b02f2b1f2e02fdb9)
  Thanks [@ardatan](https://github.com/ardatan)! - fix(fetch): fix formData function

## 0.4.0

### Minor Changes

- [`005937c`](https://github.com/ardatan/whatwg-node/commit/005937c72749dfa3914c8b6193a88c772a522275)
  Thanks [@ardatan](https://github.com/ardatan)! - feat(fetch): new `fieldsFirst` option to allow
  async stream consumption for multipart forms

- [`effc03d`](https://github.com/ardatan/whatwg-node/commit/effc03d58793328595183ac7cd5c9abab95dec17)
  Thanks [@ardatan](https://github.com/ardatan)! - Bun Support

## 0.3.2

### Patch Changes

- [`982fa96`](https://github.com/ardatan/whatwg-node/commit/982fa96b09af404a21154098499202bfd29c2054)
  Thanks [@ardatan](https://github.com/ardatan)! - fix(ponyfill/btoa): handle incoming value as
  binary encoding

## 0.3.1

### Patch Changes

- [`a3bc171`](https://github.com/ardatan/whatwg-node/commit/a3bc17120fbdf641e4363d08ba79955005f5b3d6)
  Thanks [@ardatan](https://github.com/ardatan)! - fix btoa ponyfill

## 0.3.0

### Minor Changes

- [`8a431d3`](https://github.com/ardatan/whatwg-node/commit/8a431d309271c0d1ff7248ec26afe293ccc01bf6)
  Thanks [@ardatan](https://github.com/ardatan)! - Add "btoa" ponyfill for Node 14

* [`8a431d3`](https://github.com/ardatan/whatwg-node/commit/8a431d309271c0d1ff7248ec26afe293ccc01bf6)
  Thanks [@ardatan](https://github.com/ardatan)! - Support different encodings in TextEncoder and
  TextDecoder

## 0.2.9

### Patch Changes

- [`9a8d873`](https://github.com/ardatan/whatwg-node/commit/9a8d8731ff07ea585b1e561718584fbe5edeb963)
  Thanks [@ardatan](https://github.com/ardatan)! - Workaround for a potential leak on Node 18

## 0.2.3

### Minor Changes

- 486c35d: Export Event API

## 0.1.1

### Patch Changes

- 16aff71: Fix missing TextEncoder and TextDecoder in the default ponyfill

## 0.1.0

### Minor Changes

- b83d7f3: Faster TextEncoder & TextDecoder with Buffer in Node
- b83d7f3: Ponyfill for WebCrypto API

### Patch Changes

- b83d7f3: Bump undici version
- b83d7f3: Now ponyfills Event API

## 0.0.2

### Patch Changes

- 3207383: Fix TS typings

## 0.0.1

### Patch Changes

- 889eccf: NEW RELEASES
