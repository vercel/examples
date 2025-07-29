import { createWriteStream, readlinkSync } from 'fs';
import archiver from 'archiver';
export const ARCHIVE_FORMAT = {
    NONE: 'none',
    ZIP: 'zip',
};
// Start zipping files
export const startZip = function (destPath) {
    const output = createWriteStream(destPath);
    const archive = archiver('zip');
    archive.pipe(output);
    return { archive, output };
};
// Add new file to zip
export const addZipFile = function (archive, file, name, stat) {
    if (stat.isSymbolicLink()) {
        const linkContent = readlinkSync(file);
        archive.symlink(name, linkContent, stat.mode);
    }
    else {
        archive.file(file, {
            name,
            mode: stat.mode,
            // Ensure sha256 stability regardless of mtime
            date: new Date(0),
            stats: stat,
        });
    }
};
// Add new file content to zip
export const addZipContent = function (archive, content, name) {
    archive.append(content, { name, date: new Date(0) });
};
// End zipping files
export const endZip = async function (archive, output) {
    const result = new Promise((resolve, reject) => {
        output.on('error', (error) => reject(error));
        output.on('finish', () => resolve());
    });
    await archive.finalize();
    return result;
};
