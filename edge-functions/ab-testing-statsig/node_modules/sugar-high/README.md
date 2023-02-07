# Sugar High

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]

### Introduction

Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped

![img](https://repository-images.githubusercontent.com/453236442/1d63a6ff-aa11-422c-a36c-ca16fc102f18)

### Usage

```sh
npm install --save sugar-high
```

```js
import { highlight } from 'sugar-high'

const codeHTML = highlight(code)

document.querySelector('pre > code').innerHTML = codeHTML
```

### Highlight with CSS

Then make your own theme with customized colors by token type and put in global CSS. The corresponding class names star with `sh__` prefix.

```css
/**
 * Types that sugar-high have:
 *
 * identifier
 * keyword
 * string
 * Class, number and null
 * sign
 * comment
 * jsxliterals
 */
:root {
  --sh-class: #2d5e9d;
  --sh-identifier: #354150;
  --sh-sign: #8996a3;
  --sh-string: #00a99a;
  --sh-keyword: #f47067;
  --sh-comment: #a19595;
  --sh-jsxliterals: #6266d1;
}
```

### Features

#### Line number

Sugar high provide `.sh_line` class name for each line. To display line number, define the `.sh_line::before` element with CSS will enable line numbers automatically.

```css
pre code {
  counter-reset: sh-line-number;
}

.sh__line::before {
  counter-increment: sh-line-number 1;
  content: counter(sh-line-number);
  margin-right: 24px;
  text-align: right;
  color: #a4a4a4;
}
```

### LICENSE

MIT

<!-- Definitions -->

[build-badge]: https://github.com/huozhi/sugar-high/workflows/Test/badge.svg

[build]: https://github.com/huozhi/sugar-high/actions

[coverage-badge]: https://badge.fury.io/js/sugar-high.svg

[coverage]: https://codecov.io/github/huozhi/sugar-high

[downloads-badge]: https://img.shields.io/npm/dm/sugar-high.svg

[downloads]: https://www.npmjs.com/package/sugar-high
