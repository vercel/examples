// @ory/integrations offers a package for integrating with NextJS.
import { createApiHandler } from '@ory/integrations/next-edge'

// We need to export the config.
export const config = {
  api: {
    bodyParser: false,
  },
}

// And create the Ory Cloud API "bridge".
export default createApiHandler({
  fallbackToPlayground: true,
})
