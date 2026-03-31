# Django Notes

A simple note-taking app built with Django 6, demonstrating server-side rendering, URL routing, forms, and ORM with SQLite locally and Postgres on Vercel.

## Demo

https://django-notes.vercel.app/

## How it Works

The `Note` model is defined in `notes/models.py`:

```python
class Note(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
```

The database defaults to SQLite locally and switches to Postgres when `DATABASE_URL` is present — Vercel sets this automatically when you provision a Postgres database:

```python
if os.environ.get("DATABASE_URL"):
    # Postgres on Vercel
else:
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", ...}}
```

CSS is served as a static file from `notes/static/notes/style.css` via Django's `staticfiles` app and referenced in the base template with `{% static %}`.

The app is exposed to Vercel via WSGI in `config/wsgi.py`:

```python
application = get_wsgi_application()
```

Setting the environment variable `READ_ONLY=true` disables all write operations and hides the create, edit, and delete UI.

## Running Locally

```bash
uv sync
uv run python manage.py migrate
uv run python manage.py runserver
```

Your app is now available at `http://localhost:8000`.

## Deploying to Vercel

This app uses SQLite locally. Vercel's serverless environment does not have a persistent filesystem, so you'll need to provision a Postgres database before deploying.

**1. Install the Vercel CLI and link your project**

```bash
npm install -g vercel
vercel link
```

**2. Add a Postgres database**

From the [Vercel dashboard](https://vercel.com/dashboard), go to your project's **Storage** tab and create a Postgres database. Vercel will automatically add `DATABASE_URL` to your project's environment variables.

**3. Pull environment variables and run migrations**

```bash
vercel env pull
uv run python manage.py migrate
```

**4. Deploy**

```bash
vercel --prod
```

## Project Structure

```
django-notes/
├── config/               # Django project config (settings, urls, wsgi)
└── notes/                # Notes app
    ├── models.py         # Note model (title, body)
    ├── forms.py          # NoteForm
    ├── views.py          # list, create, detail, edit, delete views
    ├── urls.py           # URL patterns
    ├── migrations/       # Database migrations
    ├── static/notes/     # CSS
    └── templates/notes/  # HTML templates
```

