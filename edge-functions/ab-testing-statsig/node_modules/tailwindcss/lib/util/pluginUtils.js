"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    updateAllClasses: ()=>updateAllClasses,
    filterSelectorsForClass: ()=>filterSelectorsForClass,
    asValue: ()=>asValue,
    parseColorFormat: ()=>parseColorFormat,
    asColor: ()=>asColor,
    asLookupValue: ()=>asLookupValue,
    typeMap: ()=>typeMap,
    coerceValue: ()=>coerceValue,
    getMatchingTypes: ()=>getMatchingTypes
});
const _postcssSelectorParser = /*#__PURE__*/ _interopRequireDefault(require("postcss-selector-parser"));
const _escapeCommas = /*#__PURE__*/ _interopRequireDefault(require("./escapeCommas"));
const _withAlphaVariable = require("./withAlphaVariable");
const _dataTypes = require("./dataTypes");
const _negateValue = /*#__PURE__*/ _interopRequireDefault(require("./negateValue"));
const _validateFormalSyntax = require("./validateFormalSyntax");
const _featureFlagsJs = require("../featureFlags.js");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function updateAllClasses(selectors, updateClass) {
    let parser = (0, _postcssSelectorParser.default)((selectors)=>{
        selectors.walkClasses((sel)=>{
            let updatedClass = updateClass(sel.value);
            sel.value = updatedClass;
            if (sel.raws && sel.raws.value) {
                sel.raws.value = (0, _escapeCommas.default)(sel.raws.value);
            }
        });
    });
    let result = parser.processSync(selectors);
    return result;
}
function filterSelectorsForClass(selectors, classCandidate) {
    let parser = (0, _postcssSelectorParser.default)((selectors)=>{
        selectors.each((sel)=>{
            const containsClass = sel.nodes.some((node)=>node.type === "class" && node.value === classCandidate);
            if (!containsClass) {
                sel.remove();
            }
        });
    });
    let result = parser.processSync(selectors);
    return result;
}
function resolveArbitraryValue(modifier, validate) {
    if (!isArbitraryValue(modifier)) {
        return undefined;
    }
    let value = modifier.slice(1, -1);
    if (!validate(value)) {
        return undefined;
    }
    return (0, _dataTypes.normalize)(value);
}
function asNegativeValue(modifier, lookup = {}, validate) {
    let positiveValue = lookup[modifier];
    if (positiveValue !== undefined) {
        return (0, _negateValue.default)(positiveValue);
    }
    if (isArbitraryValue(modifier)) {
        let resolved = resolveArbitraryValue(modifier, validate);
        if (resolved === undefined) {
            return undefined;
        }
        return (0, _negateValue.default)(resolved);
    }
}
function asValue(modifier, options = {}, { validate =()=>true  } = {}) {
    var ref;
    let value = (ref = options.values) === null || ref === void 0 ? void 0 : ref[modifier];
    if (value !== undefined) {
        return value;
    }
    if (options.supportsNegativeValues && modifier.startsWith("-")) {
        return asNegativeValue(modifier.slice(1), options.values, validate);
    }
    return resolveArbitraryValue(modifier, validate);
}
function isArbitraryValue(input) {
    return input.startsWith("[") && input.endsWith("]");
}
function splitUtilityModifier(modifier) {
    let slashIdx = modifier.lastIndexOf("/");
    if (slashIdx === -1 || slashIdx === modifier.length - 1) {
        return [
            modifier,
            undefined
        ];
    }
    let arbitrary = isArbitraryValue(modifier);
    // The modifier could be of the form `[foo]/[bar]`
    // We want to handle this case properly
    // without affecting `[foo/bar]`
    if (arbitrary && !modifier.includes("]/[")) {
        return [
            modifier,
            undefined
        ];
    }
    return [
        modifier.slice(0, slashIdx),
        modifier.slice(slashIdx + 1)
    ];
}
function parseColorFormat(value) {
    if (typeof value === "string" && value.includes("<alpha-value>")) {
        let oldValue = value;
        return ({ opacityValue =1  })=>oldValue.replace("<alpha-value>", opacityValue);
    }
    return value;
}
function asColor(_, options = {}, { tailwindConfig ={} , utilityModifier , rawModifier  } = {}) {
    var ref;
    if (((ref = options.values) === null || ref === void 0 ? void 0 : ref[rawModifier]) !== undefined) {
        var ref1;
        return parseColorFormat((ref1 = options.values) === null || ref1 === void 0 ? void 0 : ref1[rawModifier]);
    }
    // TODO: Hoist this up to getMatchingTypes or something
    // We do this here because we need the alpha value (if any)
    let [color, alpha] = splitUtilityModifier(rawModifier);
    if (alpha !== undefined) {
        var ref2, ref3, ref4;
        var ref5;
        let normalizedColor = (ref5 = (ref2 = options.values) === null || ref2 === void 0 ? void 0 : ref2[color]) !== null && ref5 !== void 0 ? ref5 : isArbitraryValue(color) ? color.slice(1, -1) : undefined;
        if (normalizedColor === undefined) {
            return undefined;
        }
        normalizedColor = parseColorFormat(normalizedColor);
        if (isArbitraryValue(alpha)) {
            return (0, _withAlphaVariable.withAlphaValue)(normalizedColor, alpha.slice(1, -1));
        }
        if (((ref3 = tailwindConfig.theme) === null || ref3 === void 0 ? void 0 : (ref4 = ref3.opacity) === null || ref4 === void 0 ? void 0 : ref4[alpha]) === undefined) {
            return undefined;
        }
        return (0, _withAlphaVariable.withAlphaValue)(normalizedColor, tailwindConfig.theme.opacity[alpha]);
    }
    return asValue(rawModifier, options, {
        rawModifier,
        utilityModifier,
        validate: _dataTypes.color
    });
}
function asLookupValue(modifier, options = {}) {
    var ref;
    return (ref = options.values) === null || ref === void 0 ? void 0 : ref[modifier];
}
function guess(validate) {
    return (modifier, options, extras)=>{
        return asValue(modifier, options, {
            ...extras,
            validate
        });
    };
}
let typeMap = {
    any: asValue,
    color: asColor,
    url: guess(_dataTypes.url),
    image: guess(_dataTypes.image),
    length: guess(_dataTypes.length),
    percentage: guess(_dataTypes.percentage),
    position: guess(_dataTypes.position),
    lookup: asLookupValue,
    "generic-name": guess(_dataTypes.genericName),
    "family-name": guess(_dataTypes.familyName),
    number: guess(_dataTypes.number),
    "line-width": guess(_dataTypes.lineWidth),
    "absolute-size": guess(_dataTypes.absoluteSize),
    "relative-size": guess(_dataTypes.relativeSize),
    shadow: guess(_dataTypes.shadow),
    size: guess(_validateFormalSyntax.backgroundSize)
};
let supportedTypes = Object.keys(typeMap);
function splitAtFirst(input, delim) {
    let idx = input.indexOf(delim);
    if (idx === -1) return [
        undefined,
        input
    ];
    return [
        input.slice(0, idx),
        input.slice(idx + 1)
    ];
}
function coerceValue(types, modifier, options, tailwindConfig) {
    if (isArbitraryValue(modifier)) {
        let arbitraryValue = modifier.slice(1, -1);
        let [explicitType, value] = splitAtFirst(arbitraryValue, ":");
        // It could be that this resolves to `url(https` which is not a valid
        // identifier. We currently only support "simple" words with dashes or
        // underscores. E.g.: family-name
        if (!/^[\w-_]+$/g.test(explicitType)) {
            value = arbitraryValue;
        } else if (explicitType !== undefined && !supportedTypes.includes(explicitType)) {
            return [];
        }
        if (value.length > 0 && supportedTypes.includes(explicitType)) {
            return [
                asValue(`[${value}]`, options),
                explicitType,
                null
            ];
        }
    }
    let matches = getMatchingTypes(types, modifier, options, tailwindConfig);
    // Find first matching type
    for (let match of matches){
        return match;
    }
    return [];
}
function* getMatchingTypes(types, rawModifier, options, tailwindConfig) {
    let modifiersEnabled = (0, _featureFlagsJs.flagEnabled)(tailwindConfig, "generalizedModifiers");
    let [modifier, utilityModifier] = splitUtilityModifier(rawModifier);
    let canUseUtilityModifier = modifiersEnabled && options.modifiers != null && (options.modifiers === "any" || typeof options.modifiers === "object" && (utilityModifier && isArbitraryValue(utilityModifier) || utilityModifier in options.modifiers));
    if (!canUseUtilityModifier) {
        modifier = rawModifier;
        utilityModifier = undefined;
    }
    if (utilityModifier !== undefined && modifier === "") {
        modifier = "DEFAULT";
    }
    // Check the full value first
    // TODO: Move to asValue… somehow
    if (utilityModifier !== undefined) {
        if (typeof options.modifiers === "object") {
            var ref;
            var ref1;
            let configValue = (ref1 = (ref = options.modifiers) === null || ref === void 0 ? void 0 : ref[utilityModifier]) !== null && ref1 !== void 0 ? ref1 : null;
            if (configValue !== null) {
                utilityModifier = configValue;
            } else if (isArbitraryValue(utilityModifier)) {
                utilityModifier = utilityModifier.slice(1, -1);
            }
        }
        let result = asValue(rawModifier, options, {
            rawModifier,
            utilityModifier,
            tailwindConfig
        });
        if (result !== undefined) {
            yield [
                result,
                "any",
                null
            ];
        }
    }
    for (const { type  } of types !== null && types !== void 0 ? types : []){
        let result1 = typeMap[type](modifier, options, {
            rawModifier,
            utilityModifier,
            tailwindConfig
        });
        if (result1 === undefined) {
            continue;
        }
        yield [
            result1,
            type,
            utilityModifier !== null && utilityModifier !== void 0 ? utilityModifier : null
        ];
    }
}
