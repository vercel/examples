# p-wait-for

> Wait for a condition to be true

Can be useful for polling.

## Install

```sh
npm install p-wait-for
```

## Usage

```js
import pWaitFor from 'p-wait-for';
import {pathExists} from 'path-exists';

await pWaitFor(() => pathExists('unicorn.png'));
console.log('Yay! The file now exists.');
```

## API

### pWaitFor(condition, options?)

Returns a `Promise` that resolves when `condition` returns `true`. Rejects if `condition` throws or returns a `Promise` that rejects.

#### condition

Type: `Function`

Expected to return `Promise<boolean> | boolean`.

#### options

Type: `object`

##### interval

Type: `number`\
Default: `20`

Number of milliseconds to wait after `condition` resolves to `false` before calling it again.

##### timeout

Type: `number | TimeoutOptions`\
Default: `Infinity`

Number of milliseconds to wait before automatically rejecting with a `TimeoutError`.

You can customize the timeout `Error` by specifying `TimeoutOptions`.

```js
import pWaitFor from 'p-wait-for';
import {pathExists} from 'path-exists';

const originalSetTimeout = setTimeout;
const originalClearTimeout = clearTimeout;

sinon.useFakeTimers();

await pWaitFor(() => pathExists('unicorn.png'), {
	timeout: {
		milliseconds: 100,
		message: new MyError('Time’s up!'),
		customTimers: {
			setTimeout: originalSetTimeout,
			clearTimeout: originalClearTimeout
		}
	}
});

console.log('Yay! The file now exists.');
```

###### milliseconds

Type: `number`\
Default: `Infinity`

Milliseconds before timing out.

Passing `Infinity` will cause it to never time out.

###### message

Type: `string | Error`
Default: `'Promise timed out after 50 milliseconds'`

Specify a custom error message or error.

If you do a custom error, it's recommended to sub-class `TimeoutError`.

###### customTimers

Type: `object` with function properties `setTimeout` and `clearTimeout`

Custom implementations for the `setTimeout` and `clearTimeout` functions.

Useful for testing purposes, in particular to work around [`sinon.useFakeTimers()`](https://sinonjs.org/releases/latest/fake-timers/).

###### fallback

Type: `Function`

Do something other than rejecting with an error on timeout.

Example:

```js
import pWaitFor from 'p-wait-for';
import {pathExists} from 'path-exists';

await pWaitFor(() => pathExists('unicorn.png'), {
	timeout: {
		milliseconds: 50,
		fallback: () => {
			console.log('Time’s up! executed the fallback function!');
		},
	}
});
```

##### before

Type: `boolean`\
Default: `true`

Whether to run the check immediately rather than starting by waiting `interval` milliseconds.

Useful for when the check, if run immediately, would likely return `false`. In this scenario, set `before` to `false`.

#### resolveWith(value)

Resolve the main promise with a custom value.

```js
import pWaitFor from 'p-wait-for';
import pathExists from 'path-exists';

const path = await pWaitFor(async () => {
	const path = getPath();
	return await pathExists(path) && pWaitFor.resolveWith(path);
});

console.log(path);
```

### TimeoutError

Exposed for instance checking.

## Related

- [p-whilst](https://github.com/sindresorhus/p-whilst) - Calls a function repeatedly while a condition returns true and then resolves the promise
- [More…](https://github.com/sindresorhus/promise-fun)
