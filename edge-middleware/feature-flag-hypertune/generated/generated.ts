/* eslint-disable */

import * as sdk from "hypertune";

const queryCode = `query FullQuery {
  root {
    exampleFlag
  }
}
`;

const query = {"Query":{"objectTypeName":"Query","selection":{"root":{"fieldArguments":{"__isPartialObject__":true},"fieldQuery":{"Root":{"objectTypeName":"Root","selection":{"exampleFlag":{"fieldArguments":{},"fieldQuery":null}}}}}}}};

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
        : queryArgs;

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
                    : null;

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
                ];
              }
            )
          ),
        },
      ];
    })
  );
}
  
export const vercelFlagDefinitions = {"exampleFlag":{"options":[{"value":true},{"value":false}],"origin":"https://app.hypertune.com/projects/2583/draft?view=logic&selected_field_path=root%3EexampleFlag"}};

export type Rec = {

}

export type Rec4 = {
  id: string;
  name: string;
  email: string;
}

export const EnvironmentEnumValues = [
  "DEVELOPMENT",
  "STAGING",
  "PRODUCTION"
] as const;
export type Environment = typeof EnvironmentEnumValues[number];

export type Rec3 = {
  user: Rec4;
  environment: Environment;
}

export type Rec2 = {
  context: Rec3;
}

export type Root = {
  exampleFlag: boolean;
}

const rootFallback = {exampleFlag:false};

export class RootNode extends sdk.Node {
  typeName = "Root" as const;

  get(fallback: Root = rootFallback as Root): Root {
    const getQuery = null;
    return this.evaluate(getQuery, fallback) as Root
  }

  /**
   * [Open in UI]({@link https://app.hypertune.com/projects/2583/draft?view=logic&selected_field_path=root%3EexampleFlag})
   */
  exampleFlag(args: Rec = {}): sdk.BooleanNode {
    const props0 = this.getField("exampleFlag", args);
    const expression0 = props0.expression;

    if (
      expression0 &&
      expression0.type === "BooleanExpression"
    ) {
      return new sdk.BooleanNode(props0);
    }

    const node = new sdk.BooleanNode(props0);
    node._logUnexpectedTypeError();
    return node;
  }
}

/**
 * Welcome to Hypertune, the most powerful feature flag, A/B testing and app
 * configuration platform.
 * 
 * Follow the quickstart: https://docs.hypertune.com/quickstart
 * 
 * This is your schema, written in GraphQL. Use Boolean for feature flags,
 * custom enums for flags with more than two states, Int for numeric flags like
 * limits and timeouts, Strings for in-app copy, and custom object and list types
 * for more complex app configuration.
 * 
 * Once you've defined your schema, head to the Logic tab.
 */
export type Query = {
  /**
   * You can add arguments to any field in your schema, which you can then
   * reference when defining your logic. We've added a 'context' argument on your
   * root field already, which contains details of the current 'user'.
   */
  root: Root;
}

const queryFallback = {root:{exampleFlag:false}};

export type Rec6 = {
  args: Rec2;
}

export type Rec5 = {
  root: Rec6;
}

/**
 * Welcome to Hypertune, the most powerful feature flag, A/B testing and app
 * configuration platform.
 * 
 * Follow the quickstart: https://docs.hypertune.com/quickstart
 * 
 * This is your schema, written in GraphQL. Use Boolean for feature flags,
 * custom enums for flags with more than two states, Int for numeric flags like
 * limits and timeouts, Strings for in-app copy, and custom object and list types
 * for more complex app configuration.
 * 
 * Once you've defined your schema, head to the Logic tab.
 */
export class QueryNode extends sdk.Node {
  typeName = "Query" as const;

  get(args: Rec5, fallback: Query = queryFallback as Query): Query {
    const getQuery = mergeQueryAndArgs(query, args);
    return this.evaluate(getQuery, fallback) as Query
  }

  /**
   * You can add arguments to any field in your schema, which you can then
   * reference when defining your logic. We've added a 'context' argument on your
   * root field already, which contains details of the current 'user'.
   */
  root(args: Rec2): RootNode {
    const props0 = this.getField("root", args);
    const expression0 = props0.expression;

    if (
      expression0 &&
      expression0.type === "ObjectExpression" &&
      expression0.objectTypeName === "Root"
    ) {
      return new RootNode(props0);
    }

    const node = new RootNode(props0);
    node._logUnexpectedTypeError();
    return node;
  }
}

export function initializeHypertune(
  variableValues: Rec,
  options: sdk.InitializeOptions = {}
): QueryNode {
  const defaultOptions = {
    query,
    queryCode,
    variableValues
  }

  return sdk.initialize(
    QueryNode,
    { ...defaultOptions, ...options }
  );
}