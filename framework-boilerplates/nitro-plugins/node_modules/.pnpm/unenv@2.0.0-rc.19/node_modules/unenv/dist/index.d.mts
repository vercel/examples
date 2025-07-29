//#region src/types.d.ts
interface CreateEnvOptions {
  /**
   * Node.js compatibility.
   *
   * - Add `alias` entries for Node.js builtins as `<id>` and `node:<id>`.
   * - Add `inject` entries for Node.js globals `global`, `Buffer`, and `process`.
   *
   * Default: `true`
   */
  nodeCompat?: boolean;
  /**
   * Add `alias` entries to replace npm packages like `node-fetch` with lighter shims.
   *
   * Default: `false`
   */
  npmShims?: boolean;
  /**
   * Additional presets.
   */
  presets?: Preset[];
  /**
   * Additional overrides.
   */
  overrides?: Partial<Environment>;
  /**
   * Resolve paths in the environment to absolute paths.
   *
   * Default: `false`
   */
  resolve?: boolean | EnvResolveOptions;
}
interface EnvResolveOptions {
  /**
   * Paths to resolve imports from.
   *
   * Always unenv path is appended.
   */
  paths?: (string | URL)[];
}
/**
 * Environment defined by presets.
 */
interface Environment {
  alias: Readonly<Record<string, string>>;
  inject: Readonly<Record<string, string | readonly string[] | false>>;
  polyfill: readonly string[];
  external: readonly string[];
}
/**
 * Environment returned by `defineEnv`.
 *
 * It differs from the preset's Environment as the `inject` map never contains a `false` value.
 */
interface ResolvedEnvironment extends Environment {
  inject: Readonly<Record<string, string | readonly string[]>>;
}
interface Preset extends Partial<Environment> {
  meta?: {
    /**
     * Preset name.
     */
    readonly name?: string;
    /**
     * Preset version.
     */
    readonly version?: string;
    /**
     * Path or URL to preset entry (used for resolving absolute paths).
     */
    readonly url?: string | URL;
  };
}
//#endregion
//#region src/env.d.ts
/**
 * Configure a target environment.
 */
declare function defineEnv(opts?: CreateEnvOptions): {
  env: ResolvedEnvironment;
  presets: Preset[];
};
//#endregion
export { CreateEnvOptions, EnvResolveOptions, Environment, Preset, ResolvedEnvironment, defineEnv };