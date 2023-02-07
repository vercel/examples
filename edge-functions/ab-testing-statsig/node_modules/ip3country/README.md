[![npm version](https://badge.fury.io/js/ip3country.svg)](https://badge.fury.io/js/ip3country) [![install size](https://packagephobia.com/badge?p=ip3country)](https://packagephobia.com/result?p=ip3country) [![tests](https://github.com/statsig-io/ip3country/actions/workflows/tests.yml/badge.svg)](https://github.com/statsig-io/ip3country/actions/workflows/tests.yml)

# ip3country

This is a zero-dependency, super small, IP address to 2-letter [country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) lookup library. There are already several libraries available, but none met our requirements for binary size and speed.

This project in its entirety is <300KB, compared to most alternatives out there that are north of 40MB (but might provide more than just countries).

(Other languages: Python: https://github.com/statsig-io/ip3country-py, Go: https://github.com/statsig-io/ip3country-go, Ruby: https://github.com/statsig-io/ip3country-ruby, Kotlin: https://github.com/statsig-io/ip3country-kotlin, C#/.Net: https://github.com/statsig-io/ip3country-dotnet)

The database used in this project is compacted from [IP2Location](https://lite.ip2location.com/database/ip-country). Their DB1.LITE edition is provided under CCA, with the attribution below:

---

**NOTE**

This site or product includes IP2Location LITE data available from <a href="https://lite.ip2location.com">https://lite.ip2location.com</a>.

---

## Usage

```bash
$ npm install ip3country
```

```js
// Setup
const ip3country = require("ip3country");

ip3country.init();

// Lookup using ip4 str
ip3country.lookupStr("123.45.67.8"); // 'KR'.

// Lookup using numeric ip
console.log(ip3country.lookupNumeric(2066563848));
```

## Accuracy

`ip3country`'s accuracy is dependent on IP2Location LITE's accuracy. In our experience, for country lookups, it is accurate enough for most applications.

IP2Location publishes accuracy reports here: https://www.ip2location.com/data-accuracy

There's also this third party report available: https://www.cl.cam.ac.uk/~nz247/publications/JSAC2011-Geolocation.pdf

## Binary data

To make this library easy to consume, we're using [btoj](https://github.com/statsig-io/btoj) to transform the necessary binary data into a js module that can be imported like any other module. You won't need to list `ip3country` as an external in your build process.

We're currently using brotli compression via [NodeJS's `zlib` library](https://nodejs.org/api/zlib.html#zlib_zlib_brotlicompresssync_buffer_options), which won't work in Browser environments. If you want `ip3country` on a browser, check version `3.0.0` (and feel free to publish `ip3country-browser`).

## Name

All variants of "ip2country" were already taken in npm, so we decided to step it up.

## Motivation

At [Statsig](https://www.statsig.com), we needed a library to evaluate location-based conditions on Feature Gates (Feature Flags). We use ip3country to power country-level rollouts or A/B tests for new features.
