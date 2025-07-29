interface CodegenOptions {
    singleQuotes?: boolean;
}

type ESMImport = string | {
    name: string;
    as?: string;
};
type ESMExport = string | {
    name: string;
    as?: string;
};
interface ESMCodeGenOptions extends CodegenOptions {
    attributes?: {
        type: string;
    };
    /** @deprecated use attributes */
    assert?: {
        type: string;
    };
}
interface DynamicImportOptions extends ESMCodeGenOptions {
    comment?: string;
    wrapper?: boolean;
    interopDefault?: boolean;
}
/**
 * Generate an ESM `import` statement.
 *
 * @example
 *
 * ```js
 * genImport("pkg", "foo");
 * // ~> `import foo from "pkg";`
 *
 * genImport("pkg", ["foo"]);
 * // ~> `import { foo } from "pkg";`
 *
 * genImport("pkg", ["a", "b"]);
 * // ~> `import { a, b } from "pkg`;
 *
 * genImport("pkg", [{ name: "default", as: "bar" }]);
 * // ~> `import { default as bar } from "pkg`;
 *
 * genImport("pkg", [{ name: "foo", as: "bar" }]);
 * // ~> `import { foo as bar } from "pkg`;
 *
 * genImport("pkg", "foo", { attributes: { type: "json" } });
 * // ~> `import foo from "pkg" with { type: "json" };
 *
 * genExport("pkg", "foo");
 * // ~> `export foo from "pkg";`
 *
 * genExport("pkg", ["a", "b"]);
 * // ~> `export { a, b } from "pkg";`
 *
 * // export * as bar from "pkg"
 * genExport("pkg", { name: "*", as: "bar" });
 * // ~> `export * as bar from "pkg";`
 * ```
 *
 * @group ESM
 */
declare function genImport(specifier: string, imports?: ESMImport | ESMImport[], options?: ESMCodeGenOptions): string;
/**
 * Generate an ESM `import type` statement.
 *
 * @group ESM
 */
declare function genTypeImport(specifier: string, imports: ESMImport[], options?: ESMCodeGenOptions): string;
/**
 * Generate an ESM `export` statement.
 *
 * @group ESM
 */
declare function genExport(specifier: string, exports?: ESMExport | ESMExport[], options?: ESMCodeGenOptions): string;
/**
 * Generate an ESM dynamic `import()` statement.
 *
 * @group ESM
 */
declare function genDynamicImport(specifier: string, options?: DynamicImportOptions): string;

interface GenObjectOptions extends CodegenOptions {
    preserveTypes?: boolean;
}
/**
 * Serialize an object to a string.
 *
 * Values are not escaped or quoted.
 *
 * @example
 *
 * ```js
 * genObjectFromRaw({ foo: "bar", test: '() => import("pkg")' })
 * // ~> `{ foo: bar, test: () => import("pkg") }`
 * ```
 *
 * @group serialization
 */
declare function genObjectFromRaw(object: Record<string, any>, indent?: string, options?: GenObjectOptions): string;
/**
 * Serialize an object to a string.
 *
 * Values are escaped and quoted if necessary.
 *
 * @example
 *
 * ```js
 * genObjectFromValues({ foo: "bar" })
 * // ~> `{ foo: "bar" }`
 * ```
 *
 * @group serialization
 */
declare function genObjectFromValues(obj: Record<string, any>, indent?: string, options?: GenObjectOptions): string;
/**
 * Serialize an array to a string.
 *
 * Values are not escaped or quoted.
 *
 * @example
 *
 * ```js
 * genArrayFromRaw([1, 2, 3])
 * // ~> `[1, 2, 3]`
 * ```
 *
 * @group serialization
 */
declare function genArrayFromRaw(array: any[], indent?: string, options?: GenObjectOptions): string;
/**
 * Serialize an array of key-value pairs to a string.
 *
 * Values are not escaped or quoted.
 *
 * @group serialization
 */
declare function genObjectFromRawEntries(array: [key: string, value: any][], indent?: string, options?: GenObjectOptions): string;

/**
 * Generate a string with double or single quotes and handle escapes.
 *
 * @group string
 */
declare function genString(input: string, options?: CodegenOptions): string;
/**
 * Escape a string for use in a javascript string.
 *
 * @group string
 */
declare function escapeString(id: string): string;
/**
 * Generate a safe javascript variable name.
 *
 * @group string
 */
declare function genSafeVariableName(name: string): string;

type TypeObject = {
    [key: string]: string | TypeObject;
};
interface GenInterfaceOptions {
    extends?: string | string[];
    export?: boolean;
}
/**
 * Generate a typescript `export type` statement.
 *
 * @group Typescript
 */
declare function genTypeExport(specifier: string, imports: ESMImport[], options?: ESMCodeGenOptions): string;
/**
 * Generate an typescript `typeof import()` statement for default import.
 *
 * @group Typescript
 */
declare function genInlineTypeImport(specifier: string, name?: string, options?: ESMCodeGenOptions): string;
/**
 * Generate typescript object type.
 *
 * @group Typescript
 */
declare function genTypeObject(object: TypeObject, indent?: string): string;
/**
 * Generate typescript interface.
 *
 * @group Typescript
 */
declare function genInterface(name: string, contents?: TypeObject, options?: GenInterfaceOptions, indent?: string): string;
/**
 * Generate typescript `declare module` augmentation.
 *
 * @group Typescript
 */
declare function genAugmentation(specifier: string, interfaces?: Record<string, TypeObject | [TypeObject, Omit<GenInterfaceOptions, "export">]>): string;

/**
 * Wrap an array of strings in delimiters.
 *
 * @group utils
 */
declare function wrapInDelimiters(lines: string[], indent?: string, delimiters?: string, withComma?: boolean): string;
/**
 * Generate a safe javascript variable name for an object key.
 *
 * @group utils
 */
declare function genObjectKey(key: string): string;

export { type CodegenOptions, type DynamicImportOptions, type ESMCodeGenOptions, type ESMExport, type ESMImport, type GenInterfaceOptions, type GenObjectOptions, type TypeObject, escapeString, genArrayFromRaw, genAugmentation, genDynamicImport, genExport, genImport, genInlineTypeImport, genInterface, genObjectFromRaw, genObjectFromRawEntries, genObjectFromValues, genObjectKey, genSafeVariableName, genString, genTypeExport, genTypeImport, genTypeObject, wrapInDelimiters };
