import type { FilterPattern } from '@rollup/pluginutils';
import type { Plugin } from 'rollup';

type Replacement = string | ((id: string) => string);

export interface RollupReplaceOptions {
  /**
   * All other options are treated as `string: replacement` replacers,
   * or `string: (id) => replacement` functions.
   */
  [str: string]:
    | Replacement
    | RollupReplaceOptions['include']
    | RollupReplaceOptions['values']
    | RollupReplaceOptions['objectGuards']
    | RollupReplaceOptions['preventAssignment'];

  /**
   * A picomatch pattern, or array of patterns, of files that should be
   * processed by this plugin (if omitted, all files are included by default)
   */
  include?: FilterPattern;
  /**
   * Files that should be excluded, if `include` is otherwise too permissive.
   */
  exclude?: FilterPattern;
  /**
   * If false, skips source map generation. This will improve performance.
   * @default true
   */
  sourceMap?: boolean;
  /**
   * To replace every occurrence of `<@foo@>` instead of every occurrence
   * of `foo`, supply delimiters
   */
  delimiters?: [string, string];
  /**
   * When replacing dot-separated object properties like `process.env.NODE_ENV`,
   * will also replace `typeof process` object guard checks against the objects
   * with the string `"object"`.
   */
  objectGuards?: boolean;
  /**
   * Prevents replacing strings where they are followed by a single equals
   * sign.
   */
  preventAssignment?: boolean;
  /**
   * You can separate values to replace from other options.
   */
  values?: { [str: string]: Replacement };
}

/**
 * Replace strings in files while bundling them.
 */
export default function replace(options?: RollupReplaceOptions): Plugin;
