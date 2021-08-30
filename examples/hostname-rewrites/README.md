## Hostname Rewrites Example

In this example, you'll learn how to programmatically create unique content pages for your users with a multi-tenant infrastructure using Edge Middleware. Each user gets assigned a unique subdomain when they create their account, with the (usually paid) option to add a custom domain.

For context, here are some example pages:  
- https://test-site-1.vercel.app/ (subdomain)
- https://test-site-2.vercel.app/ (subdomain)
- https://test-site-3.vercel.app/ (subdomain)
- https://test-site-vercel.com/ (custom domain)

All of these generated sites are powered by ISR (no SSR at all) so they load pretty much instantly + the inter-page transitions are lightning fast. The app.platformize.co itself is static + SWR, which provides a great client-side transition UX.

The example above is generated based on the following mock database:

```
const mockDB = [
    {name: "Test Site", subdomain: "test-site-1", customDomain: "test-site-vercel.com"},
    {name: "Test Site 2", subdomain: "test-site-2", customDomain: null},
    {name: "Test Site 3", subdomain: "test-site-3", customDomain: null},
]
```