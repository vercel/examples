# micro-api-client

[![Build Status](https://travis-ci.org/netlify/micro-api-client.svg?branch=master)](https://travis-ci.org/netlify/micro-api-client)

Small library for talking to micro REST APIs (not related to Netlify's main API).

## Installation

```
yarn add micro-api-client
```

## Usage

```js
import API, { getPagination } from 'micro-api-client'

const api = new API("/some/api/endpoint");
api
  .request("foo")
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

### API

### `api = new API(apiURL, [opts])`

Create a new `micro-api-client` instance. `apiURL` can be a full or relative URL. Optional `opts` include:

```js
{
  defaultHeaders: {
  } // header values to include in every request.
}
```

### `api.request(path, [opts])`

Make a request to the `apiURL` at the given `path`. Optional `opts` are passed to the [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) API:

```js
// Default options
{
  headers: {} // Optional headers object.  Overrides defaultHeaders
  credentials: "same-origin" // set fetch credentials option
  "Content-Type": "application/json" // set Content-Type fetch option
}
```

Returns a promise with the `response`. If the `contentType` is JSON, it will be checked for pagination and return either the parsed JSON object or a paginated JSON object:

```js
// See src/pagination.js
{
  pagination: {
    last,
    next,
    prev,
    first,
    current,
    total
  },
  items: json
}
```

If an error occurs during the request, the promise may be rejected with an `HTTPError`, `TextHTTPError`, or `JSONHTTPError`.

### `class HTTPError extends Error`

Additional error properties from Error

```js
{
  stack, // stack trace of error
  status // status code of response
}
```

### `class TextHTTPError extends HTTPError`

Additional error properties from HTTPError

```js
{
  data // data of text response
}
```

### `class JSONHTTPError extends HTTPError`

Additional error properties from HTTPError

```js
{
  json // json of a JSON response
}
```

### `pagination = getPagination(response)`

Returns a pagination object that `micro-api-client` uses internally.
