<p align="center">
<img src="https://cdn.jsdelivr.net/gh/hexagon/croner@master/croner.png" alt="Croner" width="150" height="150"><br>
Trigger functions or evaluate cron expressions in JavaScript or TypeScript. No dependencies. All features. Node. Deno. Bun. Browser. <br><br>Try it live on <a href="https://jsfiddle.net/hexag0n/hoa8kwsb/">jsfiddle</a>, and check out the full documentation on <a href="https://croner.56k.guru">croner.56k.guru</a>.<br>
</p>

# Croner - Cron for JavaScript and TypeScript

[![npm version](https://badge.fury.io/js/croner.svg)](https://badge.fury.io/js/croner) [![JSR](https://jsr.io/badges/@hexagon/croner)](https://jsr.io/@hexagon/croner) [![NPM Downloads](https://img.shields.io/npm/dw/croner.svg)](https://www.npmjs.org/package/croner)
![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen) [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/croner/blob/master/LICENSE)

*   Trigger functions in JavaScript using [Cron](https://en.wikipedia.org/wiki/Cron#CRON_expression) syntax.
*   Evaluate cron expressions and get a list of upcoming run times.
*   Uses Vixie-cron [pattern](#pattern), with additional features such as `L` for last day and weekday of month and `#` for nth weekday of month.
*   Works in Node.js >=18 (both require and import), Deno >=1.16 and Bun >=1.0.0.
*   Works in browsers as standalone, UMD or ES-module.
*   Target different [time zones](https://croner.56k.guru/usage/examples/#time-zone).
*   Built-in [overrun protection](https://croner.56k.guru/usage/examples/#overrun-protection)
*   Built-in [error handling](https://croner.56k.guru/usage/examples/#error-handling)
*   Includes [TypeScript](https://www.typescriptlang.org/) typings.
*   Support for asynchronous functions.
*   Pause, resume, or stop execution after a task is scheduled.
*   Operates in-memory, with no need for a database or configuration files.
*   Zero dependencies.

Quick examples:

```javascript
// Basic: Run a function at the interval defined by a cron expression
const job = new Cron('*/5 * * * * *', () => {
	console.log('This will run every fifth second');
});

// Enumeration: What dates do the next 100 sundays occur on?
const nextSundays = new Cron('0 0 0 * * 7').nextRuns(100);
console.log(nextSundays);

// Days left to a specific date
const msLeft = new Cron('59 59 23 24 DEC *').nextRun() - new Date();
console.log(Math.floor(msLeft/1000/3600/24) + " days left to next christmas eve");

// Run a function at a specific date/time using a non-local timezone (time is ISO 8601 local time)
// This will run 2024-01-23 00:00:00 according to the time in Asia/Kolkata
new Cron('2024-01-23T00:00:00', { timezone: 'Asia/Kolkata' }, () => { console.log('Yay!') });

```

More [examples](https://croner.56k.guru/usage/examples/)...

## Installation

Full documentation on installation and usage is found at <https://croner.56k.guru>

> **Note**
> If you are migrating from a different library such as `cron` or `node-cron`, or upgrading from a older version of croner, see the [migration section](https://croner.56k.guru/migration/) of the manual.

Install croner using your favorite package manager or CDN, then include it in you project: 

Using Node.js or Bun

```javascript
// ESM Import ...
import { Cron } from "croner";

// ... or CommonJS Require, destructure to add type hints
const { Cron } = require("croner");
```

Using Deno

```typescript
// From deno.land/x
import { Cron } from "https://deno.land/x/croner@8.1.2/dist/croner.js";

// ... or jsr.io
import { Cron } from "jsr:@hexagon/croner@8.1.2";
```

In a webpage using the UMD-module

```html
<script src="https://cdn.jsdelivr.net/npm/croner@8/dist/croner.umd.min.js"></script>
```

## Documentation

### Signature

Cron takes three arguments

*   [pattern](#pattern)
*   [options](#options) (optional) 
*   scheduled function (optional)

```javascript
// Parameters
// - First: Cron pattern, js date object (fire once), or ISO 8601 time string (fire once)
// - Second: Options (optional)
// - Third: Function run trigger (optional)
const job = new Cron("* * * * * *", { maxRuns: 1 }, () => {} );

// If function is omitted in constructor, it can be scheduled later
job.schedule(job, /* optional */ context) => {});
```

The job will be sceduled to run at next matching time unless you supply option `{ paused: true }`. The `new Cron(...)` constructor will return a Cron instance, later called `job`, which have a couple of methods and properties listed below.

#### Status

```javascript
job.nextRun( /*optional*/ startFromDate );	// Get a Date object representing the next run.
job.nextRuns(10, /*optional*/ startFromDate ); // Get an array of Dates, containing the next n runs.
job.msToNext( /*optional*/ startFromDate ); // Get the milliseconds left until the next execution.
job.currentRun(); 		// Get a Date object showing when the current (or last) run was started.
job.previousRun( ); 		// Get a Date object showing when the previous job was started.

job.isRunning(); 	// Indicates if the job is scheduled and not paused or killed (true or false).
job.isStopped(); 	// Indicates if the job is permanently stopped using `stop()` (true or false).
job.isBusy(); 		// Indicates if the job is currently busy doing work (true or false).

job.getPattern(); 	// Returns the original pattern string
```

#### Control functions

```javascript
job.trigger();		// Force a trigger instantly
job.pause();		// Pause trigger
job.resume();		// Resume trigger
job.stop();		// Stop the job completely. It is not possible to resume after this.
				// Note that this also removes named jobs from the exported `scheduledJobs` array.
```

#### Properties

```javascript
job.name 			// Optional job name, populated if a name were passed to options
```

#### Options

| Key          | Default value  | Data type      | Remarks                               |
|--------------|----------------|----------------|---------------------------------------|
| name         | undefined      | String         | If you specify a name for the job, Croner will keep a reference to the job in the exported array `scheduledJobs`. The reference will be removed on `.stop()`. |
| maxRuns      | Infinite       | Number         |                                       |
| catch	       | false          | Boolean\|Function        | Catch unhandled errors in triggered function. Passing `true` will silently ignore errors. Passing a callback function will trigger this callback on error. |
| timezone     | undefined      | String         | Timezone in Europe/Stockholm format   |
| startAt      | undefined      | String         | ISO 8601 formatted datetime (2021-10-17T23:43:00)<br>in local time (according to timezone parameter if passed) |
| stopAt       | undefined      | String         | ISO 8601 formatted datetime (2021-10-17T23:43:00)<br>in local time (according to timezone parameter if passed) |
| interval     | 0              | Number         | Minimum number of seconds between triggers. |
| paused       | false          | Boolean        | If the job should be paused from start. |
| context      | undefined      | Any            | Passed as the second parameter to triggered function |
| legacyMode   | true           | boolean        | Combine day-of-month and day-of-week using true = OR, false = AND |
| unref        | false          | boolean        | Setting this to true unrefs the internal timer, which allows the process to exit even if a cron job is running. |
| utcOffset    | undefined      | number        | Schedule using a specific utc offset in minutes. This does not take care of daylight savings time, you probably want to use option `timezone` instead. |
| protect      | undefined      | boolean\|Function | Enabled over-run protection. Will block new triggers as long as an old trigger is in progress. Pass either `true` or a callback function to enable |

> **Warning**
> Unreferencing timers (option `unref`) is only supported by Node.js and Deno. 
> Browsers have not yet implemented this feature, and it does not make sense to use it in a browser environment.

#### Pattern

The expressions used by Croner are very similar to those of Vixie Cron, but with a few additions and changes as outlined below:

```javascript
// ┌──────────────── (optional) second (0 - 59)
// │ ┌────────────── minute (0 - 59)
// │ │ ┌──────────── hour (0 - 23)
// │ │ │ ┌────────── day of month (1 - 31)
// │ │ │ │ ┌──────── month (1 - 12, JAN-DEC)
// │ │ │ │ │ ┌────── day of week (0 - 6, SUN-Mon) 
// │ │ │ │ │ │       (0 to 6 are Sunday to Saturday; 7 is Sunday, the same as 0)
// │ │ │ │ │ │
// * * * * * *
```

*   Croner expressions have the following additional modifiers:
	-   *?*: The question mark is substituted with the time of initialization. For example, ? ? * * * * would be substituted with 25 8 * * * * if the time is <any hour>:08:25 at the time of new Cron('? ? * * * *', <...>). The question mark can be used in any field.
	-   *L*: The letter 'L' can be used in the day of the month field to indicate the last day of the month. When used in the day of the week field in conjunction with the # character, it denotes the last specific weekday of the month. For example, `5#L` represents the last Friday of the month.
	-	*#*: The # character specifies the "nth" occurrence of a particular day within a month. For example, supplying 
	`5#2` in the day of week field signifies the second Friday of the month. This can be combined with ranges and supports day names. For instance, MON-FRI#2 would match the Monday through Friday of the second week of the month.

*   Croner allows you to pass a JavaScript Date object or an ISO 8601 formatted string as a pattern. The scheduled function will trigger at the specified date/time and only once. If you use a timezone different from the local timezone, you should pass the ISO 8601 local time in the target location and specify the timezone using the options (2nd parameter).

*   Croner also allows you to change how the day-of-week and day-of-month conditions are combined. By default, Croner (and Vixie cron) will trigger when either the day-of-month OR the day-of-week conditions match. For example, `0 20 1 * MON` will trigger on the first of the month as well as each Monday. If you want to use AND (so that it only triggers on Mondays that are also the first of the month), you can pass `{ legacyMode: false }`. For more information, see issue [#53](https://github.com/Hexagon/croner/issues/53).

| Field        | Required | Allowed values | Allowed special characters | Remarks                               |
|--------------|----------|----------------|----------------------------|---------------------------------------|
| Seconds      | Optional | 0-59           | * , - / ?                  |                                       |
| Minutes      | Yes      | 0-59           | * , - / ?                  |                                       |
| Hours        | Yes      | 0-23           | * , - / ?                  |                                       |
| Day of Month | Yes      | 1-31           | * , - / ? L                |                                       |
| Month        | Yes      | 1-12 or JAN-DEC| * , - / ?                  |                                       |
| Day of Week  | Yes      | 0-7 or SUN-MON | * , - / ? L #               | 0 to 6 are Sunday to Saturday<br>7 is Sunday, the same as 0<br># is used to specify nth occurrence of a weekday            |

> **Note**
> Weekday and month names are case-insensitive. Both `MON` and `mon` work.
> When using `L` in the Day of Week field, it affects all specified weekdays. For example, `5-6#L` means the last Friday and Saturday in the month."
> The # character can be used to specify the "nth" weekday of the month. For example, 5#2 represents the second Friday of the month.

It is also possible to use the following "nicknames" as pattern.

| Nickname | Description |
| -------- | ----------- |
| \@yearly | Run once a year, ie.  "0 0 1 1 *". |
| \@annually | Run once a year, ie.  "0 0 1 1 *". |
| \@monthly | Run once a month, ie. "0 0 1 * *". |
| \@weekly | Run once a week, ie.  "0 0 * * 0". |
| \@daily | Run once a day, ie.   "0 0 * * *". |
| \@hourly | Run once an hour, ie. "0 * * * *". |

## Why another JavaScript cron implementation

Because the existing ones are not good enough. They have serious bugs, use bloated dependencies, do not work in all environments, and/or simply do not work as expected.

|                           | croner              | cronosjs            | node-cron | cron                      | node-schedule       |
|---------------------------|:-------------------:|:-------------------:|:---------:|:-------------------------:|:-------------------:|
| **Platforms**                                                                                                                        |
| Node.js (CommonJS)                   |          ✓          |          ✓          |     ✓     |           ✓               |          ✓          |
| Browser (ESMCommonJS)                  |          ✓          |          ✓          |           |                           |                     |
| Deno (ESM)                     |          ✓          |                     |           |                           |                     |
| **Features**                                                                                                                        |
| Over-run protection  |          ✓          |                    |              |                            |                    |
| Error handling  |          ✓          |                    |              |                            |          ✓          |
| Typescript typings        |          ✓          |         ✓            |           |            ✓              |                     |
| Unref timers (optional)    |          ✓          |                     |                     |          ✓          |                     |
| dom-OR-dow                |          ✓          |          ✓          |     ✓     |           ✓               |          ✓          |
| dom-AND-dow (optional)    |          ✓          |                     |           |                           |                     |
| Next run                  |          ✓          |          ✓          |           |           ✓              |           ✓         |
| Next n runs               |          ✓          |          ✓          |           |           ✓               |                     |
| Timezone                  |          ✓          |           ✓         |     ✓       |        ✓                   |         ✓            |
| Minimum interval          |          ✓          |                     |              |                            |                      |
| Controls (stop/resume)    |          ✓          |           ✓         |     ✓        |        ✓                   |         ✓           |   
| Range (0-13)   |          ✓          |          ✓          |     ✓        |        ✓                   |         ✓           |
| Stepping (*/5)   |          ✓          |          ✓          |     ✓        |        ✓                   |         ✓           |
| Last day of month (L)  |          ✓          |          ✓          |              |                            |                    |
| Nth weekday of month (#)     |          ✓          |           ✓          |           |                           |                     |

<details>
  <summary>In depth comparison of various libraries</summary>
  
|                           | croner              | cronosjs            | node-cron | cron                      | node-schedule       |
|---------------------------|:-------------------:|:-------------------:|:---------:|:-------------------------:|:-------------------:|
| **Size**                                                                                                                        |
| Minified size (KB)        | 17.0                | 14.9            | 15.2      | 85.4 :warning:                      | 100.5 :warning:                |
| Bundlephobia  minzip (KB) | 5.0                 | 5.1                 | 5.7       |                   25.8 | 29.2 :warning:             |
| Dependencies              |                   0 |                   0 |         1 |                         1 |                   3 :warning: |
| **Popularity**                                                                                                                        |
| Downloads/week [^1]        | 2019K                | 31K                 | 447K      | 1366K                     | 1046K                |
| **Quality**                                                                                                                        |
| Issues [^1]                |                   0 |                   2 |   133 :warning: |                 13 |    145 :warning: |
| Code coverage              |                   99%  | 98%                    | 100%                | 81%                              | 94%                 |
| **Performance**                                                                                                                        |
| Ops/s `1 2 3 4 5 6`         | 160 651                    | 55 593                    | N/A :x:          | 6 313 :warning:      | 2 726 :warning:                    |
| Ops/s `0 0 0 29 2 *`         | 176 714                    | 67 920                    | N/A :x:          | 3 104 :warning:      | 737 :warning:                    |
| **Tests**                 | **11/11**             | **10/11**            | **0/11** [^4] :question:    |  **7/11** :warning:                  | **9/11**             |

> **Note**
> *   Table last updated at 2023-10-10
> *   node-cron has no interface to predict when the function will run, so tests cannot be carried out.
> *   All tests and benchmarks were carried out using [https://github.com/Hexagon/cron-comparison](https://github.com/Hexagon/cron-comparison)

[^1]: As of 2023-10-10
[^2]: Requires support for L-modifier
[^3]: In dom-AND-dow mode, only supported by croner at the moment.
[^4]: Node-cron has no way of showing next run time.

</details>

## Development

### Master branch

![Node.js CI](https://github.com/Hexagon/croner/workflows/Node.js%20CI/badge.svg?branch=master) ![Deno CI](https://github.com/Hexagon/croner/workflows/Deno%20CI/badge.svg?branch=master) ![Bun CI](https://github.com/Hexagon/croner/workflows/Bun%20CI/badge.svg?branch=master) 

This branch contains the latest stable code, released on npm's default channel `latest`. You can install the latest stable revision by running the command below.

```
npm install croner --save
```

### Dev branch

![Node.js CI](https://github.com/Hexagon/croner/workflows/Node.js%20CI/badge.svg?branch=dev) ![Deno CI](https://github.com/Hexagon/croner/workflows/Deno%20CI/badge.svg?branch=dev) ![Bun CI](https://github.com/Hexagon/croner/workflows/Bun%20CI/badge.svg?branch=dev) 

This branch contains code currently being tested, and is released at channel `dev` on npm. You can install the latest revision of the development branch by running the command below.

```
npm install croner@dev
```

> **Warning**
> Expect breaking changes if you do not pin to a specific version.

A list of fixes and features currently released in the `dev` branch is available [here](https://github.com/Hexagon/croner/issues?q=is%3Aopen+is%3Aissue+label%3Areleased-in-dev)

## Contributing & Support

Croner is founded and actively maintained by Hexagon. If you find value in Croner and want to contribute:

- Code Contributions: See our [Contribution Guide](https://croner.56k.guru/contributing/) for details on how to contribute code.

- Sponsorship and Donations: See [github.com/sponsors/hexagon](https://github.com/sponsors/hexagon)

Your trust, support, and contributions drive the project. Every bit, irrespective of its size, is deeply appreciated.

## License

MIT License
