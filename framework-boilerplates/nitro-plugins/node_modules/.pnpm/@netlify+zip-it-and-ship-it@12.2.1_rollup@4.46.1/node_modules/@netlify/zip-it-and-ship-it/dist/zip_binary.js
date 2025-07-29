import { startZip, addZipFile, addZipContent, endZip } from './archive.js';
// Zip a binary function file
export const zipBinary = async function ({ destPath, filename, runtime, srcPath, stat, }) {
    const { archive, output } = startZip(destPath);
    addZipFile(archive, srcPath, filename, stat);
    addZipContent(archive, JSON.stringify({ runtime: runtime.name }), 'netlify-toolchain');
    await endZip(archive, output);
};
