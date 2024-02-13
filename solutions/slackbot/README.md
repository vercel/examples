# OpenAI Slackbot with Node.js

This is a Slackbot you can ask questions and get answers from OpenAI's GPT model.

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/slackbot&env=OPENAI_API_KEY,SLACK_BOT_TOKEN,SLACK_SIGNING_SECRET)

### Environment Variables

After completing the setup instructions below, you will have the following `.env` file in your project for testing locally, and the same environment variables added on Vercel:

```bash
OPENAI_API_KEY=
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
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
