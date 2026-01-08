# Static Custom Error Pages Example

This example demonstrates how to create custom error pages for 5xx server errors using static HTML files in the `public` directory. This feature is available for Enterprise customers.

## Structure

```
public/
├── 500.html    # Generic server error (fallback for all 5xx)
└── 504.html    # Specific gateway timeout page
```

## How it works

When deployed to Vercel, error pages are automatically detected and routes are generated:

| Error | Destination |
|-------|-------------|
| 500 | `/500.html` |
| 502 | `/500.html` (fallback) |
| 503 | `/500.html` (fallback) |
| 504 | `/504.html` |
| 508 | `/500.html` (fallback) |

## Learn more

- [Custom Error Pages Documentation](https://vercel.com/docs/cdn/custom-error-pages)
