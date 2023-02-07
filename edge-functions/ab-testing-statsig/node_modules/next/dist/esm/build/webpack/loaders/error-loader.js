import chalk from "next/dist/compiled/chalk";
import path from "path";
const ErrorLoader = function() {
    var ref, ref1, ref2;
    // @ts-ignore exists
    const options = this.getOptions() || {};
    const { reason ="An unknown error has occurred"  } = options;
    // @ts-expect-error
    const resource = ((ref = this._module) == null ? void 0 : (ref1 = ref.issuer) == null ? void 0 : ref1.resource) ?? null;
    const context = this.rootContext ?? ((ref2 = this._compiler) == null ? void 0 : ref2.context);
    const issuer = resource ? context ? path.relative(context, resource) : resource : null;
    const err = new Error(reason + (issuer ? `\nLocation: ${chalk.cyan(issuer)}` : ""));
    this.emitError(err);
};
export default ErrorLoader;

//# sourceMappingURL=error-loader.js.map