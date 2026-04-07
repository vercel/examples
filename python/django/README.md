---
name: Django Hello World
slug: django-hello-world
description: Use Django on Vercel with Serverless Functions using the Python Runtime.
framework: Python
useCase: Starter
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango&env=DJANGO_SECRET_KEY&envDescription=Secret%20key%20for%20Django%20cryptographic%20signing&demo-title=Django%20%2B%20Vercel&demo-description=Use%20Django%20on%20Vercel%20with%20Serverless%20Functions%20using%20the%20Python%20Runtime.&demo-url=https%3A%2F%2Fdjango-template.vercel.app%2F&demo-image=https://assets.vercel.com/image/upload/v1669994241/random/django.png
demoUrl: https://django-template.vercel.app/
---

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango&env=DJANGO_SECRET_KEY&envDescription=Secret%20key%20for%20Django%20cryptographic%20signing&demo-title=Django%20%2B%20Vercel&demo-description=Use%20Django%20on%20Vercel%20with%20Serverless%20Functions%20using%20the%20Python%20Runtime.&demo-url=https%3A%2F%2Fdjango-template.vercel.app%2F&demo-image=https://assets.vercel.com/image/upload/v1669994241/random/django.png)

# Django + Vercel

This example shows how to use Django on Vercel with Serverless Functions using the [Python Runtime](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python).

## Demo

https://django-template.vercel.app/

## Setting the Secret Key

Django requires a secret key for cryptographic signing to be set in the `DJANGO_SECRET_KEY` environment variable. This can be set in the web interface, or by running:

```bash
uv run python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())' | vercel env add -y DJANGO_SECRET_KEY prod
```

## How it Works

Vercel detects Django's `manage.py` and uses that to find the WSGI entrypoint and the configuration for static files.

## Running Locally

```bash
uv sync
uv run python manage.py runserver
```

Your Django application is now available at `http://localhost:8000`.

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango&env=DJANGO_SECRET_KEY&envDescription=Secret%20key%20for%20Django%20cryptographic%20signing&demo-title=Django%20%2B%20Vercel&demo-description=Use%20Django%20on%20Vercel%20with%20Serverless%20Functions%20using%20the%20Python%20Runtime.&demo-url=https%3A%2F%2Fdjango-template.vercel.app%2F&demo-image=https://assets.vercel.com/image/upload/v1669994241/random/django.png)
