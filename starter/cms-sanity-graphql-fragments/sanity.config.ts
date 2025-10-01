import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./src/lib/schema";

// Define the actions that should be available for singleton documents
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

// Define the singleton document types
const singletonTypes = new Set(["navigation", "footer"]);

export default defineConfig({
  name: "default",
  title: "CMS GraphQL Fragments",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Navigation singleton
            S.listItem()
              .title("Navigation Settings")
              .id("navigation")
              .child(
                S.document().schemaType("navigation").documentId("navigation"),
              ),

            // Footer singleton
            S.listItem()
              .title("Footer Settings")
              .id("footer")
              .child(S.document().schemaType("footer").documentId("footer")),

            // Regular document types
            S.documentTypeListItem("author").title("Authors"),
            S.documentTypeListItem("post").title("Posts"),
            S.documentTypeListItem("page").title("Pages"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    ...schema,
    // Filter out singleton types from the global "New document" menu options
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
