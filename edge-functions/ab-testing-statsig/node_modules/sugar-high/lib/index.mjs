// @ts-check

const jsxBrackets = new Set(['<', '>', '{', '}', '[', ']'])
const keywords = new Set([
  'for',
  'do',
  'while',
  'if',
  'else',
  'return',
  'function',
  'var',
  'let',
  'const',
  'true',
  'false',
  'undefined',
  'this',
  'new',
  'delete',
  'typeof',
  'in',
  'instanceof',
  'void',
  'break',
  'continue',
  'switch',
  'case',
  'default',
  'throw',
  'try',
  'catch',
  'finally',
  'debugger',
  'with',
  'yield',
  'async',
  'await',
  'class',
  'extends',
  'super',
  'import',
  'export',
  'from',
  'static',
])

const signs = new Set([
  '+',
  '-',
  '*',
  '/',
  '%',
  '=',
  '!',
  '&',
  '|',
  '^',
  '~',
  '!',
  '?',
  ':',
  '.',
  ',',
  ';',
  `'`,
  '"',
  '.',
  '(',
  ')',
  '[',
  ']',
  '#',
  '@',
  '\\',
  ...jsxBrackets,
])

export const types = [
  'identifier',
  'keyword',
  'string',
  'class',
  'sign',
  'comment',
  'break',
  'space',
  'jsxliterals'
]

/**
 *
 * 0 - identifier
 * 1 - keyword
 * 2 - string
 * 3 - Class, number and null
 * 4 - sign
 * 5 - comment
 * 6 - break
 * 7 - space
 * 8 - jsx literals
 *
 */
const [
  T_IDENTIFIER,
  T_KEYWORD,
  T_STRING,
  T_CLS_NUMBER,
  T_SIGN,
  T_COMMENT,
  T_BREAK,
  T_SPACE,
  T_JSX_LITERALS,
] = types.map((_, i) => i)

function isSpaces(str) {
  return /^[^\S\r\n]+$/g.test(str)
}

function encode(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function isWord(chr) {
  return /^[\w_]+$/.test(chr) || hasUnicode(chr)
}

function isCls(str) {
  const chr0 = str[0]
  return isWord(chr0) &&
    chr0 === chr0.toUpperCase() ||
    str === 'null'
}

function hasUnicode(s) {
  return /[^\u0000-\u007f]/.test(s);
}

function isIdentifierChar(chr) {
  return /^[a-zA-Z_$]$/.test(chr) || hasUnicode(chr)
}

function isIdentifier(str) {
  return isIdentifierChar(str[0]) && (str.length === 1 || isWord(str.slice(1)))
}

function isStrTemplateChr(chr) {
  return chr === '`'
}

function isSingleQuotes(chr) {
  return chr === '"' || chr === "'"
}

function isStringQuotation(chr) {
  return isSingleQuotes(chr) || isStrTemplateChr(chr)
}

function isCommentStart(str) {
  str = str.slice(0, 2)
  return str === '//' || str === '/*'
}

function isRegexStart(str) {
  return str[0] === '/' && !isCommentStart(str[0] + str[1])
}

/**
 * @param {string} code
 * @return {Array<[number, string]>}
 */
export function tokenize(code) {
  let current = ''
  let type = -1
  let last = [null, null]
  /** @type {Array<[number, string]>} */
  const tokens = []

  let __jsxEnter = false
  /**
   * @type {0 | 1 | 2}
   * 0 for not in jsx
   * 1 for open jsx tag
   * 2 for closing jsx tag
   **/
  let __jsxTag = 0
  let __jsxExpr = false

  // only match paired (open + close) tags, not self-closing tags
  let __jsxStack = 0
  const __jsxChild = () => __jsxEnter && !__jsxExpr && !__jsxTag
  const inJsxTag = () => __jsxTag && !__jsxChild()
  const inJsxLiterals = () => !__jsxTag && __jsxChild() && !__jsxExpr && __jsxStack > 0

  /** @type {string | 0} */
  let __strQuote = 0
  let __strTemplateExprStack = 0
  let __strTemplateQuoteStack = 0
  const inStrTemplateLiterals = () => (__strTemplateQuoteStack > __strTemplateExprStack)
  const inStrTemplateExpr = () => __strTemplateQuoteStack > 0 && (__strTemplateQuoteStack === __strTemplateExprStack)

  /**
   *
   * @param {string} token
   * @returns {number}
   */
  function classify(token) {
    const isJsxLiterals = inJsxLiterals()
    if (isJsxLiterals) {
      return T_JSX_LITERALS
    } else if (keywords.has(token)) {
      return last[1] === '.' ? T_IDENTIFIER : T_KEYWORD
    } else if (token === '\n') {
      return T_BREAK
    } else if (isSpaces(token)) {
      return T_SPACE
    } else if (token.split('').every(ch => signs.has(ch))) {
      return T_SIGN
    } else if (isCls(token)) {
      return inJsxTag() ? T_IDENTIFIER : T_CLS_NUMBER
    } else {
      return isIdentifier(token) && !inStrTemplateLiterals() && (__strQuote !== `"` && __strQuote !== `'`) ? T_IDENTIFIER : T_STRING
    }
  }

  const append = (_type, _token) => {
    if (_token) {
      current = _token
    }
    if (current) {
      type = _type || classify(current)
      /** @type [number, string]  */
      const pair = [type, current]
      if (type !== T_SPACE && type !== T_BREAK) {
        last = pair
      }
      tokens.push(pair)
    }
    current = ''
  }
  for (let i = 0; i < code.length; i++) {
    const curr = code[i]
    const prev = code[i - 1]
    const next = code[i + 1]
    const p_c = prev + curr // previous and current
    const c_n = curr + next // current and next

    if (isSingleQuotes(curr)) {
      append()
      if (prev !== `\\`) {
        if (__strQuote && curr === __strQuote) {
          __strQuote = 0
        } else if (!__strQuote) {
          __strQuote = curr
        }
      }

      append(T_STRING, curr)
      continue
    }

    if (!inStrTemplateLiterals()) {
      if (prev !== '\\n' && isStrTemplateChr(curr)) {
        append()
        append(T_STRING, curr)
        __strTemplateQuoteStack++
        continue
      }
    }

    if (inStrTemplateLiterals()) {
      if (prev !== '\\n' && isStrTemplateChr(curr)) {
        if (__strTemplateQuoteStack > 0) {
          append()
          __strTemplateQuoteStack--
          append(T_STRING, curr)
          continue
        }
      }

      if (c_n === '${') {
        __strTemplateExprStack++
        append(T_STRING)
        append(T_SIGN, c_n)
        i++
        continue
      }
    }

    if (inStrTemplateExpr() && curr === '}') {
      append()
      __strTemplateExprStack--
      append(T_SIGN, curr)
      continue
    }

    if (__jsxChild()) {
      if (curr === '{') {
        append()
        append(T_SIGN, curr)
        __jsxExpr = true
        continue
      }
    }

    if (__jsxEnter) {
      // <: open tag sign
      if (!__jsxTag && curr === '<') {
        append()
        __jsxTag = 1
        current = curr
        if (next === '/') {
          __jsxTag = 2
          current = c_n
          i++
        }
        append(T_SIGN)
        continue
      }
      if (__jsxTag) {
        // >: open tag close sign or closing tag closing sign
        // and it's not `=>` or `/>`
        if (curr === '>' && !'/='.includes(prev)) {
          append()
          if (__jsxTag === 1) {
            __jsxTag = 0
            __jsxStack++
          } else {
            __jsxTag = 0
            __jsxEnter = false
          }
          append(T_SIGN, curr)
          continue
        }

        // >: tag self close sign or close tag sign
        if (c_n === '/>' || c_n === '</') {
          append()
          if (c_n === '/>') {
            __jsxTag = 0
          }
          if (c_n === '</') {
            __jsxStack--
          }
          current = c_n
          i++
          append(T_SIGN)
          continue
        }

        // <: open tag sign
        if (curr === '<') {
          append()
          current = curr
          append(T_SIGN)
          continue
        }
      }
    }

    // if it's not in a jsx tag declaration or a string, close child if next is jsx close tag
    if (!__jsxTag && (curr === '<' && isIdentifierChar(next) || c_n === '</')) {
      __jsxTag = next === '/' ? 2 : 1

      if (curr === '<' && next !== '/') {
        __jsxEnter = true
      }
    }

    const isQuotationChar = isStringQuotation(curr)
    const isStringTemplateLiterals = inStrTemplateLiterals()
    const isRegexChar = !__jsxEnter && isRegexStart(c_n)
    const isJsxLiterals = inJsxLiterals()

    // string quotation
    if (isQuotationChar || isStringTemplateLiterals || isSingleQuotes(__strQuote)) {
      current += curr
    } else if (isRegexChar) {
      append()
      const [lastType, lastToken] = last
      // Special cases that are not considered as regex:
      // * (expr1) / expr2: `)` before `/` operator is still in expression
      // * <non comment start>/ expr: non comment start before `/` is not regex
      if (
        isRegexChar &&
        lastType &&
        !(
          (lastType === T_SIGN && ')' !== lastToken) ||
          lastType === T_COMMENT
        )
      ) {
        current = curr
        append()
        continue
      }

      const start = i++

      // end of line of end of file
      const isEof = () => i >= code.length
      const isEol = () => isEof() || code[i] === '\n'

      let foundClose = false
      // regex
      for (; !isEol(); i++) {
        if (code[i] === '/' && code[i - 1] !== '\\') {
          foundClose = true
          // append regex flags
          while (start !== i && /^[a-z]$/.test(code[i + 1]) && !isEol()) {
            i++
          }
          break
        }
      }
      if (start !== i && foundClose) {
        // If current line is fully closed with string quotes or regex slashes,
        // add them to tokens
        current = code.slice(start, i + 1)
        append(T_STRING)
      } else {
        // If it doesn't match any of the above, just leave it as operator and move on
        current = curr
        append()
        i = start
      }
    } else if (isCommentStart(c_n)) {
      append()
      const start = i
      if (next === '/') {
        for (; i < code.length && code[i] !== '\n'; i++);
      } else {
        for (; i < code.length && code[i - 1] + code[i] !== '*/'; i++);
      }
      current = code.slice(start, i + 1)
      append(T_COMMENT)
    } else if (curr === ' ' || curr === '\n') {
      if (
        curr === ' ' &&
        (
          (isSpaces(current) || !current) ||
          isJsxLiterals
        )
      ) {
        current += curr
        if (next === '<') {
          append()
        }
      } else {
        append()
        current = curr
        append()
      }
    } else {
      if (__jsxExpr && curr === '}') {
        append()
        current = curr
        append()
        __jsxExpr = false
      } else if (
        // it's jsx literals and is not a jsx bracket
        (isJsxLiterals && !jsxBrackets.has(curr)) ||
        // same type char as previous one in current token
        ((isWord(curr) === isWord(current[current.length - 1]) || __jsxChild()) && !signs.has(curr))
      ) {
        current += curr
      } else {
        if (p_c === '</') {
          current = p_c
        }
        append()

        if (p_c !== '</') {
          current = curr

        }
        if ((c_n === '</' || c_n === '/>')) {
          current = c_n
          append()
          i++
        }
        else if (jsxBrackets.has(curr)) append()
      }
    }
  }

  append()

  return tokens
}

/**
 * @param {Array<[number, string]>} tokens
 * @return {Array<string>}
 */
function generate(tokens) {
  const linesHtml = []
  const createLine = (content) => `<span class="sh__line">${content}</span>`

  function flushLine(tokens) {
    linesHtml.push(createLine(
      tokens.map(([type, value]) => (
        `<span style="color: var(--sh-${types[type]})">${encode(value)}</span>`
      ))
      .join('')
    ))
  }
  const lineTokens = []
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const [type, value] = token
    if (type !== T_BREAK) {
      // Divide multi-line token into multi-line code
      if (value.includes('\n')) {
        const lines = value.split('\n')
        for (let j = 0; j < lines.length; j++) {
          lineTokens.push([type, lines[j]])
          if (j < lines.length - 1) {
            flushLine(lineTokens)
            lineTokens.length = 0
          }
        }
      } else {
        lineTokens.push(token)
      }
    } else {
      lineTokens.push([type, ''])
      flushLine(lineTokens)
      lineTokens.length = 0
    }
  }

  if (lineTokens.length)
    flushLine(lineTokens)

  return linesHtml
}

/**
 *
 * @param {string} code
 * @returns {string}
 */
export function highlight(code) {
  const tokens = tokenize(code)
  const output = generate(tokens).join('\n')
  return output
}