import { loadRequireHook, overrideBuiltInReactPackages } from "../build/webpack/require-hook";
loadRequireHook();
const isPrebundled = false;
if (isPrebundled) {
    overrideBuiltInReactPackages();
}

//# sourceMappingURL=initialize-require-hook.js.map