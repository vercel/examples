---
name: Django Notes App
slug: django-notes
description: A simple note-taking app built with Django, using SQLite locally and Postgres on Vercel.
framework: Python
useCase: Starter
database: Postgres
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango-notes&env=DJANGO_SECRET_KEY&envDescription=Secret%20key%20for%20Django%20cryptographic%20signing&project-name=django-notes&repository-name=django-notes&demo-title=Django%20Notes&demo-description=A%20simple%20note-taking%20app%20built%20with%20Django.&demo-url=https%3A%2F%2Fdjango-notes-example.vercel.app%2F&products=%5B%7B%22type%22%3A%22integration%22%2C%22group%22%3A%22postgres%22%7D%5D
demoUrl: https://django-notes-example.vercel.app/
---

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango-notes&env=DJANGO_SECRET_KEY&envDescription=Secret%20key%20for%20Django%20cryptographic%20signing&project-name=django-notes&repository-name=django-notes&demo-title=Django%20Notes&demo-description=A%20simple%20note-taking%20app%20built%20with%20Django.&demo-url=https%3A%2F%2Fdjango-notes-example.vercel.app%2F&products=%5B%7B%22type%22%3A%22integration%22%2C%22group%22%3A%22postgres%22%7D%5D)

# Django Notes

A simple note-taking app built with Django, demonstrating server-side rendering, URL routing, forms, and ORM with SQLite locally and Postgres on Vercel.

## Demo

https://django-notes-example.vercel.app/

## Setting the Secret Key

Django requires a secret key for cryptographic signing to be set in the `DJANGO_SECRET_KEY` environment variable. This can be set in the web interface, or by running:

```bash
uv run python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())' | vercel env add -y DJANGO_SECRET_KEY prod
```

## How it Works

This example uses Django's ORM, templates, and `staticfiles` app, served via WSGI on Vercel. The database defaults to SQLite locally and switches to Postgres when `DATABASE_URL` is set — Vercel automatically provisions this environment variable when you add a Postgres database. You can add a database during project import or later from the Storage tab.

Migrations run automatically on each deploy via `[tool.vercel.scripts]` in `pyproject.toml`. Because of this, you should use a database provider that supports branching (like Neon) so that preview deployments run migrations against an isolated branch rather than your production database.

Setting `READ_ONLY=true` disables all write operations.

## Running Locally

```bash
uv sync
uv run python manage.py migrate
uv run python manage.py runserver
```

Your app is now available at `http://localhost:8000`.

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango-notes&env=DJANGO_SECRET_KEY&envDescription=Secret%20key%20for%20Django%20cryptographic%20signing&project-name=django-notes&repository-name=django-notes&demo-title=Django%20Notes&demo-description=A%20simple%20note-taking%20app%20built%20with%20Django.&demo-url=https%3A%2F%2Fdjango-notes-example.vercel.app%2F&products=%5B%7B%22type%22%3A%22integration%22%2C%22group%22%3A%22postgres%22%7D%5D)
