# Publishing Templates

> **Important**: This page is for Vercel employees only.

Whenever there's a change to a `README.md` file that's part of an example, a new draft template will be created in Contentful. In order to release the template you'll need to do the following:

1. Go to [Contentful](https://app.contentful.com) and in the **Front** organization click on **Content**.
2. Find the template using its `slug` to filter the list, filtering by `Templates` in `Content type` can help too.
3. Fill the missing required fields:

- **Thumbnail**: This is the image that will be displayed in the template card, with a 1.25:1 ratio, what you can do here is open devtools and use the [Device Toolbar](https://developer.chrome.com/docs/devtools/device-mode/) to pick a resolution like `1200x960` and then take a screenshot with devtools: `cmd + shift + p` and search for `Capture screenshot`

Once thats done click the Publish button and the template will be available in [vercel.com/templates](https://vercel.com/templates).

Future updates to the example's README will keep updated the template in Contentful automatically.

### Troubleshooting

If the Github Action that updates the templates fails, it's likely that there was a validation error in the template, like it having wrong values or missing required ones. For those cases, a new PR should be able to fix it and it can also be done manually if needed with:

```bash
# The following scripts are part of the monorepo in the `internal` folder
cd internal

pnpm update-template solutions/monorepo

# or to update multiple templates in the way the GH action does
pnpm update-templates solutions/monorepo/README.md solutions/nx-monorepo/README.md

# or to force update all templates
pnpm force-update-templates
```

Where `solutions/monorepo` is the path to the example. In order for it to work you'll need a `.env.local` file in the `internal` folder with:

```bash
CONTENTFUL_ACCESS_TOKEN = <access_token>
CONTENTFUL_SPACE_ID = <space-id>
CONTENTFUL_ENVIRONMENT = master
CONTENTFUL_CONTENT_TYPE = templates
```

The missing values can be found in Contentful, or you can ask someone from the team to provide them to you.
