import { cacheExchange, createClient, fetchExchange } from "@urql/core";
import { initGraphQLTada } from "gql.tada";
import type { TypedObject } from "sanity";
import type { introspection } from "./generated/graphql-env";

export function createGraphQLClient() {
  const url = process.env.NEXT_PUBLIC_SANITY_GRAPHQL_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SANITY_GRAPHQL_URL is not configured");
  }

  return createClient({
    url,
    exchanges: [cacheExchange, fetchExchange],
  });
}

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    Date: string;
    JSON: TypedObject | TypedObject[];
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";
