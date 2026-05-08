---
name: Add API External Origin Routing Rule
slug: add-api-external-rewrite-routing-rule
description: Using project-level routing rules for a rewrite.
useCase: CDN
deployUrl: https://vercel.com/[team]/[project]/cdn/routing/new?name=API+Proxy&path=%2Fapi%2F%3Apath*&syntax=pattern&action=rewrite&dest=https%3A%2F%2Fapi.example.com%2F%241
---

# Add API External Origin Routing Rule

A project routing rule template that rewrites requests under `/api` to an external origin, letting you proxy API traffic through your domain without code changes or redeployment.

Proxying puts the [Vercel CDN](https://vercel.com/docs/cdn) in front of your backend, improving performance through Vercel's global edge network and reducing cost with [built-in caching](https://vercel.com/docs/caching). It also adds a layer of security with the [Vercel Firewall](https://vercel.com/docs/vercel-firewall).

## Overview

Project level routing rules let you manage routing at the CDN layer without deploying new code. Rules take effect instantly after publishing and can be configured through the Vercel Dashboard, CLI, API, or SDK.

This template creates a rewrite rule that proxies all requests matching `/api/:path*` to an external backend. This is useful when your API is hosted separately and you want to serve it through your Vercel domain to avoid CORS issues and keep backend URLs hidden from clients.

## To use

1. Click "Add Route" above.
2. Select your team and project.
3. Replace the destination `https://api.example.com/$1` with your actual backend URL.
4. Save the rule, review your changes, and click "Publish" to activate.

## Consider customization

The generated routing rule provides a basic rewrite structure. Consider customizing the following to suit your needs:

- **Destination**: Update the URL to point to your backend API.
- **Path pattern**: Adjust `/api/:path*` to match your specific API paths.
- **Response headers**: Add a `CDN-Cache-Control` header to cache responses at the edge.
- **Cache tags**: Add a `Vercel-Cache-Tag` header to enable targeted cache purging.

## Configure via CLI, API, or SDK

### Vercel CLI

```bash
vercel routes add "API Proxy" \
  --src "/api/:path*" \
  --src-syntax path-to-regexp \
  --action rewrite \
  --dest "https://api.example.com/:path*" \
  --yes

vercel routes publish --yes
```

Routing rules can also be configured using the [Vercel REST API](https://vercel.com/docs/rest-api/project-routes/add-a-routing-rule) or the [Vercel SDK](https://vercel.com/docs/rest-api/sdk/project-routes/add-a-routing-rule).

## Code-based approach

Routing rules can also be defined in your code for version control. See the [Proxy requests to external origins](https://vercel.com/templates/template/proxy-requests-to-external-origins) template for a code-based approach using `vercel.ts`.
