/* eslint-disable */

import * as sdk from 'hypertune'

export const queryCode = `query FullQuery{root{delay proceedToCheckout freeDelivery summerSale}}`

export const query: sdk.Query<sdk.ObjectValueWithVariables> = {
  variableDefinitions: {},
  fragmentDefinitions: {},
  fieldQuery: {
    Query: {
      type: 'InlineFragment',
      objectTypeName: 'Query',
      selection: {
        root: {
          fieldArguments: { __isPartialObject__: true },
          fieldQuery: {
            Root: {
              type: 'InlineFragment',
              objectTypeName: 'Root',
              selection: {
                delay: { fieldArguments: {}, fieldQuery: null },
                proceedToCheckout: { fieldArguments: {}, fieldQuery: null },
                freeDelivery: { fieldArguments: {}, fieldQuery: null },
                summerSale: { fieldArguments: {}, fieldQuery: null },
              },
            },
          },
        },
      },
    },
  },
}

export const vercelFlagDefinitions = {
  delay: {
    options: [],
    origin:
      'https://app.hypertune.com/projects/4585/main/draft/logic?selected_field_path=root%3Edelay',
  },
  proceedToCheckout: {
    options: [
      { value: 'blue', label: 'Blue' },
      { value: 'red', label: 'Red' },
      { value: 'green', label: 'Green' },
    ],
    origin:
      'https://app.hypertune.com/projects/4585/main/draft/logic?selected_field_path=root%3EproceedToCheckout',
  },
  freeDelivery: {
    options: [
      { label: 'Off', value: false },
      { label: 'On', value: true },
    ],
    origin:
      'https://app.hypertune.com/projects/4585/main/draft/logic?selected_field_path=root%3EfreeDelivery',
  },
  summerSale: {
    options: [
      { label: 'Off', value: false },
      { label: 'On', value: true },
    ],
    origin:
      'https://app.hypertune.com/projects/4585/main/draft/logic?selected_field_path=root%3EsummerSale',
  },
}

export type RootFlagValues = {
  delay: number
  proceedToCheckout: ProceedToCheckout
  freeDelivery: boolean
  summerSale: boolean
}

export type FlagValues = {
  delay: number
  proceedToCheckout: ProceedToCheckout
  freeDelivery: boolean
  summerSale: boolean
}

export type FlagPaths = keyof FlagValues & string

export const flagFallbacks: FlagValues = {
  delay: 0,
  proceedToCheckout: 'blue',
  freeDelivery: false,
  summerSale: false,
}

export function decodeFlagValues<TFlagPaths extends keyof FlagValues & string>(
  encodedValues: string,
  flagPaths: TFlagPaths[]
): Pick<FlagValues, TFlagPaths> {
  return sdk.decodeFlagValues({ flagPaths, encodedValues })
}

export type VariableValues = {}

export const EnvironmentEnumValues = [
  'development',
  'production',
  'test',
] as const
export type Environment = (typeof EnvironmentEnumValues)[number]

/**
 * This `Context` input type is used for the `context` argument on your root field.
 * It contains details of the current `user` and `environment`.
 *
 * You can define other custom input types with fields that are primitives, enums
 * or other input types.
 */
export type Context = {
  stableId: string
  environment: Environment
}

export type RootArgs = {
  context: Context
}

export type EmptyObject = {}

export const ProceedToCheckoutEnumValues = ['blue', 'red', 'green'] as const
export type ProceedToCheckout = (typeof ProceedToCheckoutEnumValues)[number]

export class ProceedToCheckoutNode extends sdk.Node {
  override typeName = 'ProceedToCheckout' as const

  get({
    fallback,
    shouldReturnUnrecognizedValues = false,
  }: {
    fallback: ProceedToCheckout
    shouldReturnUnrecognizedValues?: boolean
  }): ProceedToCheckout {
    const value = this.getValue({ fallback })

    if (typeof value !== 'string' || !value) {
      this.logUnexpectedValueError(value)
      return fallback
    }
    if (
      !shouldReturnUnrecognizedValues &&
      !ProceedToCheckoutEnumValues.includes(value as ProceedToCheckout)
    ) {
      this.logUnexpectedValueError(value)
      return fallback
    }

    return value as ProceedToCheckout
  }
}

export type Root = {
  delay: number
  proceedToCheckout: ProceedToCheckout
  freeDelivery: boolean
  summerSale: boolean
}

const rootFallback = {
  delay: 0,
  proceedToCheckout: 'blue',
  freeDelivery: false,
  summerSale: false,
}

export class RootNode extends sdk.Node {
  override typeName = 'Root' as const

  getRootArgs(): RootArgs {
    const { step } = this.props
    return (
      step?.type === 'GetFieldStep' ? step.fieldArguments : {}
    ) as RootArgs
  }

  get({ fallback = rootFallback as Root }: { fallback?: Root } = {}): Root {
    const getQuery = null
    return this.getValue({ query: getQuery, fallback }) as Root
  }

  /**
   * [Open in Hypertune UI]({@link https://app.hypertune.com/projects/4585/main/draft/logic?selected_field_path=root%3Edelay})
   */
  delay({
    args = {},
    fallback,
  }: {
    args?: EmptyObject
    fallback: number
  }): number {
    const props0 = this.getFieldNodeProps('delay', { fieldArguments: args })
    const expression0 = props0.expression

    if (expression0 && expression0.type === 'IntExpression') {
      const node = new sdk.IntNode(props0)
      return node.get({ fallback })
    }

    const node = new sdk.IntNode(props0)
    node._logUnexpectedTypeError()
    return node.get({ fallback })
  }

  /**
   * [Open in Hypertune UI]({@link https://app.hypertune.com/projects/4585/main/draft/logic?selected_field_path=root%3EproceedToCheckout})
   */
  proceedToCheckout({
    args = {},
    fallback,
    shouldReturnUnrecognizedValues = false,
  }: {
    args?: EmptyObject
    fallback: ProceedToCheckout
    shouldReturnUnrecognizedValues?: boolean
  }): ProceedToCheckout {
    const props0 = this.getFieldNodeProps('proceedToCheckout', {
      fieldArguments: args,
    })
    const expression0 = props0.expression

    if (
      expression0 &&
      (expression0.type === 'StringExpression' ||
        expression0.type === 'EnumExpression') &&
      ProceedToCheckoutEnumValues.includes(
        expression0.value as ProceedToCheckout
      )
    ) {
      const node = new ProceedToCheckoutNode(props0)
      return node.get({ fallback, shouldReturnUnrecognizedValues })
    }

    const node = new ProceedToCheckoutNode(props0)
    node._logUnexpectedTypeError()
    return fallback
  }

  /**
   * [Open in Hypertune UI]({@link https://app.hypertune.com/projects/4585/main/draft/logic?selected_field_path=root%3EfreeDelivery})
   */
  freeDelivery({
    args = {},
    fallback,
  }: {
    args?: EmptyObject
    fallback: boolean
  }): boolean {
    const props0 = this.getFieldNodeProps('freeDelivery', {
      fieldArguments: args,
    })
    const expression0 = props0.expression

    if (expression0 && expression0.type === 'BooleanExpression') {
      const node = new sdk.BooleanNode(props0)
      return node.get({ fallback })
    }

    const node = new sdk.BooleanNode(props0)
    node._logUnexpectedTypeError()
    return node.get({ fallback })
  }

  /**
   * [Open in Hypertune UI]({@link https://app.hypertune.com/projects/4585/main/draft/logic?selected_field_path=root%3EsummerSale})
   */
  summerSale({
    args = {},
    fallback,
  }: {
    args?: EmptyObject
    fallback: boolean
  }): boolean {
    const props0 = this.getFieldNodeProps('summerSale', {
      fieldArguments: args,
    })
    const expression0 = props0.expression

    if (expression0 && expression0.type === 'BooleanExpression') {
      const node = new sdk.BooleanNode(props0)
      return node.get({ fallback })
    }

    const node = new sdk.BooleanNode(props0)
    node._logUnexpectedTypeError()
    return node.get({ fallback })
  }
}

/**
 * This is your project schema expressed in GraphQL.
 *
 * Define `Boolean` fields for feature flags, custom `enum` fields for flags with
 * more than two states, `Int` fields for numeric flags like timeouts and limits,
 * `String` fields to manage in-app copy, `Void` fields for analytics events, and
 * fields with custom object and list types for more complex app configuration,
 * e.g. to use Hypertune as a CMS.
 *
 * Once you've changed your schema, set your flag logic in the Logic view.
 */
export type Source = {
  /**
   * You can add arguments to any field in your schema, which you can then use when
   * setting its logic, including the logic of any nested fields. Your root field
   * already has a `context` argument. Since all flags are nested under the root
   * field, this context will be available to all of them.
   */
  root: Root
}

const sourceFallback = {
  root: {
    delay: 0,
    proceedToCheckout: 'blue',
    freeDelivery: false,
    summerSale: false,
  },
}

export type GetQueryRootArgs = {
  args: RootArgs
}

export type GetQueryArgs = {
  root: GetQueryRootArgs
}

/**
 * This is your project schema expressed in GraphQL.
 *
 * Define `Boolean` fields for feature flags, custom `enum` fields for flags with
 * more than two states, `Int` fields for numeric flags like timeouts and limits,
 * `String` fields to manage in-app copy, `Void` fields for analytics events, and
 * fields with custom object and list types for more complex app configuration,
 * e.g. to use Hypertune as a CMS.
 *
 * Once you've changed your schema, set your flag logic in the Logic view.
 */
export class SourceNode extends sdk.Node {
  override typeName = 'Query' as const

  get({
    args,
    fallback = sourceFallback as Source,
  }: {
    args: GetQueryArgs
    fallback?: Source
  }): Source {
    const getQuery = sdk.mergeFieldQueryAndArgs(
      query.fragmentDefinitions,
      sdk.getFieldQueryForPath(query.fragmentDefinitions, query.fieldQuery, []),
      args
    )
    return this.getValue({ query: getQuery, fallback }) as Source
  }

  /**
   * You can add arguments to any field in your schema, which you can then use when
   * setting its logic, including the logic of any nested fields. Your root field
   * already has a `context` argument. Since all flags are nested under the root
   * field, this context will be available to all of them.
   */
  root({ args }: { args: RootArgs }): RootNode {
    const props0 = this.getFieldNodeProps('root', { fieldArguments: args })
    const expression0 = props0.expression

    if (
      expression0 &&
      expression0.type === 'ObjectExpression' &&
      expression0.objectTypeName === 'Root'
    ) {
      return new RootNode(props0)
    }

    const node = new RootNode(props0)
    node._logUnexpectedTypeError()
    return node
  }
}

export type DehydratedState = sdk.DehydratedState<Source, VariableValues>
export type CreateSourceOptions = {
  token: string
  variableValues?: VariableValues
  override?: sdk.DeepPartial<Source> | null
} & sdk.CreateOptions

export function createSource({
  token,
  variableValues = {},
  override,
  ...options
}: CreateSourceOptions): SourceNode {
  return sdk.create({
    NodeConstructor: SourceNode,
    token,
    query,
    queryCode,
    variableValues,
    override,
    options,
  })
}

export const emptySource = new SourceNode({
  context: null,
  logger: null,
  parent: null,
  step: null,
  expression: null,
  initDataHash: null,
})

export function createSourceForServerOnly({
  token,
  variableValues = {},
  override,
  ...options
}: CreateSourceOptions): SourceNode {
  return typeof window === 'undefined'
    ? createSource({ token, variableValues, override, ...options })
    : emptySource
}

/**
 * @deprecated use createSource instead.
 */
export const initHypertune = createSource
/**
 * @deprecated use SourceNode instead.
 */
export type QueryNode = SourceNode
/**
 * @deprecated use Source instead.
 */
export type Query = Source
