import { join, relative } from 'path';
import { findUp } from 'find-up';
const AUTO_PLUGINS_DIR = '.netlify/plugins/';
export const createAliases = (paths, pluginsModulesPath, aliases, basePath) => {
    paths.forEach((path) => {
        if (pluginsModulesPath === undefined || !path.startsWith(pluginsModulesPath)) {
            return;
        }
        const relativePath = relative(pluginsModulesPath, path);
        aliases.set(path, join(basePath, 'node_modules', relativePath));
    });
};
export const getPluginsModulesPath = (srcDir) => findUp(`${AUTO_PLUGINS_DIR}node_modules`, { cwd: srcDir, type: 'directory' });
