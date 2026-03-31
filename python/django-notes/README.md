[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fdjango-notes&project-name=django-notes&repository-name=django-notes&demo-title=Django%20Notes&demo-description=A%20simple%20note-taking%20app%20built%20with%20Django%206.&demo-url=https%3A%2F%2Fdjango-notes.vercel.app%2F&products=%5B%7B%22type%22%3A%22integration%22%2C%22group%22%3A%22postgres%22%7D%5D)

# Django Notes

A simple note-taking app built with Django, demonstrating server-side rendering, URL routing, forms, and ORM with SQLite locally and Postgres on Vercel.

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

Database migrations run automatically on each deploy via a build script in `pyproject.toml`:

```toml
[tool.vercel.scripts]
build = 'if [ -n "$DATABASE_URL" ]; then python manage.py migrate --noinput; fi'
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

**3. Deploy**

Migrations run automatically during the build (see `[tool.vercel.scripts]` in `pyproject.toml`).

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

