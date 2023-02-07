import { parse } from 'next/dist/compiled/stacktrace-parser';
const regexNextStatic = /\/_next(\/static\/.+)/g;
export function parseStack(stack) {
    const frames = parse(stack);
    return frames.map((frame)=>{
        try {
            const url = new URL(frame.file);
            const res = regexNextStatic.exec(url.pathname);
            if (res) {
                var ref, ref1;
                const distDir = (ref1 = (ref = process.env.__NEXT_DIST_DIR) == null ? void 0 : ref.replace(/\\/g, '/')) == null ? void 0 : ref1.replace(/\/$/, '');
                if (distDir) {
                    frame.file = 'file://' + distDir.concat(res.pop());
                }
            }
        } catch (e) {}
        return frame;
    });
}

//# sourceMappingURL=parseStack.js.map