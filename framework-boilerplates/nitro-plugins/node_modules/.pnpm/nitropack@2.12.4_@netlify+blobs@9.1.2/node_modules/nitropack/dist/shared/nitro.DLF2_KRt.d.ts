import { LogLevel, ConsolaInstance } from 'consola';
import { App, RouterMethod, EventHandler, H3Error, H3Event, ProxyOptions } from 'h3';
import { NestedHooks, Hookable } from 'hookable';
import { PresetName, PresetOptions, PresetNameInput } from 'nitropack/presets';
import { Unimport } from 'unimport';
import { BuiltinDriverName, Storage } from 'unstorage';
import { RollupCommonJSOptions } from '@rollup/plugin-commonjs';
import { C12InputConfig, ResolvedConfig, ConfigWatcher, WatchConfigOptions, DotenvOptions } from 'c12';
import { FSWatcher, ChokidarOptions } from 'chokidar';
import { DateString, CompatibilityDateSpec, CompatibilityDates } from 'compatx';
import { ConnectorName } from 'db0';
import { ProxyServerOptions } from 'httpxy';
import { NitroRuntimeConfig as NitroRuntimeConfig$1, NitroRuntimeConfigApp as NitroRuntimeConfigApp$1 } from 'nitropack';
import { TSConfig } from 'pkg-types';
import { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import { Preset } from 'unenv';
import { UnimportPluginOptions } from 'unimport/unplugin';
import { UnwasmPluginOptions } from 'unwasm/plugin';
import { IncomingMessage, OutgoingMessage } from 'node:http';
import { Duplex } from 'node:stream';
import { Worker } from 'node:worker_threads';
import { ListenOptions, Listener } from 'listhen';
import { FilterPattern } from 'unplugin-utils';
import { NodeFileTraceOptions } from '@vercel/nft';
import { TransformOptions, Loader } from 'esbuild';
import { InputOptions, OutputOptions } from 'rollup';
import { ApiReferenceConfiguration } from '@scalar/api-reference';
import { ProviderName } from 'std-env';

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;
type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
type ExcludeFunctions<G extends Record<string, any>> = Pick<G, {
    [P in keyof G]: NonNullable<G[P]> extends Function ? never : P;
}[keyof G]>;
type DeepPartial<T> = T extends Record<string, any> ? {
    [P in keyof T]?: DeepPartial<T[P]> | T[P];
} : T;

interface DevServerOptions {
    watch: string[];
}
interface NitroWorker {
    worker: Worker | null;
    address: {
        host: string;
        port: number;
        socketPath?: string;
    };
}
interface NitroDevServer {
    reload: () => void;
    listen: (port: ListenOptions["port"], opts?: Partial<ListenOptions>) => Promise<Listener>;
    app: App;
    close: () => Promise<void>;
    watcher?: FSWatcher;
    upgrade: (req: IncomingMessage, socket: OutgoingMessage<IncomingMessage> | Duplex, head: Buffer) => void;
}

/**
Source: (inlined because of install size concernes)

https://github.com/openapi-ts/openapi-typescript/blob/fc3f7/packages/openapi-typescript/src/types.ts

MIT License

Copyright (c) 2020 Drew Powers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
interface Extensable {
    [key: `x-${string}`]: any;
}
/**
 * [4.8] Schema
 * @see https://spec.openapis.org/oas/v3.1.0#schema
 */
interface OpenAPI3 extends Extensable {
    /** REQUIRED. This string MUST be the version number of the OpenAPI Specification that the OpenAPI document uses. The openapi field SHOULD be used by tooling to interpret the OpenAPI document. This is not related to the API info.version string. */
    openapi: string;
    /** REQUIRED. Provides metadata about the API. The metadata MAY be used by tooling as required. */
    info: InfoObject;
    /** The default value for the $schema keyword within Schema Objects contained within this OAS document. This MUST be in the form of a URI. */
    jsonSchemaDialect?: string;
    /** An array of Server Objects, which provide connectivity information to a target server. If the servers property is not provided, or is an empty array, the default value would be a Server Object with a url value of /. */
    servers?: ServerObject[];
    /** The available paths and operations for the API. */
    paths?: PathsObject;
    /** The incoming webhooks that MAY be received as part of this API and that the API consumer MAY choose to implement. Closely related to the callbacks feature, this section describes requests initiated other than by an API call, for example by an out of band registration. The key name is a unique string to refer to each webhook, while the (optionally referenced) Path Item Object describes a request that may be initiated by the API provider and the expected responses. An example is available. */
    webhooks?: {
        [id: string]: PathItemObject | ReferenceObject;
    };
    /** An element to hold various schemas for the document. */
    components?: ComponentsObject;
    /** A declaration of which security mechanisms can be used across the API. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. Individual operations can override this definition. To make security optional, an empty security requirement ({}) can be included in the array. */
    security?: SecurityRequirementObject[];
    /** A list of tags used by the document with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared MAY be organized randomly or based on the tools’ logic. Each tag name in the list MUST be unique. */
    tags?: TagObject[];
    /** Additional external documentation. */
    externalDocs?: ExternalDocumentationObject;
    $defs?: $defs;
}
/**
 * [4.8.2] Info Object
 * The object provides metadata about the API.
 */
interface InfoObject extends Extensable {
    /** REQUIRED. The title of the API. */
    title: string;
    /** A short summary of the API. */
    summary?: string;
    /** A description of the API. CommonMark syntax MAY be used for rich text representation. */
    description?: string;
    /** A URL to the Terms of Service for the API. This MUST be in the form of a URL. */
    termsOfService?: string;
    /** The contact information for the exposed API. */
    contact?: ContactObject;
    /** The license information for the exposed API. */
    license?: LicenseObject;
    /** REQUIRED. The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version). */
    version: string;
}
/**
 * [4.8.3] Contact Object
 * Contact information for the exposed API.
 */
interface ContactObject extends Extensable {
    /** The identifying name of the contact person/organization. */
    name?: string;
    /** The URL pointing to the contact information. This MUST be in the form of a URL. */
    url?: string;
    /** The email address of the contact person/organization. This MUST be in the form of an email address. */
    email?: string;
}
/**
 * [4.8.4] License object
 * License information for the exposed API.
 */
interface LicenseObject extends Extensable {
    /** REQUIRED. The license name used for the API. */
    name: string;
    /** An SPDX license expression for the API. The identifier field is mutually exclusive of the url field. */
    identifier: string;
    /** A URL to the license used for the API. This MUST be in the form of a URL. The url field is mutually exclusive of the identifier field. */
    url: string;
}
/**
 * [4.8.5] Server Object
 * An object representing a Server.
 */
interface ServerObject extends Extensable {
    /** REQUIRED. A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenAPI document is being served. Variable substitutions will be made when a variable is named in {brackets}. */
    url: string;
    /** An optional string describing the host designated by the URL. CommonMark syntax MAY be used for rich text representation. */
    description: string;
    /** A map between a variable name and its value. The value is used for substitution in the server’s URL template. */
    variables: {
        [name: string]: ServerVariableObject;
    };
}
/**
 * [4.8.6] Server Variable Object
 * An object representing a Server Variable for server URL template substitution.
 */
interface ServerVariableObject extends Extensable {
    /** An enumeration of string values to be used if the substitution options are from a limited set. The array MUST NOT be empty. */
    enum?: string[];
    /** REQUIRED. The default value to use for substitution, which SHALL be sent if an alternate value is not supplied. Note this behavior is different than the Schema Object’s treatment of default values, because in those cases parameter values are optional. If the enum is defined, the value MUST exist in the enum’s values. */
    default: string;
    /** An optional description for the server variable. CommonMark syntax MAY be used for rich text representation. */
    description?: string;
}
/**
 * [4.8.7] Components Object
 * Holds a set of reusable objects for different aspects of the OAS.
 */
interface ComponentsObject extends Extensable {
    /** An object to hold reusable Schema Objects.*/
    schemas?: Record<string, SchemaObject>;
    /** An object to hold reusable Response Objects. */
    responses?: Record<string, ResponseObject | ReferenceObject>;
    /** An object to hold reusable Parameter Objects. */
    parameters?: Record<string, ParameterObject | ReferenceObject>;
    /** An object to hold reusable Example Objects. */
    examples?: Record<string, ExampleObject | ReferenceObject>;
    /** An object to hold reusable Request Body Objects. */
    requestBodies?: Record<string, RequestBodyObject | ReferenceObject>;
    /** An object to hold reusable Header Objects. */
    headers?: Record<string, HeaderObject | ReferenceObject>;
    /** An object to hold reusable Security Scheme Objects. */
    securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>;
    /** An object to hold reusable Link Objects. */
    links?: Record<string, LinkObject | ReferenceObject>;
    /** An object to hold reusable Callback Objects. */
    callbacks?: Record<string, CallbackObject | ReferenceObject>;
    /** An object to hold reusable Path Item Objects. */
    pathItems?: Record<string, PathItemObject | ReferenceObject>;
}
/**
 * [4.8.8] Paths Object
 * Holds the relative paths to the individual endpoints and their operations. The path is appended to the URL from the Server Object in order to construct the full URL. The Paths MAY be empty, due to Access Control List (ACL) constraints.
 */
interface PathsObject {
    [pathname: string]: PathItemObject | ReferenceObject;
}
/**
 * [4.8.9] Path Item Object
 * Describes the operations available on a single path. A Path Item MAY be empty, due to ACL constraints. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 */
interface PathItemObject extends Extensable {
    /** A definition of a GET operation on this path. */
    get?: OperationObject | ReferenceObject;
    /** A definition of a PUT operation on this path. */
    put?: OperationObject | ReferenceObject;
    /** A definition of a POST operation on this path. */
    post?: OperationObject | ReferenceObject;
    /** A definition of a DELETE operation on this path. */
    delete?: OperationObject | ReferenceObject;
    /** A definition of a OPTIONS operation on this path. */
    options?: OperationObject | ReferenceObject;
    /** A definition of a HEAD operation on this path. */
    head?: OperationObject | ReferenceObject;
    /** A definition of a PATCH operation on this path. */
    patch?: OperationObject | ReferenceObject;
    /** A definition of a TRACE operation on this path. */
    trace?: OperationObject | ReferenceObject;
    /** An alternative server array to service all operations in this path. */
    servers?: ServerObject[];
    /** A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object’s components/parameters. */
    parameters?: (ParameterObject | ReferenceObject)[];
}
/**
 * [4.8.10] Operation Object
 * Describes a single API operation on a path.
 */
interface OperationObject extends Extensable {
    /** A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier. */
    tags?: string[];
    /** A short summary of what the operation does. */
    summary?: string;
    /** A verbose explanation of the operation behavior. CommonMark syntax MAY be used for rich text representation. */
    description?: string;
    /** Additional external documentation for this operation. */
    externalDocs?: ExternalDocumentationObject;
    /** Unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is case-sensitive. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions. */
    operationId?: string;
    /** A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item, the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object’s components/parameters. */
    parameters?: (ParameterObject | ReferenceObject)[];
    /** The request body applicable for this operation. The requestBody is fully supported in HTTP methods where the HTTP 1.1 specification [RFC7231] has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague (such as GET, HEAD and DELETE), requestBody is permitted but does not have well-defined semantics and SHOULD be avoided if possible. */
    requestBody?: RequestBodyObject | ReferenceObject;
    /** The list of possible responses as they are returned from executing this operation. */
    responses?: ResponsesObject;
    /** A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the Callback Object. Each value in the map is a Callback Object that describes a request that may be initiated by the API provider and the expected responses. */
    callbacks?: Record<string, CallbackObject | ReferenceObject>;
    /** Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is false. */
    deprecated?: boolean;
    /** A declaration of which security mechanisms can be used for this operation. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. To make security optional, an empty security requirement ({}) can be included in the array. This definition overrides any declared top-level security. To remove a top-level security declaration, an empty array can be used. */
    security?: SecurityRequirementObject[];
    /** An alternative server array to service this operation. If an alternative server object is specified at the Path Item Object or Root level, it will be overridden by this value. */
    servers?: ServerObject[];
}
/**
 * [4.8.11] External Documentation Object
 * Allows referencing an external resource for extended documentation.
 */
interface ExternalDocumentationObject extends Extensable {
    /** A description of the target documentation. CommonMark syntax MAY be used for rich text representation. */
    description?: string;
    /** REQUIRED. The URL for the target documentation. This MUST be in the form of a URL. */
    url: string;
}
/**
 * [4.8.12] Parameter Object
 * Describes a single operation parameter.
 * A unique parameter is defined by a combination of a name and location.
 */
interface ParameterObject extends Extensable {
    /**
     * REQUIRED. The name of the parameter. Parameter names are case sensitive.
     *
     * - If `in` is `"path"`, the `name` field MUST correspond to a template expression occurring within the path field in the Paths Object. See Path Templating for further information.
     * - If `in` is `"header"` and the `name` field is `"Accept"`, `"Content-Type"` or `"Authorization"`, the parameter definition SHALL be ignored.
     * - For all other cases, the `name` corresponds to the parameter name used by the `in` property.
     */
    name: string;
    /** REQUIRED. The location of the parameter. Possible values are "query", "header", "path" or "cookie".*/
    in: "query" | "header" | "path" | "cookie";
    /** A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich text representation. */
    description?: string;
    /** Determines whether this parameter is mandatory. If the parameter location is "path", this property is REQUIRED and its value MUST be true. Otherwise, the property MAY be included and its default value is false. */
    required?: boolean;
    /** Specifies that a parameter is deprecated and SHOULD be transitioned out of usage. Default value is false. */
    deprecated?: boolean;
    /** Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a parameter with an empty value. Default value is false. If style is used, and if behavior is n/a (cannot be serialized), the value of allowEmptyValue SHALL be ignored. Use of this property is NOT RECOMMENDED, as it is likely to be removed in a later revision. */
    allowEmptyValue?: boolean;
    /** Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form. */
    style?: string;
    /** When this is true, parameter values of type `array` or `object` generate separate parameters for each value of the array or key-value pair of the map. For other types of parameters this property has no effect. When `style` is `form`, the default value is `true`. For all other styles, the default value is `false`. */
    explode?: boolean;
    /** Determines whether the parameter value SHOULD allow reserved characters, as defined by [RFC3986] `:/?#[]@!$&'()*+,;=` to be included without percent-encoding. This property only applies to parameters with an `in` value of `query`. The default value is `false`. */
    allowReserved?: boolean;
    /** The schema defining the type used for the parameter. */
    schema?: SchemaObject;
    /** Example of the parameter’s potential value. */
    example?: any;
    /** Examples of the parameter’s potential value. */
    examples?: {
        [name: string]: ExampleObject | ReferenceObject;
    };
    /** A map containing the representations for the parameter. */
    content?: {
        [contentType: string]: MediaTypeObject | ReferenceObject;
    };
}
/**
 * [4.8.13] Request Body Object
 * Describes a single request body.
 */
interface RequestBodyObject extends Extensable {
    /** A brief description of the request body. This could contain examples of use. CommonMark syntax MAY be used for rich text representation. */
    description?: string;
    /** REQUIRED. The content of the request body. The key is a media type or media type range and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text */
    content: {
        [contentType: string]: MediaTypeObject | ReferenceObject;
    };
    /** Determines if the request body is required in the request. Defaults to false. */
    required?: boolean;
}
/**
 * [4.8.14] Media Type Object
 */
interface MediaTypeObject extends Extensable {
    /** The schema defining the content of the request, response, or parameter. */
    schema?: SchemaObject | ReferenceObject;
    /** Example of the media type. The example object SHOULD be in the correct format as specified by the media type. The example field is mutually exclusive of the examples field. Furthermore, if referencing a schema which contains an example, the example value SHALL override the example provided by the schema. */
    example?: any;
    /** Examples of the media type. Each example object SHOULD match the media type and specified schema if present. The examples field is mutually exclusive of the example field. Furthermore, if referencing a schema which contains an example, the examples value SHALL override the example provided by the schema. */
    examples?: {
        [name: string]: ExampleObject | ReferenceObject;
    };
    /** A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The encoding object SHALL only apply to requestBody objects when the media type is multipart or application/x-www-form-urlencoded. */
    encoding?: {
        [propertyName: string]: EncodingObject;
    };
}
/**
 * [4.8.15] Encoding Object
 * A single encoding definition applied to a single schema property.
 */
interface EncodingObject extends Extensable {
    /** The Content-Type for encoding a specific property. Default value depends on the property type: for object - application/json; for array – the default is defined based on the inner type; for all other cases the default is application/octet-stream. The value can be a specific media type (e.g. application/json), a wildcard media type (e.g. image/*), or a comma-separated list of the two types. */
    contentType?: string;
    /** A map allowing additional information to be provided as headers, for example Content-Disposition. Content-Type is described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body media type is not a multipart. */
    headers?: {
        [name: string]: HeaderObject | ReferenceObject;
    };
    /** Describes how a specific property value will be serialized depending on its type. See Parameter Object for details on the style property. The behavior follows the same values as query parameters, including default values. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded or multipart/form-data. If a value is explicitly defined, then the value of contentType (implicit or explicit) SHALL be ignored. */
    style?: string;
    /** When this is true, property values of type array or object generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When style is form, the default value is true. For all other styles, the default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded or multipart/form-data. If a value is explicitly defined, then the value of contentType (implicit or explicit) SHALL be ignored. */
    explode?: string;
    /** Determines whether the parameter value SHOULD allow reserved characters, as defined by [RFC3986] :/?#[]@!$&'()*+,;= to be included without percent-encoding. The default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded or multipart/form-data. If a value is explicitly defined, then the value of contentType (implicit or explicit) SHALL be ignored. */
    allowReserved?: string;
}
/**
 * [4.8.16] Responses Object
 * A container for the expected responses of an operation. The container maps a HTTP response code to the expected response.
 */
type ResponsesObject = {
    [responseCode: string]: ResponseObject | ReferenceObject;
} & {
    /** The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses. */
    default?: ResponseObject | ReferenceObject;
};
/**
 * [4.8.17] Response Object
 * Describes a single response from an API Operation, including design-time, static links to operations based on the response.
 */
interface ResponseObject extends Extensable {
    /** REQUIRED. A description of the response. CommonMark syntax MAY be used for rich text representation. */
    description: string;
    /** Maps a header name to its definition. [RFC7230] states header names are case insensitive. If a response header is defined with the name "Content-Type", it SHALL be ignored. */
    headers?: {
        [name: string]: HeaderObject | ReferenceObject;
    };
    /** A map containing descriptions of potential response payloads. The key is a media type or media type range and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text */
    content?: {
        [contentType: string]: MediaTypeObject;
    };
    /** A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for Component Objects. */
    links?: {
        [name: string]: LinkObject | ReferenceObject;
    };
}
/**
 * [4.8.18] Callback Object
 * A map of possible out-of band callbacks related to the parent operation. Each value in the map is a Path Item Object that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the path item object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.
 */
type CallbackObject = Record<string, PathItemObject>;
/**
 * [4.8.19[ Example Object
 */
interface ExampleObject extends Extensable {
    /** Short description for the example. */
    summary?: string;
    /** Long description for the example. CommonMark syntax MAY be used for rich text representation. */
    description?: string;
    /** Embedded literal example. The value field and externalValue field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary. */
    value?: any;
    /** A URI that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The value field and externalValue field are mutually exclusive. See the rules for resolving Relative References. */
    externalValue?: string;
}
/**
 * [4.8.20] Link Object
 * The Link object represents a possible design-time link for a response. The presence of a link does not guarantee the caller’s ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.
 */
interface LinkObject extends Extensable {
    /** A relative or absolute URI reference to an OAS operation. This field is mutually exclusive of the operationId field, and MUST point to an Operation Object. Relative operationRef values MAY be used to locate an existing Operation Object in the OpenAPI definition. See the rules for resolving Relative References. */
    operationRef?: string;
    /** The name of an existing, resolvable OAS operation, as defined with a unique operationId. This field is mutually exclusive of the operationRef field. */
    operationId?: string;
    /** A map representing parameters to pass to an operation as specified with operationId or identified via operationRef. The key is the parameter name to be used, whereas the value can be a constant or an expression to be evaluated and passed to the linked operation. The parameter name can be qualified using the parameter location [{in}.]{name} for operations that use the same parameter name in different locations (e.g. path.id). */
    parameters?: {
        [name: string]: `$${string}`;
    };
    /** A literal value or {expression} to use as a request body when calling the target operation. */
    requestBody?: `$${string}`;
    /** A description of the link. CommonMark syntax MAY be used for rich text representation. */
    description?: string;
    /** A server object to be used by the target operation. */
    server?: ServerObject;
}
/**
 * [4.8.21] Header Object
 * The Header Object follows the structure of the Parameter Object with the following changes:
 *
 * 1. `name` MUST NOT be specified, it is given in the corresponding `headers` map.
 * 2. `in` MUST NOT be specified, it is implicitly in `header`.
 * 3. All traits that are affected by the location MUST be applicable to a location of `heade`r (for example, `style`).
 */
type HeaderObject = Omit<ParameterObject, "name" | "in">;
/**
 * [4.8.22] Tag Object
 * Adds metadata to a single tag that is used by the Operation Object. It is not mandatory to have a Tag Object per tag defined in the Operation Object instances.
 */
interface TagObject extends Extensable {
    /** REQUIRED. The name of the tag. */
    name: string;
    /** A description for the tag. CommonMark syntax MAY be used for rich text representation. */
    description?: string;
    /** Additional external documentation for this tag. */
    externalDocs?: ExternalDocumentationObject;
}
/**
 * [4.8.23] Reference Object
 * A simple object to allow referencing other components in the OpenAPI document, internally and externally. The $ref string value contains a URI [RFC3986], which identifies the location of the value being referenced. See the rules for resolving Relative References.
 */
interface ReferenceObject extends Extensable {
    /** REQUIRED. The reference identifier. This MUST be in the form of a URI. */
    $ref: string;
    /** A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a summary field, then this field has no effect. */
    summary?: string;
    /** A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a description field, then this field has no effect. */
    description?: string;
}
/**
 * [4.8.24] Schema Object
 * The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is a superset of the JSON Schema Specification Draft 2020-12.
 */
type SchemaObject = {
    /** The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is a superset of the JSON Schema Specification Draft 2020-12. */
    discriminator?: DiscriminatorObject;
    /** MAY be used only on properties schemas. It has no effect on root schemas. Adds additional metadata to describe the XML representation of this property. */
    xml?: XMLObject;
    /** Additional external documentation for this schema. */
    externalDocs?: ExternalDocumentationObject;
    /** @deprecated */
    example?: any;
    title?: string;
    description?: string;
    $comment?: string;
    deprecated?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    enum?: unknown[];
    /** Use of this keyword is functionally equivalent to an "enum" (Section 6.1.2) with a single value. */
    const?: unknown;
    default?: unknown;
    format?: string;
    /** @deprecated in 3.1 (still valid for 3.0) */
    nullable?: boolean;
    oneOf?: (SchemaObject | ReferenceObject)[];
    allOf?: (SchemaObject | ReferenceObject)[];
    anyOf?: (SchemaObject | ReferenceObject)[];
    required?: string[];
    [key: `x-${string}`]: any;
} & (StringSubtype | NumberSubtype | IntegerSubtype | ArraySubtype | BooleanSubtype | NullSubtype | ObjectSubtype | {
    type: ("string" | "number" | "integer" | "array" | "boolean" | "null" | "object")[];
});
interface StringSubtype {
    type: "string" | ["string", "null"];
    enum?: (string | ReferenceObject)[];
}
interface NumberSubtype {
    type: "number" | ["number", "null"];
    minimum?: number;
    maximum?: number;
    enum?: (number | ReferenceObject)[];
}
interface IntegerSubtype {
    type: "integer" | ["integer", "null"];
    minimum?: number;
    maximum?: number;
    enum?: (number | ReferenceObject)[];
}
interface ArraySubtype {
    type: "array" | ["array", "null"];
    prefixItems?: (SchemaObject | ReferenceObject)[];
    items?: SchemaObject | ReferenceObject | (SchemaObject | ReferenceObject)[];
    minItems?: number;
    maxItems?: number;
    enum?: (SchemaObject | ReferenceObject)[];
}
interface BooleanSubtype {
    type: "boolean" | ["boolean", "null"];
    enum?: (boolean | ReferenceObject)[];
}
interface NullSubtype {
    type: "null";
}
interface ObjectSubtype {
    type: "object" | ["object", "null"];
    properties?: {
        [name: string]: SchemaObject | ReferenceObject;
    };
    additionalProperties?: boolean | Record<string, never> | SchemaObject | ReferenceObject;
    required?: string[];
    allOf?: (SchemaObject | ReferenceObject)[];
    anyOf?: (SchemaObject | ReferenceObject)[];
    enum?: (SchemaObject | ReferenceObject)[];
    $defs?: $defs;
}
/**
 * [4.8.25] Discriminator Object
 * When request bodies or response payloads may be one of a number of different schemas, a discriminator object can be used to aid in serialization, deserialization, and validation. The discriminator is a specific object in a schema which is used to inform the consumer of the document of an alternative schema based on the value associated with it.
 */
interface DiscriminatorObject {
    /** REQUIRED. The name of the property in the payload that will hold the discriminator value. */
    propertyName: string;
    /** An object to hold mappings between payload values and schema names or references. */
    mapping?: Record<string, string>;
    /** If this exists, then a discriminator type should be added to objects matching this path */
    oneOf?: string[];
}
/**
 * [4.8.26] XML Object
 * A metadata object that allows for more fine-tuned XML model definitions. When using arrays, XML element names are not inferred (for singular/plural forms) and the `name` property SHOULD be used to add that information. See examples for expected behavior.
 */
interface XMLObject extends Extensable {
    /** Replaces the name of the element/attribute used for the described schema property. When defined within `items`, it will affect the name of the individual XML elements within the list. When defined alongside `type` being `array` (outside the `items`), it will affect the wrapping element and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored. */
    name?: string;
    /** The URI of the namespace definition. This MUST be in the form of an absolute URI. */
    namespace?: string;
    /** The prefix to be used for the name. */
    prefix?: string;
    /** Declares whether the property definition translates to an attribute instead of an element. Default value is `false`. */
    attribute?: boolean;
    /** MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `array` (outside the `items`). */
    wrapped?: boolean;
}
/**
 * [4.8.27] Security Scheme Object
 * Defines a security scheme that can be used by the operations.
 */
type SecuritySchemeObject = {
    /** A description for security scheme. CommonMark syntax MAY be used for rich text representation. */
    description?: string;
    [key: `x-${string}`]: any;
} & ({
    /** REQUIRED. The type of the security scheme. */
    type: "apiKey";
    /** REQUIRED. The name of the header, query or cookie parameter to be used. */
    name: string;
    /** REQUIRED. The location of the API key. */
    in: "query" | "header" | "cookie";
} | {
    /** REQUIRED. The type of the security scheme. */
    type: "http";
    /** REQUIRED. The name of the HTTP Authorization scheme to be used in the Authorization header as defined in [RFC7235]. The values used SHOULD be registered in the IANA Authentication Scheme registry. */
    scheme: string;
    /** A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes. */
    bearer?: string;
} | {
    /** REQUIRED. The type of the security scheme. */
    type: "mutualTLS";
} | {
    /** REQUIRED. Tye type of the security scheme. */
    type: "oauth2";
    /** REQUIRED. An object containing configuration information for the flow types supported. */
    flows: OAuthFlowsObject;
} | {
    /** REQUIRED. Tye type of the security scheme. */
    type: "openIdConnect";
    /** REQUIRED. OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL. The OpenID Connect standard requires the use of TLS. */
    openIdConnectUrl: string;
});
/**
 * [4.8.26] OAuth Flows Object
 * Allows configuration of the supported OAuth Flows.
 */
interface OAuthFlowsObject extends Extensable {
    /** Configuration for the OAuth Implicit flow */
    implicit?: OAuthFlowObject;
    /** Configuration for the OAuth Resource Owner Password flow */
    password?: OAuthFlowObject;
    /** Configuration for the OAuth Client Credentials flow. Previously called `application` in OpenAPI 2.0. */
    clientCredentials?: OAuthFlowObject;
    /** Configuration for the OAuth Authorization Code flow. Previously called `accessCode` in OpenAPI 2.0. */
    authorizationCode?: OAuthFlowObject;
}
/**
 * [4.8.29] OAuth Flow Object
 * Configuration details for a supported OAuth Flow
 */
interface OAuthFlowObject extends Extensable {
    /** REQUIRED. The authorization URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS. */
    authorizationUrl: string;
    /** REQUIRED. The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS. */
    tokenUrl: string;
    /** The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS. */
    refreshUrl: string;
    /** REQUIRED. The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it. The map MAY be empty. */
    scopes: {
        [name: string]: string;
    };
}
/**
 * [4.8.30] Security Requirements Object
 * Lists the required security schemes to execute this operation. The name used for each property MUST correspond to a security scheme declared in the Security Schemes under the Components Object.
 */
type SecurityRequirementObject = {
    [P in keyof ComponentsObject["securitySchemes"]]?: string[];
};
type $defs = Record<string, SchemaObject>;

type MaybeArray<T> = T | T[];
/** @exprerimental */
interface NitroRouteMeta {
    openAPI?: OperationObject & {
        $global?: Pick<OpenAPI3, "components"> & Extensable;
    };
}
interface NitroEventHandler {
    /**
     * Path prefix or route
     *
     * If an empty string used, will be used as a middleware
     */
    route?: string;
    /**
     * Specifies this is a middleware handler.
     * Middleware are called on every route and should normally return nothing to pass to the next handlers
     */
    middleware?: boolean;
    /**
     * Use lazy loading to import handler
     */
    lazy?: boolean;
    /**
     * Path to event handler
     *
     */
    handler: string;
    /**
     * Router method matcher
     */
    method?: RouterMethod;
    /**
     * Meta
     */
    meta?: NitroRouteMeta;
    env?: MaybeArray<"dev" | "prod" | "prerender" | PresetName | (string & {})>;
}
interface NitroDevEventHandler {
    /**
     * Path prefix or route
     */
    route?: string;
    /**
     * Event handler
     *
     */
    handler: EventHandler;
}
type MaybePromise<T> = T | Promise<T>;
type NitroErrorHandler = (error: H3Error, event: H3Event, _: {
    defaultHandler: (error: H3Error, event: H3Event, opts?: {
        silent?: boolean;
        json?: boolean;
    }) => MaybePromise<{
        status: number;
        statusText: string;
        headers: Record<string, string>;
        body: string | Record<string, any>;
    }>;
}) => void | Promise<void>;

interface PrerenderRoute {
    route: string;
    contents?: string;
    data?: ArrayBuffer;
    fileName?: string;
    error?: Error & {
        statusCode: number;
        statusMessage: string;
    };
    generateTimeMS?: number;
    skip?: boolean;
    contentType?: string;
}
/** @deprecated Internal type will be removed in future versions */
type PrerenderGenerateRoute = PrerenderRoute;

type RollupConfig = InputOptions & {
    output: OutputOptions;
};
type VirtualModule = string | (() => string | Promise<string>);
interface RollupVirtualOptions {
    [id: string]: VirtualModule;
}
interface EsbuildOptions extends TransformOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
    sourceMap?: boolean | "inline" | "hidden";
    /**
     * Map extension to esbuild loader
     * Note that each entry (the extension) needs to start with a dot
     */
    loaders?: {
        [ext: string]: Loader | false;
    };
}
interface NodeExternalsOptions {
    inline?: Array<string | RegExp | ((id: string, importer?: string) => Promise<boolean> | boolean)>;
    external?: Array<string | RegExp | ((id: string, importer?: string) => Promise<boolean> | boolean)>;
    rootDir?: string;
    outDir: string;
    trace?: boolean;
    traceOptions?: NodeFileTraceOptions;
    moduleDirectories?: string[];
    exportConditions?: string[];
    traceInclude?: string[];
    traceAlias?: Record<string, string>;
    chmod?: boolean | number;
}
interface ServerAssetOptions {
    inline: boolean;
    dirs: {
        [assetdir: string]: {
            dir: string;
            meta?: boolean;
        };
    };
}
interface RawOptions {
    extensions?: string[];
}

type HookResult = void | Promise<void>;
interface NitroHooks {
    "types:extend": (types: NitroTypes) => HookResult;
    "build:before": (nitro: Nitro) => HookResult;
    "rollup:before": (nitro: Nitro, config: RollupConfig) => HookResult;
    compiled: (nitro: Nitro) => HookResult;
    "dev:reload": () => HookResult;
    "dev:start": () => HookResult;
    "dev:error": (cause?: unknown) => HookResult;
    "rollup:reload": () => HookResult;
    restart: () => HookResult;
    close: () => HookResult;
    "prerender:routes": (routes: Set<string>) => HookResult;
    "prerender:config": (config: NitroConfig) => HookResult;
    "prerender:init": (prerenderer: Nitro) => HookResult;
    "prerender:generate": (route: PrerenderRoute, nitro: Nitro) => HookResult;
    "prerender:route": (route: PrerenderRoute) => HookResult;
    "prerender:done": (result: {
        prerenderedRoutes: PrerenderRoute[];
        failedRoutes: PrerenderRoute[];
    }) => HookResult;
}

/**
 * Nitro OpenAPI configuration
 */
interface NitroOpenAPIConfig {
    /**
     * OpenAPI meta information
     */
    meta?: {
        title?: string;
        description?: string;
        version?: string;
    };
    /**
     * OpenAPI json route
     *
     * Default is `/_openapi.json`
     */
    route?: string;
    /**
     * Enable OpenAPI generation for production builds
     */
    production?: false | "runtime" | "prerender";
    /**
     * UI configurations
     */
    ui?: {
        /**
         * Scalar UI configuration
         */
        scalar?: false | (Partial<ApiReferenceConfiguration> & {
            /**
             * Scalar UI route
             *
             * Default is `/_scalar`
             */
            route?: string;
        });
        /**
         * Swagger UI configuration
         */
        swagger?: false | {
            /**
             * Swagger UI route
             *
             * Default is `/_swagger`
             */
            route?: string;
        };
    };
}

type NitroPreset = NitroConfig | (() => NitroConfig);
interface NitroPresetMeta {
    url: string;
    name: string;
    stdName?: ProviderName;
    aliases?: string[];
    static?: boolean;
    dev?: boolean;
    compatibilityDate?: DateString;
}

interface CacheEntry<T = any> {
    value?: T;
    expires?: number;
    mtime?: number;
    integrity?: string;
}
interface CacheOptions<T = any, ArgsT extends unknown[] = any[]> {
    name?: string;
    getKey?: (...args: ArgsT) => string | Promise<string>;
    transform?: (entry: CacheEntry<T>, ...args: ArgsT) => any;
    validate?: (entry: CacheEntry<T>, ...args: ArgsT) => boolean;
    shouldInvalidateCache?: (...args: ArgsT) => boolean | Promise<boolean>;
    shouldBypassCache?: (...args: ArgsT) => boolean | Promise<boolean>;
    group?: string;
    integrity?: any;
    /**
     * Number of seconds to cache the response. Defaults to 1.
     */
    maxAge?: number;
    swr?: boolean;
    staleMaxAge?: number;
    base?: string;
}
interface ResponseCacheEntry<T = any> {
    body: T | undefined;
    code: number;
    headers: Record<string, string | number | string[] | undefined>;
}
interface CachedEventHandlerOptions<T = any> extends Omit<CacheOptions<ResponseCacheEntry<T>, [H3Event]>, "transform" | "validate"> {
    headersOnly?: boolean;
    varies?: string[] | readonly string[];
}

type HTTPStatusCode = IntRange<100, 600>;
interface NitroRouteConfig {
    cache?: ExcludeFunctions<CachedEventHandlerOptions> | false;
    headers?: Record<string, string>;
    redirect?: string | {
        to: string;
        statusCode?: HTTPStatusCode;
    };
    prerender?: boolean;
    proxy?: string | ({
        to: string;
    } & ProxyOptions);
    isr?: number | boolean | VercelISRConfig;
    cors?: boolean;
    swr?: boolean | number;
    static?: boolean | number;
}
interface NitroRouteRules extends Omit<NitroRouteConfig, "redirect" | "cors" | "swr" | "static"> {
    redirect?: {
        to: string;
        statusCode: HTTPStatusCode;
    };
    proxy?: {
        to: string;
    } & ProxyOptions;
}
interface VercelISRConfig {
    /**
     * (vercel)
     * Expiration time (in seconds) before the cached asset will be re-generated by invoking the Serverless Function.
     * Setting the value to `false` (or `isr: true` route rule) means it will never expire.
     */
    expiration?: number | false;
    /**
     * (vercel)
     * Group number of the asset.
     * Prerender assets with the same group number will all be re-validated at the same time.
     */
    group?: number;
    /**
     * (vercel)
     * List of query string parameter names that will be cached independently.
     * - If an empty array, query values are not considered for caching.
     * - If undefined each unique query value is cached independently
     * - For wildcard `/**` route rules, `url` is always added.
     */
    allowQuery?: string[];
    /**
     * (vercel)
     * When `true`, the query string will be present on the `request` argument passed to the invoked function. The `allowQuery` filter still applies.
     */
    passQuery?: boolean;
}

/**
 * Nitro normalized options (nitro.options)
 */
interface NitroOptions extends PresetOptions {
    _config: NitroConfig;
    _c12: ResolvedConfig<NitroConfig> | ConfigWatcher<NitroConfig>;
    _cli?: {
        command?: string;
    };
    compatibilityDate: CompatibilityDates;
    debug: boolean;
    preset: PresetName;
    static: boolean;
    logLevel: LogLevel;
    runtimeConfig: NitroRuntimeConfig;
    appConfig: AppConfig;
    appConfigFiles: string[];
    workspaceDir: string;
    rootDir: string;
    srcDir: string;
    scanDirs: string[];
    apiDir: string;
    routesDir: string;
    buildDir: string;
    output: {
        dir: string;
        serverDir: string;
        publicDir: string;
    };
    storage: StorageMounts;
    devStorage: StorageMounts;
    database: DatabaseConnectionConfigs;
    devDatabase: DatabaseConnectionConfigs;
    bundledStorage: string[];
    timing: boolean;
    renderer?: string;
    ssrRoutes: string[];
    serveStatic: boolean | "node" | "deno" | "inline";
    noPublicDir: boolean;
    /**
     * @experimental Requires `experimental.wasm` to work
     *
     * @see https://github.com/unjs/unwasm
     */
    wasm?: UnwasmPluginOptions;
    openAPI?: NitroOpenAPIConfig;
    experimental: {
        legacyExternals?: boolean;
        openAPI?: boolean;
        /**
         * See https://github.com/microsoft/TypeScript/pull/51669
         */
        typescriptBundlerResolution?: boolean;
        /**
         * Enable native async context support for useEvent()
         */
        asyncContext?: boolean;
        /**
         * Enable Experimental WebAssembly Support
         *
         * @see https://github.com/unjs/unwasm
         */
        wasm?: boolean;
        /**
         * Disable Experimental bundling of Nitro Runtime Dependencies
         */
        bundleRuntimeDependencies?: false;
        /**
         * Disable Experimental Sourcemap Minification
         */
        sourcemapMinify?: false;
        /**
         * Backward compatibility support for Node fetch (required for Node < 18)
         */
        nodeFetchCompat?: boolean;
        /**
         * Allow env expansion in runtime config
         *
         * @see https://github.com/nitrojs/nitro/pull/2043
         */
        envExpansion?: boolean;
        /**
         * Enable experimental WebSocket support
         *
         * @see https://nitro.build/guide/websocket
         */
        websocket?: boolean;
        /**
         * Enable experimental Database support
         *
         * @see https://nitro.build/guide/database
         */
        database?: boolean;
        /**
         * Enable experimental Tasks support
         *
         * @see https://nitro.build/guide/tasks
         */
        tasks?: boolean;
    };
    future: {
        nativeSWR: boolean;
    };
    serverAssets: ServerAssetDir[];
    publicAssets: PublicAssetDir[];
    imports: UnimportPluginOptions | false;
    modules?: NitroModuleInput[];
    plugins: string[];
    tasks: {
        [name: string]: {
            handler: string;
            description: string;
        };
    };
    scheduledTasks: {
        [cron: string]: string | string[];
    };
    virtual: Record<string, string | (() => string | Promise<string>)>;
    compressPublicAssets: boolean | CompressOptions;
    ignore: string[];
    dev: boolean;
    devServer: DevServerOptions;
    watchOptions: ChokidarOptions;
    devProxy: Record<string, string | ProxyServerOptions>;
    logging: {
        compressedSizes: boolean;
        buildSuccess: boolean;
    };
    baseURL: string;
    apiBaseURL: string;
    handlers: NitroEventHandler[];
    routeRules: {
        [path: string]: NitroRouteRules;
    };
    devHandlers: NitroDevEventHandler[];
    errorHandler: string | string[];
    devErrorHandler: NitroErrorHandler;
    prerender: {
        /**
         * Prerender HTML routes within subfolders (`/test` would produce `/test/index.html`)
         */
        autoSubfolderIndex: boolean;
        concurrency: number;
        interval: number;
        crawlLinks: boolean;
        failOnError: boolean;
        ignore: Array<string | RegExp | ((path: string) => undefined | null | boolean)>;
        ignoreUnprefixedPublicAssets: boolean;
        routes: string[];
        /**
         * Amount of retries. Pass Infinity to retry indefinitely.
         * @default 3
         */
        retry: number;
        /**
         * Delay between each retry in ms.
         * @default 500
         */
        retryDelay: number;
    };
    rollupConfig?: RollupConfig;
    entry: string;
    unenv: Preset[];
    alias: Record<string, string>;
    minify: boolean;
    inlineDynamicImports: boolean;
    sourceMap: boolean | "inline" | "hidden";
    node: boolean;
    moduleSideEffects: string[];
    esbuild?: {
        options?: Partial<EsbuildOptions>;
    };
    noExternals: boolean;
    externals: NodeExternalsOptions;
    analyze: false | PluginVisualizerOptions;
    replace: Record<string, string | ((id: string) => string)>;
    commonJS?: RollupCommonJSOptions;
    exportConditions?: string[];
    typescript: {
        strict?: boolean;
        internalPaths?: boolean;
        generateRuntimeConfigTypes?: boolean;
        generateTsConfig?: boolean;
        /** the path of the generated `tsconfig.json`, relative to buildDir */
        tsconfigPath: string;
        tsConfig?: Partial<TSConfig>;
    };
    hooks: NestedHooks<NitroHooks>;
    nodeModulesDirs: string[];
    commands: {
        preview: string;
        deploy: string;
    };
    framework: NitroFrameworkInfo;
    iis?: {
        mergeConfig?: boolean;
        overrideConfig?: boolean;
    };
}
/**
 * Nitro input config (nitro.config)
 */
interface NitroConfig extends DeepPartial<Omit<NitroOptions, "routeRules" | "rollupConfig" | "preset" | "compatibilityDate" | "unenv">>, C12InputConfig<NitroConfig> {
    preset?: PresetNameInput;
    extends?: string | string[] | NitroPreset;
    routeRules?: {
        [path: string]: NitroRouteConfig;
    };
    rollupConfig?: Partial<RollupConfig>;
    compatibilityDate?: CompatibilityDateSpec;
    unenv?: Preset | Preset[];
}
interface LoadConfigOptions {
    watch?: boolean;
    c12?: WatchConfigOptions;
    compatibilityDate?: CompatibilityDateSpec;
    dotenv?: boolean | DotenvOptions;
}
interface AppConfig {
    [key: string]: any;
}
interface PublicAssetDir {
    baseURL?: string;
    fallthrough?: boolean;
    maxAge: number;
    dir: string;
}
interface CompressOptions {
    gzip?: boolean;
    brotli?: boolean;
}
interface ServerAssetDir {
    baseName: string;
    pattern?: string;
    dir: string;
    ignore?: string[];
}
type CustomDriverName = string & {
    _custom?: any;
};
interface StorageMounts {
    [path: string]: {
        driver: BuiltinDriverName | CustomDriverName;
        [option: string]: any;
    };
}
type DatabaseConnectionName = "default" | (string & {});
type DatabaseConnectionConfig = {
    connector: ConnectorName;
    options?: {
        [key: string]: any;
    };
};
type DatabaseConnectionConfigs = Record<DatabaseConnectionName, DatabaseConnectionConfig>;
interface NitroRuntimeConfigApp extends NitroRuntimeConfigApp$1 {
}
interface NitroRuntimeConfig extends NitroRuntimeConfig$1 {
}

interface Nitro {
    options: NitroOptions;
    scannedHandlers: NitroEventHandler[];
    vfs: Record<string, string>;
    hooks: Hookable<NitroHooks>;
    unimport?: Unimport;
    logger: ConsolaInstance;
    storage: Storage;
    close: () => Promise<void>;
    updateConfig: (config: NitroDynamicConfig) => void | Promise<void>;
    _prerenderedRoutes?: PrerenderRoute[];
    _prerenderMeta?: Record<string, {
        contentType?: string;
    }>;
}
type NitroDynamicConfig = Pick<NitroConfig, "runtimeConfig" | "routeRules">;
type NitroTypes = {
    routes: Record<string, Partial<Record<RouterMethod | "default", string[]>>>;
    tsConfig?: TSConfig;
};
interface NitroFrameworkInfo {
    name?: "nitro" | (string & {});
    version?: string;
}
/** Build info written to `.output/nitro.json` or `.nitro/dev/nitro.json` */
interface NitroBuildInfo {
    date: string;
    preset: PresetName;
    framework: NitroFrameworkInfo;
    versions: {
        nitro: string;
        [key: string]: string;
    };
    commands?: {
        preview?: string;
        deploy?: string;
    };
    dev?: {
        pid: number;
        workerAddress?: {
            host: string;
            port: number;
            socketPath?: string;
        };
    };
    config?: Partial<PresetOptions>;
}

type NitroModuleInput = string | NitroModule | NitroModule["setup"];
interface NitroModule {
    name?: string;
    setup: (this: void, nitro: Nitro) => void | Promise<void>;
}

export type { AppConfig as A, PrerenderGenerateRoute as B, CacheEntry as C, DatabaseConnectionName as D, NitroPreset as E, NitroPresetMeta as F, RollupConfig as G, RollupVirtualOptions as H, EsbuildOptions as I, NodeExternalsOptions as J, ServerAssetOptions as K, LoadConfigOptions as L, RawOptions as M, NitroModule as N, HTTPStatusCode as O, PublicAssetDir as P, NitroRouteConfig as Q, ResponseCacheEntry as R, ServerAssetDir as S, NitroRouteRules as T, VirtualModule as V, NitroOptions as a, NitroConfig as b, CacheOptions as c, CachedEventHandlerOptions as d, CompressOptions as e, StorageMounts as f, DatabaseConnectionConfig as g, DatabaseConnectionConfigs as h, NitroRuntimeConfigApp as i, NitroRuntimeConfig as j, NitroOpenAPIConfig as k, DevServerOptions as l, NitroWorker as m, NitroDevServer as n, NitroRouteMeta as o, NitroEventHandler as p, NitroDevEventHandler as q, NitroErrorHandler as r, NitroHooks as s, NitroModuleInput as t, Nitro as u, NitroDynamicConfig as v, NitroTypes as w, NitroFrameworkInfo as x, NitroBuildInfo as y, PrerenderRoute as z };
