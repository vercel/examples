/* eslint-disable */

import * as sdk from "hypertune";







const queryCode = `
  # To set up the SDK, follow the quickstart:
  # https://docs.hypertune.com/quickstart
  
  query FullQuery {
    root 
    # Try uncommenting the line below and passing different args
    # (context: { user: { id: "", name: "", email: "" } })
    {
      exampleFlag
    }
  }
  `;

const query = {"Query":{"objectTypeName":"Query","selection":{"root":{"fieldArguments":{"__isPartialObject__":true},"fieldQuery":{"Root":{"objectTypeName":"Root","selection":{"exampleFlag":{"fieldArguments":{},"fieldQuery":null}}}}}}}};




  
export type Rec4 = {
  id: string;
name: string;
email: string;
}

export type Rec3 = {
  user: Rec4;
}

export type Rec2 = {
  context: Rec3;
}

export type Rec = {
  
}
  

  
export class RootNode extends sdk.Node {
  typeName = "Root" as const;

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

export class QueryNode extends sdk.Node {
  typeName = "Query" as const;

  root(args: Rec2): RootNode {
        const props0 = this.getField("root", args);
        const expression0 = props0.expression;

                if (
    expression0 &&
    expression0.type === "ObjectExpression"
    && expression0.objectTypeName === "Root"
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
    query
    
    
    ,queryCode
    ,variableValues
    
  }

  return sdk.initialize(
    QueryNode,
    
    { ...defaultOptions, ...options }
  );
}