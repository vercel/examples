---
name: Django REST Framework + Vercel
slug: django-rest-framework
description: A minimal Django REST Framework API running on Vercel Serverless Functions.
framework: Python
useCase: Starter
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango-rest-framework&env=DJANGO_SECRET_KEY&envDescription=Secret%20key%20for%20Django%20cryptographic%20signing&demo-title=Django%20REST%20Framework%20%2B%20Vercel&demo-description=A%20minimal%20Django%20REST%20Framework%20API%20running%20on%20Vercel%20Serverless%20Functions.&demo-url=https%3A%2F%2Fdjango-rest-framework-example.vercel.app%2F
demoUrl: https://django-rest-framework-example.vercel.app/api/time/
---

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango-rest-framework&env=DJANGO_SECRET_KEY&envDescription=Secret%20key%20for%20Django%20cryptographic%20signing&demo-title=Django%20REST%20Framework%20%2B%20Vercel&demo-description=A%20minimal%20Django%20REST%20Framework%20API%20running%20on%20Vercel%20Serverless%20Functions.&demo-url=https%3A%2F%2Fdjango-rest-framework-example.vercel.app%2F)

# Django REST Framework + Vercel

A minimal [Django REST Framework](https://www.django-rest-framework.org/) API running on Vercel with Serverless Functions using the [Python Runtime](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python).

## Demo

https://django-rest-framework-example.vercel.app/api/time/

## Setting the Secret Key

Django requires a secret key for cryptographic signing to be set in the `DJANGO_SECRET_KEY` environment variable. This can be set in the web interface, or by running:

```bash
uv run python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())' | vercel env add -y DJANGO_SECRET_KEY prod
```

## How it Works

A single DRF view in `api/views.py` returns the current UTC time as JSON:

```python
@api_view(["GET"])
def current_time(request):
    return Response({"time": datetime.now(timezone.utc).isoformat()})
```

This view is exposed at `/api/time/` and the app is served via WSGI in `config/wsgi.py`:

```python
application = get_wsgi_application()
```

## Running Locally

```bash
uv sync
uv run python manage.py runserver
```

Your API is now available at `http://localhost:8000/api/time/`.

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango-rest-framework&env=DJANGO_SECRET_KEY&envDescription=Secret%20key%20for%20Django%20cryptographic%20signing&demo-title=Django%20REST%20Framework%20%2B%20Vercel&demo-description=A%20minimal%20Django%20REST%20Framework%20API%20running%20on%20Vercel%20Serverless%20Functions.&demo-url=https%3A%2F%2Fdjango-rest-framework-example.vercel.app%2F)
