import { graphql } from "@/lib/graphql";

export const navigationLinkFragment = graphql(`
  fragment NavigationLink on NavigationItem {
      label
      href
      isExternal
  }
`);
