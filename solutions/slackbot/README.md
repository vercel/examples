# OpenAI Slackbot with Node.js

This is a Slackbot you can ask questions and get answers from OpenAI's GPT model.

### Environment Variables

After completing the setup instructions below, you will have the following `.env` file in your project for testing locally, and the same environment variables added on Vercel:

```bash
OPENAI_API_KEY=
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
SLACK_ADMIN_MEMBER_ID=
```

#### OpenAI API Key

- Create a new key on [OpenAI API Keys](https://platform.openai.com/api-keys) and "Create new secret key", optionally naming the key.
- Add the key to Vercel's environment variables as `OPENAI_API_KEY`.

#### Slack Bot Token & Signing Secret

Go to [Slack API Apps Page](https://api.slack.com/apps):

- Create new App
  - From Scratch
  - Name your app & pick a workspace
- Go to OAuth & Permissions
  - Scroll to scopes
  - Add the following scopes
    - `app_mentions:read`
    - `channels:history`
    - `chat:write`
    - `commands`
  - Click "Install to Workplace"
  - Copy **Bot User OAuth Token**
  - Add the token to Vercel's environment variables as `SLACK_BOT_TOKEN`
- Getting signing secret
  - Basic Information --> App Credentials --> Copy **Signing Secret**
  - Add the secret to Vercel's environment variables as `SLACK_SIGNING_SECRET`

#### Admin's Slack Member ID

- Click on your profile picture in Slack and click **Profile**.
- Click on the three dots in the middle right corner and select **Copy member ID**.
- Add the ID to Vercel's environment variables as `SLACK_ADMIN_MEMBER_ID`.

### Enable Slack Events

After successfully deploying the app, go to [Slack API Apps Page](https://api.slack.com/apps) and select your app:

- Go to **Event Subscriptions** and enable events.
- Add the following URL to **Request URL**:
  - `https://<your-vercel-app>.vercel.app/api/events`
  - Make sure the URL is verified, otherwise check out [Vercel Logs](https://vercel.com/docs/observability/runtime-logs) for troubleshooting.
  - Subscribe to bot events by adding:
    - `app_mention`
    - `channel_created`
  - Click **Save Changes**.
- Slack requires you to reinstall the app to apply the changes.

## Local Development

Use the [Vercel CLI](https://vercel.com/docs/cli) and [localtunnel](https://github.com/localtunnel/localtunnel) to test out this project locally:

```sh
pnpm i -g vercel
pnpm vercel dev --listen 3000 --yes
```

```sh
npx localtunnel --port 3000
```

Make sure to modify the [subscription URL](./README.md/#enable-slack-events) to the `localtunnel` URL.
