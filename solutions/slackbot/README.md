# Slackbot

This is a Slack Bot, using Vercel for serverless deployment and Upstash Redis for database.

## Deploy This Project on Vercel!

Simply fill the environmental variables defined below and your serverless functions will be up in seconds!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fslackbot&env=SLACK_SIGNING_SECRET,SLACK_BOT_TOKEN&integration-ids=oac_V3R1GIpkoJorr6fqyiwdhl17)

### Configuring Slack Bot - 1

1. Go to [Slack API Apps Page](https://api.slack.com/apps):
   - Create new App
     - From Scratch
     - Name your app & pick a workspace
   - Go to Oauth & Permissions
     - Add the following scopes
       - app_mentions:read
       - channels:read
       - chat:write
       - chat:write.public
       - commands
     - Install App to workspace
       - Basic Information --> Install Your App --> Install To Workspace
2. Note the variables (These will be the env variables for vercel deployment) :
   - `SLACK_SIGNING_SECRET`:
     - Go to Basic Information
       - App Credentials --> Signing Secret
   - `SLACK_BOT_TOKEN`:
     - Go to OAuth & Permissions
       - Bot User OAuth Token

---

### Deploying on Vercel

1. Click the deploy button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fslackbot&env=SLACK_SIGNING_SECRET,SLACK_BOT_TOKEN&integration-ids=oac_V3R1GIpkoJorr6fqyiwdhl17)

2. Fill the environmental variables defined above.

---

### Configuring Slack Bot - 2

- After deployment, you can use the provided `vercel_domain`.

1. Go to [Slack API Apps Page](https://api.slack.com/apps) and choose relevant app:

   - Go to Slash Commands:
     - Create New Command:
       - Command : `note`
       - Request URL : `<vercel_domain>/api/note`
       - Configure the rest however you like.
   - Go to Event Subscribtions:
     - Enable Events:
       - Request URL: `<vercel_domain>/api/events`
     - Subscribe to bot events by adding:
       - app_mention
       - channel_created

2. After these changes, Slack may require reinstalling of the app.
