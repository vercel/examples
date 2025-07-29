![Browser library that helps decoding JWT tokens which are Base64Url encoded](https://cdn.auth0.com/website/sdks/banners/jwt-decode-banner.png)

**IMPORTANT:** This library doesn't validate the token, any well-formed JWT can be decoded. You should validate the token in your server-side logic by using something like [express-jwt](https://github.com/auth0/express-jwt), [koa-jwt](https://github.com/stiang/koa-jwt), [Microsoft.AspNetCore.Authentication.JwtBearer](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer), etc.

![Release](https://img.shields.io/npm/v/jwt-decode)
![Downloads](https://img.shields.io/npm/dw/jwt-decode)
[![License](https://img.shields.io/:license-MIT-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
[![CircleCI](https://img.shields.io/circleci/build/github/auth0/jwt-decode)](https://circleci.com/gh/auth0/jwt-decode)

:books: [Documentation](#documentation) - :rocket: [Getting Started](#getting-started) - :speech_balloon: [Feedback](#feedback)

## Documentation

- [Docs site](https://www.auth0.com/docs) - explore our docs site and learn more about Auth0.

## Getting started

### Installation

Install with NPM or Yarn.

Run `npm install jwt-decode` or `yarn add jwt-decode` to install the library.

### Usage

```js
import { jwtDecode } from "jwt-decode";

const token = "eyJ0eXAiO.../// jwt token";
const decoded = jwtDecode(token);

console.log(decoded);

/* prints:
 * { 
 *   foo: "bar",
 *   exp: 1393286893,
 *   iat: 1393268893  
 * }
 */

// decode header by passing in options (useful for when you need `kid` to verify a JWT):
const decodedHeader = jwtDecode(token, { header: true });
console.log(decodedHeader);

/* prints:
 * { 
 *   typ: "JWT",
 *   alg: "HS256" 
 * }
 */
```

**Note:** A falsy or malformed token will throw an `InvalidTokenError` error; see below for more information on specific errors.

## Errors

This library works with valid JSON web tokens. The basic format of these token is
```
[part1].[part2].[part3]
```
All parts are supposed to be valid base64 (url) encoded json.
Depending on the `{ header: <option> }` option it will decode part 1 (only if header: true is specified) or part 2 (default)

Not adhering to the format will result in a `InvalidTokenError` with one of the following messages:

- `Invalid token specified: must be a string` => the token passed was not a string, this library only works on strings. 
- `Invalid token specified: missing part #` => this probably means you are missing a dot (`.`) in the token 
- `Invalid token specified: invalid base64 for part #` => the part could not be base64 decoded (the message should contain the error the base64 decoder gave)
- `Invalid token specified: invalid json for part #` => the part was correctly base64 decoded, however, the decoded value was not valid JSON (the message should contain the error the JSON parser gave)

#### Use with TypeScript

The return type of the `jwtDecode` function is determined by the `header` property of the object passed as the second argument. If omitted (or set to false), it'll use `JwtPayload`, when true it will use `JwtHeader`. 
If needed, you can specify what the expected return type should be by passing a type argument to the `jwtDecode` function.

You can extend both `JwtHeader` and `JwtPayload` to include non-standard claims or properties.

```typescript
import { jwtDecode } from "jwt-decode";

const token = "eyJhsw5c";
const decoded = jwtDecode<JwtPayload>(token); // Returns with the JwtPayload type
```

#### Use as a CommonJS package

```javascript
const { jwtDecode } = require('jwt-decode');
...
```

#### Include with a script tag

Copy the file `jwt-decode.js` from the root of the `build/esm` folder to your project somewhere, then import `jwtDecode` from it inside a script tag that's marked with `type="module"`:

```html
<script type="module">
  import { jwtDecode } from "/path/to/jwt-decode.js";

  const token = "eyJhsw5c";
  const decoded = jwtDecode(token);
</script>
```

## Feedback

### Contributing

We appreciate feedback and contribution to this repo! Before you get started, please see the following:

- [Auth0's general contribution guidelines](https://github.com/auth0/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
- [Auth0's code of conduct guidelines](https://github.com/auth0/open-source-template/blob/master/CODE-OF-CONDUCT.md)

### Raise an issue

To provide feedback or report a bug, please [raise an issue on our issue tracker](https://github.com/auth0/jwt-decode/issues).

### Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/responsible-disclosure-policy) details the procedure for disclosing security issues.

---

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="https://cdn.auth0.com/website/sdks/logos/auth0_light_mode.png"   width="150">
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.auth0.com/website/sdks/logos/auth0_dark_mode.png" width="150">
    <img alt="Auth0 Logo" src="https://cdn.auth0.com/website/sdks/logos/auth0_light_mode.png" width="150">
  </picture>
</p>
<p align="center">Auth0 is an easy to implement, adaptable authentication and authorization platform. To learn more checkout <a href="https://auth0.com/why-auth0">Why Auth0?</a></p>
<p align="center">
This project is licensed under the MIT license. See the <a href="./LICENSE"> LICENSE</a> file for more info.</p>
