import { Plugin, OutputOptions } from "rollup";
import { Options as OpenOptions } from "open";
import { TemplateType } from "./template-types";
import { Filter } from "../shared/create-filter";
export interface PluginVisualizerOptions {
    /**
     * The path to the template file to use. Or just a name of a file.
     *
     * @default "stats.html"
     */
    filename?: string;
    /**
     * If plugin should emit json file with visualizer data. It can be used with plugin CLI
     *
     * @default false
     * @deprecated use template 'raw-data'
     */
    json?: boolean;
    /**
     * HTML <title> value in generated file. Ignored when `json` is true.
     *
     * @default "Rollup Visualizer"
     */
    title?: string;
    /**
     * If plugin should open browser with generated file. Ignored when `json` or `emitFile` is true.
     *
     * @default false
     */
    open?: boolean;
    openOptions?: OpenOptions;
    /**
     * Which diagram to generate. 'sunburst' or 'treemap' can help find big dependencies or if they are repeated.
     * 'network' can answer you why something was included.
     * 'flamegraph' will be familar to tools that you know already.
     *
     * @default 'treemap'
     */
    template?: TemplateType;
    /**
     * If plugin should also calculate sizes of gzipped files.
     *
     * @default false
     */
    gzipSize?: boolean;
    /**
     * If plugin should also calculate sizes of brotlied files.
     *
     * @default false
     */
    brotliSize?: boolean;
    /**
     * If plugin should use sourcemap to calculate sizes of modules. By idea it will present more accurate results.
     * `gzipSize` and `brotliSize` does not make much sense with this option.
     *
     * @default false
     */
    sourcemap?: boolean;
    /**
     * Absolute path where project is located. It is used to cut prefix from file's paths.
     *
     * @default process.cwd()
     */
    projectRoot?: string | RegExp;
    /**
     * Use rollup .emitFile API to generate files. Could be usefull if you want to output to configured by rollup output dir.
     * When this set to true, filename options must be filename and not a path.
     *
     * @default false
     */
    emitFile?: boolean;
    /**
     * A valid picomatch pattern, or array of patterns. If options.include is omitted or has zero length, filter will return true by
     * default. Otherwise, an ID must match one or more of the picomatch patterns, and must not match any of the options.exclude patterns.
     */
    include?: Filter | Filter[];
    /**
     * A valid picomatch pattern, or array of patterns. If options.include is omitted or has zero length, filter will return true by
     * default. Otherwise, an ID must match one or more of the picomatch patterns, and must not match any of the options.exclude patterns.
     */
    exclude?: Filter | Filter[];
}
export declare const visualizer: (opts?: PluginVisualizerOptions | ((outputOptions: OutputOptions) => PluginVisualizerOptions)) => Plugin;
export default visualizer;
