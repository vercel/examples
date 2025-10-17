import { registerUrql } from "@urql/next/rsc";
import { unstable_cache } from "next/cache";
import { Footer, footerFragment } from "@/components/layout/footer";
import { Navigation, navigationFragment } from "@/components/layout/navigation";
import { createGraphQLClient, graphql } from "@/lib/graphql";

const GET_LAYOUT_DATA = graphql(
  `
  query GetLayoutData {
    Navigation(id: "navigation") {
      ...Navigation
    }
    Footer(id: "footer") {
      ...Footer
    }
  }
`,
  [navigationFragment, footerFragment],
);

const { getClient } = registerUrql(createGraphQLClient);

const getLayoutData = unstable_cache(
  async () => {
    const { data, error } = await getClient().query(GET_LAYOUT_DATA, {});
    if (error) {
      console.error("Layout data fetch error:", error);
      return { navigation: null, footer: null };
    }
    return {
      navigation: data?.Navigation ?? null,
      footer: data?.Footer ?? null,
    };
  },
  ["layout-data"],
  {
    tags: ["navigation", "footer"],
    revalidate: false, // Only revalidate on-demand via tags
  },
);

interface LayoutComponentsWrapperProps {
  children: React.ReactNode;
}

export async function LayoutComponentsWrapper({
  children,
}: LayoutComponentsWrapperProps) {
  const { navigation, footer } = await getLayoutData();

  return (
    <>
      {navigation && <Navigation data={navigation} />}
      {children}
      {footer && <Footer data={footer} />}
    </>
  );
}
