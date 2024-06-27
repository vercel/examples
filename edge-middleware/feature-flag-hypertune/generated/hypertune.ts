/* eslint-disable */

import * as sdk from 'hypertune'

export const queryCode = `query FullQuery{root{exampleFlag}}`

export const query = {
  Query: {
    objectTypeName: 'Query',
    selection: {
      root: {
        fieldArguments: { __isPartialObject__: true },
        fieldQuery: {
          Root: {
            objectTypeName: 'Root',
            selection: {
              exampleFlag: { fieldArguments: {}, fieldQuery: null },
            },
          },
        },
      },
    },
  },
}

function mergeQueryAndArgs(
  query: sdk.Query<sdk.ObjectValueWithVariables>,
  queryArgs: sdk.ObjectValueWithVariables | null,
  unwrapObjectArgs = false
): sdk.Query<sdk.ObjectValueWithVariables> {
  return Object.fromEntries(
    Object.entries(query).map(([objectTypeName, fragment]) => {
      const objectArgs = unwrapObjectArgs
        ? queryArgs &&
          queryArgs[objectTypeName] &&
          queryArgs[objectTypeName] instanceof Object
          ? (queryArgs[objectTypeName] as sdk.ObjectValueWithVariables)
          : null
        : queryArgs

      return [
        objectTypeName,
        {
          objectTypeName,
          selection: Object.fromEntries(
            Object.entries(fragment.selection).map(
              ([fieldName, { fieldQuery }]) => {
                const fieldArgs =
                  objectArgs &&
                  objectArgs[fieldName] &&
                  objectArgs[fieldName] instanceof Object
                    ? (objectArgs[fieldName] as sdk.ObjectValueWithVariables)
                    : null

                return [
                  fieldName,
                  {
                    fieldArguments: {
                      ...(fieldArgs && fieldArgs.args
                        ? (fieldArgs.args as sdk.ObjectValueWithVariables)
                        : {}),
                    },
                    fieldQuery: fieldQuery
                      ? mergeQueryAndArgs(fieldQuery, fieldArgs, true)
                      : null,
                  },
                ]
              }
            )
          ),
        },
      ]
    })
  )
}

/**
 * @deprecated use '@vercel/flags/providers/hypertune' package instead.
 */
export const vercelFlagDefinitions = {
  exampleFlag: {
    options: [
      { label: 'Off', value: false },
      { label: 'On', value: true },
    ],
    origin:
      'https://app.hypertune.com/projects/2583/main/draft/logic?selected_field_path=root%3EexampleFlag',
    description: 'An example flag.',
  },
}

export type Rec = {}

export type Rec3 = {
  id: string
  name: string
  email: string
}

export const EnvironmentEnumValues = [
  'DEVELOPMENT',
  'STAGING',
  'PRODUCTION',
] as const
export type Environment = (typeof EnvironmentEnumValues)[number]

export type Rec2 = {
  user: Rec3
  environment: Environment
}

export type RootArgs = {
  context: Rec2
}

export type Root = {
  /**
   * An example flag.
   */
  exampleFlag: boolean
}

const rootFallback = { exampleFlag: false }

export class RootNode extends sdk.Node {
  typeName = 'Root' as const

  getRootArgs(): RootArgs {
    const { step } = this.props
    return (
      step?.type === 'GetFieldStep' ? step.fieldArguments : {}
    ) as RootArgs
  }

  get({ fallback = rootFallback as Root }: { fallback?: Root } = {}): Root {
    const getQuery = null
    return this.evaluate(getQuery, fallback) as Root
  }

  /**
   * An example flag.
   * [Open in Hypertune UI]({@link https://app.hypertune.com/projects/2583/main/draft/logic?selected_field_path=root%3EexampleFlag})
   */
  exampleFlag({
    args = {},
    fallback,
  }: {
    args?: Rec
    fallback: boolean
  }): boolean {
    const props0 = this.getField('exampleFlag', args)
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

export type Source = {
  root: Root
}

const sourceFallback = { root: { exampleFlag: false } }

export type Rec5 = {
  args: RootArgs
}

export type Rec4 = {
  root: Rec5
}

export class SourceNode extends sdk.Node {
  typeName = 'Query' as const

  get({
    args,
    fallback = sourceFallback as Source,
  }: {
    args: Rec4
    fallback?: Source
  }): Source {
    const getQuery = mergeQueryAndArgs(query, args)
    return this.evaluate(getQuery, fallback) as Source
  }

  root({ args }: { args: RootArgs }): RootNode {
    const props0 = this.getField('root', args)
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

export type VariableValues = Rec
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
