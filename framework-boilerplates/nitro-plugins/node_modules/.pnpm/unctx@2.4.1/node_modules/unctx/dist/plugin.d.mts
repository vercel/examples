import * as unplugin from 'unplugin';
import { TransformerOptions } from './transform.mjs';
import 'magic-string';

interface UnctxPluginOptions extends TransformerOptions {
    transformInclude?: (id: string) => boolean;
}
declare const unctxPlugin: unplugin.UnpluginInstance<UnctxPluginOptions, boolean>;

export { type UnctxPluginOptions, unctxPlugin };
