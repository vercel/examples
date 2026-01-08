# Next.js Custom Error Pages Example

This example demonstrates how to create custom error pages for 5xx server errors using Next.js App Router. This feature is available for Enterprise customers.

## Structure

```
app/
├── 500/
│   └── page.tsx    # Generic server error (fallback for all 5xx)
└── 504/
    └── page.tsx    # Specific gateway timeout page
```

## How it works

When deployed to Vercel, error pages are automatically detected and routes are generated:

| Error | Destination |
|-------|-------------|
| 500 | `/500` (from `app/500/page.tsx`) |
| 502 | `/500` (fallback) |
| 503 | `/500` (fallback) |
| 504 | `/504` (from `app/504/page.tsx`) |
| 508 | `/500` (fallback) |

## Learn more

- [Custom Error Pages Documentation](https://vercel.com/docs/cdn/custom-error-pages)
