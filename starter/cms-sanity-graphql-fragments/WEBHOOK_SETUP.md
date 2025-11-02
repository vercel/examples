# On-Demand Revalidation Setup

This project has been configured to use on-demand revalidation instead of time-based ISR. Content changes in Sanity will trigger immediate cache invalidation.

## Implementation

### 1. API Route
- **Location**: `src/app/api/revalidate/route.ts`
- **Purpose**: Handles webhook requests from Sanity and triggers revalidation

### 2. Revalidation Logic

#### Navigation/Footer Changes
- **Trigger**: Changes to `navigation` or `footer` document types
- **Action**:
  - `revalidateTag("navigation")` - Revalidates navigation cache tag
  - `revalidateTag("footer")` - Revalidates footer cache tag
- **Reason**: Navigation and footer use tag-based caching via `unstable_cache` in layout.tsx with `tags: ["navigation", "footer"]`

#### Post Changes
- **Trigger**: Changes to `post` document type
- **Action**: 
  - `revalidatePath('/posts/{slug}')` - Revalidates specific post page
  - `revalidatePath('/')` - Revalidates home page (shows posts list)

#### Page Changes
- **Trigger**: Changes to `page` document type
- **Action**: `revalidatePath('/{slug}')` - Revalidates specific page

### 3. Environment Variables
Add to your `.env.local`:
```
SANITY_REVALIDATE_SECRET=your-webhook-secret-here
```

## Sanity Webhook Configuration

### 1. Create Webhook in Sanity Studio
1. Go to your Sanity project dashboard
2. Navigate to API → Webhooks
3. Click "Create webhook"

### 2. Webhook Settings
- **Name**: Next.js On-Demand Revalidation
- **URL**: `https://your-domain.com/api/revalidate?secret=your-webhook-secret-here`
- **Trigger on**: Create, Update, Delete
- **Filter**: Leave empty to trigger on all document changes
- **HTTP method**: POST

### 3. Webhook Payload
The webhook will receive a payload like:
```json
{
  "_type": "post",
  "slug": {
    "current": "my-post-slug"
  },
  "_id": "document-id",
  // ... other document fields
}
```

## Security

- The webhook endpoint validates the secret parameter
- Invalid secrets return 401 Unauthorized
- Errors are logged and return 500 status

## Testing

### Local Testing
1. Start your development server: `npm run dev`
2. Use a tool like ngrok to expose your local server
3. Configure the webhook URL to point to your ngrok URL
4. Make changes in Sanity Studio and verify revalidation

### Production Testing
1. Deploy your application
2. Configure the webhook URL to your production domain
3. Monitor the webhook logs in Sanity dashboard
4. Verify cache invalidation by checking page updates

## Benefits

1. **Immediate Updates**: Content changes are reflected instantly
2. **Efficient Caching**: Pages stay cached until content actually changes
3. **Smart Invalidation**: Navigation/footer changes properly invalidate all pages
4. **Better Performance**: No unnecessary regeneration every N seconds
5. **Reduced Server Load**: Only regenerates when needed

## Troubleshooting

### Webhook Not Triggering
- Check webhook URL is correct and accessible
- Verify secret parameter matches environment variable
- Check Sanity webhook logs for errors

### Revalidation Not Working
- Check server logs for revalidation errors
- Verify the document type and slug are being processed correctly
- Ensure the paths being revalidated match your route structure

### Performance Issues
- Monitor revalidation frequency
- Consider rate limiting if needed
- Check for webhook loops or excessive triggers
