# Next.js + Builder.io Personalization Starter

This example walks you through personalizing Builder.io landing pages with Next.js.

## Overview

To use this project, you need to do three things:

1. Get a copy of this repo.
1. Create a corresponding space in your account on [Builder.io](builder.io).
1. Connect the two using the space's private and public keys.

### Generating your Builder.io space

If you've just created your Builder.io account and logged in for the first time, Builder prompts you to create a space with a new Builder site or add Builder to an existing application.
For this example, click **Add Builder to an existing site or app**.

<figure>
    <img src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F19683b4ef3f54eb78e8c2fa6c65759a7" alt="Builder.io Welcome screen for creating a new Organization" width="600" style="display: block; margin: auto"/>
    <figcaption style="text-align: center">You can choose to create a new Builder site or Add Builder to an existing application.</figcaption>
</figure>

**If you don't have the introductory prompt for creating a space, take the following steps. If you do have the prompt in the previous step, skip to step 4.**

1. Click on the Organization icon on the bottom left.

<figure>
  <img src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F279657f9a38743e99a028173200d6f76" alt="Space icon with two people standing together" width="600" style="display: block; margin: auto"/>
  <figcaption style="text-align: center">The Organization icon features two figures and is on the left sidebar at the bottom.</figcaption>
</figure>

1. Hover over **Builder.io** and choose **+ New Space**.

<figure>
  <img src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F32d67ac4249c40fda0486fb7f38ac71b" alt="Menu options for creating a new space" width="400" style="display: block; margin: auto"/>
  <figcaption style="text-align: center">Access the menu for creating a new space by clicking on the Organization icon.</figcaption>
</figure>

1. Click **Add Builder to an existing site or app**.

1. When Builder asks you which e-commerce platform you use, select **None**.

1. Name your new space by entering "My Next.js App" and click **Create**.

<figure>
    <img src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F3b434d77529f4ae392a3d481a926092d" alt="Dialogue for creating a new space" width="400" style="display: block; margin: auto"/>
    <figcaption style="text-align: center">Enter a name for your new space, such as "My Next.js App".</figcaption>
</figure>

Now that you have a new space, the next step is connecting this space with your next.js application.

### Connecting Builder.io to your application

To connect your Builder.io space and your application, set the site URL and get the API key as follows:

1. In Builder.io, click on the Account icon on the left sidenav.

<figure>
   <img src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fd26eb45cd52a4cada42413cd5c99419d" alt="Account icon in left sidenav" width="200" style="display: block; margin: auto"/>
   <figcaption style="text-align: center">The Account icon takes you to important data about this space.</figcaption>
</figure>

1. Change the Site URL to `http://localhost:3000` and click to copy the Public API Key.

<figure>
   <img src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Faec18bf8ccf543ab94c4230a7791c894" alt="Change the Site URL in account settings." width="400" style="display: block; margin: auto"/>
   <figcaption style="text-align: center">The Site URL and API Key are in the **Space** tab.</figcaption>
</figure>

1. In your code editor, configure `.env.production` and `.env.development` with the [Public API Key](https://builder.io/account/space) by adding a line to each file as follows, but using your Public API Key that you copied in the previous step.
   For example:

   ```shell
   BUILDER_PUBLIC_KEY=08837cee608a405c806a3bed69acfe2d <-- replace this with your API Key
   ```

Do the same for your private key

    ```shell
    BUILDER_PRIVATE_KEY=xxx-xxxxx <-- replace this with your private API Key
    ```

## Running your application

To serve your application locally, install dependencies, serve, and view your preview.

1. Install dependencies by entering the follw\owing at the command line.

   ```
   npm install
   ```

1. Serve your application by running the following at the command line:

   ```
   npm run dev
   ```

1. In your browser, go to `http://localhost:3000` to see your application.

### Experimenting

Now that you have a configured Builder.io space and a running application, start by creating a page, assign any URL, publish and preview.
For more detail and ideas on creating pages, see [Creating a landing page in Builder
](https://www.builder.io/c/docs/creating-a-landing-page).

\*[Create custom targeting attributes](https://www.builder.io/c/docs/guides/targeting-and-scheduling#custom-targeting), those targeting attributes can be used when creating new content specific for a target audience.

## Demo

https://nextjs-builder-edge-personalization.vercel.app/

[hold ctrl + right click to show all the different personalization options from your space]

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel-customer-feedback/edge-functions/tree/main/examples/ab-personalization-builder-io&project-name=ab-testing-simple&env=BUILDER_PUBLIC_KEY,BUILDER_PRIVATE_KEY&project-name=personalization-edge&repo-name=personalizatin-edge)

## Next steps

- For more information on previewing your applications, see [Editing and previewing directly on your site](https://www.builder.io/c/docs/guides/preview-url).
- See [Getting started with the visual editor](https://www.builder.io/c/docs/guides/page-building) for an introduction to editing your pages without having to code.
- Check out [Builder best practices](https://www.builder.io/c/docs/best-practices) for guidance on how to approach site development with Builder.
