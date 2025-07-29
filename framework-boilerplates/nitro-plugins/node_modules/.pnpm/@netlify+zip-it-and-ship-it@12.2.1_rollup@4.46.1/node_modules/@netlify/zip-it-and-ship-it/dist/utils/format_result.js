import { removeUndefined } from './remove_undefined.js';
// Takes the result of zipping a function and formats it for output.
export const formatZipResult = (archive) => {
    const functionResult = {
        ...archive,
        staticAnalysisResult: undefined,
        routes: archive.staticAnalysisResult?.routes,
        excludedRoutes: archive.staticAnalysisResult?.excludedRoutes,
        runtime: archive.runtime.name,
        schedule: archive.staticAnalysisResult?.config?.schedule ?? archive?.config?.schedule,
        runtimeAPIVersion: archive.staticAnalysisResult?.runtimeAPIVersion,
    };
    return removeUndefined(functionResult);
};
