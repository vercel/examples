import worker from "./base-worker.mjs";
import dev from "./nitro-dev.mjs";
import prerender from "./nitro-prerender.mjs";
import sw from "./service-worker.mjs";
export default [...worker, ...dev, ...prerender, ...sw];
