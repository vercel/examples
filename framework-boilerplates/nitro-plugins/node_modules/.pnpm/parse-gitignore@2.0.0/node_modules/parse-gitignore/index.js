/*!
 * parse-gitignore <https://github.com/jonschlinkert/parse-gitignore>
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

const fs = require('fs');
const isObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);

// eslint-disable-next-line no-control-regex
const INVALID_PATH_CHARS_REGEX = /[<>:"|?*\n\r\t\f\x00-\x1F]/;
const GLOBSTAR_REGEX = /(?:^|\/)[*]{2}($|\/)/;
const MAX_PATH_LENGTH = 260 - 12;

const isValidPath = input => {
  if (typeof input === 'string') {
    return input.length <= MAX_PATH_LENGTH && !INVALID_PATH_CHARS_REGEX.test(input);
  }
  return false;
};

const split = str => String(str).split(/\r\n?|\n/);
const isComment = str => str.startsWith('#');
const isParsed = input => isObject(input) && input.patterns && input.sections;

const patterns = input => {
  return split(input).map(l => l.trim()).filter(line => line !== '' && !isComment(line));
};

const parse = (input, options = {}) => {
  let filepath = options.path;

  if (isParsed(input)) return input;
  if (isValidPath(input) && fs.existsSync(input)) {
    filepath = input;
    input = fs.readFileSync(input);
  }

  const lines = split(input);
  const names = new Map();

  let parsed = { sections: [], patterns: [] };
  let section = { name: 'default', patterns: [] };
  let prev;

  for (const line of lines) {
    const value = line.trim();

    if (value.startsWith('#')) {
      const [, name] = /^#+\s*(.*)\s*$/.exec(value);

      if (prev) {
        names.delete(prev.name);
        prev.comment += value ? `\n${value}` : '';
        prev.name = name ? `${prev.name.trim()}\n${name.trim()}` : prev.name.trim();
        names.set(prev.name.toLowerCase().trim(), prev);
        continue;
      }

      section = { name: name.trim(), comment: value, patterns: [] };
      names.set(section.name.toLowerCase(), section);
      parsed.sections.push(section);
      prev = section;
      continue;
    }

    if (value !== '') {
      section.patterns.push(value);
      parsed.patterns.push(value);
    }

    prev = null;
  }

  if (options.dedupe === true || options.unique === true) {
    parsed = dedupe(parsed, { ...options, format: false });
  }

  parsed.path = filepath;
  parsed.input = Buffer.from(input);
  parsed.format = opts => format(parsed, { ...options, ...opts });
  parsed.dedupe = opts => dedupe(parsed, { ...options, ...opts });
  parsed.globs = opts => globs(parsed, { path: filepath, ...options, ...opts });
  return parsed;
};

const parseFile = (filepath, options) => {
  return parse(fs.readFileSync(filepath, 'utf8'), options);
};

const dedupe = (input, options) => {
  const parsed = parse(input, { ...options, dedupe: false });

  const names = new Map();
  const res = { sections: [], patterns: new Set() };
  let current;

  // first, combine duplicate sections
  for (const section of parsed.sections) {
    const { name = '', comment, patterns } = section;
    const key = name.trim().toLowerCase();

    for (const pattern of patterns) {
      res.patterns.add(pattern);
    }

    if (name && names.has(key)) {
      current = names.get(key);
      current.patterns = [...current.patterns, ...patterns];
    } else {
      current = { name, comment, patterns };
      res.sections.push(current);
      names.set(key, current);
    }
  }

  // next, de-dupe patterns in each section
  for (const section of res.sections) {
    section.patterns = [...new Set(section.patterns)];
  }

  res.patterns = [...res.patterns];
  return res;
};

const glob = (pattern, options) => {
  // Return if a glob pattern has already been specified for sub-directories
  if (GLOBSTAR_REGEX.test(pattern)) {
    return pattern;
  }

  // If there is a separator at the beginning or middle (or both) of the pattern,
  // then the pattern is relative to the directory level of the particular .gitignore
  // file itself. Otherwise the pattern may also match at any level below the
  // .gitignore level. relative paths only
  let relative = false;
  if (pattern.startsWith('/')) {
    pattern = pattern.slice(1);
    relative = true;
  } else if (pattern.slice(1, pattern.length - 1).includes('/')) {
    relative = true;
  }

  // If there is a separator at the end of the pattern then the pattern will only match directories.
  pattern += pattern.endsWith('/') ? '**/' : '/**';

  // If not relative, the pattern can match any files and directories.
  return relative ? pattern : `**/${pattern}`;
};

const globs = (input, options = {}) => {
  const parsed = parse(input, options);
  const result = [];
  let index = 0;

  const patterns = parsed.patterns
    .concat(options.ignore || [])
    .concat((options.unignore || []).map(p => !p.startsWith('!') ? '!' + p : p));

  const push = (prefix, pattern) => {
    const prev = result[result.length - 1];
    const type = prefix ? 'unignore' : 'ignore';

    if (prev && prev.type === type) {
      if (!prev.patterns.includes(pattern)) {
        prev.patterns.push(pattern);
      }
    } else {
      result.push({ type, path: options.path || null, patterns: [pattern], index });
      index++;
    }
  };

  for (let pattern of patterns) {
    let prefix = '';

    // An optional prefix "!" which negates the pattern; any matching file excluded by
    // a previous pattern will become included again
    if (pattern.startsWith('!')) {
      pattern = pattern.slice(1);
      prefix = '!';
    }

    // add the raw pattern to the results
    push(prefix, (pattern.startsWith('/') ? pattern.slice(1) : pattern));

    // add the glob pattern to the results
    push(prefix, glob(pattern));
  }

  return result;
};

/**
 * Formats a .gitignore section
 */

const formatSection = (section = {}) => {
  const output = [section.comment || ''];

  if (section.patterns?.length) {
    output.push(section.patterns.join('\n'));
    output.push('');
  }

  return output.join('\n');
};

/**
 * Format a .gitignore file from the given input or object from `.parse()`.
 * @param {String} input File path or contents.
 * @param {Object} options
 * @return {String} Returns formatted string.
 * @api public
 */

const format = (input, options = {}) => {
  const parsed = parse(input, options);

  const fn = options.formatSection || formatSection;
  const sections = parsed.sections || parsed;
  const output = [];

  for (const section of [].concat(sections)) {
    output.push(fn(section));
  }

  return output.join('\n');
};

parse.file = parseFile;
parse.parse = parse;
parse.dedupe = dedupe;
parse.format = format;
parse.globs = globs;
parse.formatSection = formatSection;
parse.patterns = patterns;

/**
 * Expose `parse`
 */

module.exports = parse;
