import _extends from "@swc/helpers/src/_extends.mjs";
import Anser from 'next/dist/compiled/anser';
import * as React from 'react';
export const Terminal = function Terminal({ content ,  }) {
    const decoded = React.useMemo(()=>{
        return Anser.ansiToJson(content, {
            json: true,
            use_classes: true,
            remove_empty: true
        });
    }, [
        content
    ]);
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-terminal": true
    }, /*#__PURE__*/ React.createElement("pre", null, decoded.map((entry, index)=>/*#__PURE__*/ React.createElement("span", {
            key: `terminal-entry-${index}`,
            style: _extends({
                color: entry.fg ? `var(--color-${entry.fg})` : undefined
            }, entry.decoration === 'bold' ? {
                fontWeight: 800
            } : entry.decoration === 'italic' ? {
                fontStyle: 'italic'
            } : undefined)
        }, entry.content))));
};

//# sourceMappingURL=Terminal.js.map