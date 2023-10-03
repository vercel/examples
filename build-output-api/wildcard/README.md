# Domain-Based Routing

## Build Output API

This Prebuilt Deployment example demonstrates how to use configure routing rules based on which domain name
was requested, when using the
[Build Output API](https://vercel.com/docs/build-output-api/v3#build-output-configuration/wildcard).

### Demo

https://build-output-api-wildcard.vercel.sh

### How it Works

The "wildcards" configuration in the [`.vercel/output/config.json`](./.vercel/output/config.json) file allows you to configure
any number of domain names (or sub-domains) that point to the same Deployment to route to specific pages based on the domain
name that is being requested. The most common use-case for this is to offer localized versions of your content based on the domain name.

When a matching domain name is requested that is configured in the "wildcards" configuration, the "value" is passed to the
routing configuration and can be referrenced by using the `$wildcard` placeholder. This allows you to route to specific
static files based on filename (like in this example), or to append that wildcard value as a query-string parameter for use
in your Edge and/or Serverless Functions.
