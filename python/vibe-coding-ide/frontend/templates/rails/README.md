# Ruby on Rails Application

A minimal but functional Ruby on Rails application demonstrating core features.

## Features

- ✅ Rails 7.1 with modern defaults
- ✅ SQLite database
- ✅ Puma web server
- ✅ Beautiful, responsive UI
- ✅ RESTful routing
- ✅ MVC architecture
- ✅ Health check endpoint

## Getting Started

### Prerequisites

- Ruby 3.2.8 or higher
- Bundler

### Installation

```bash
# Install dependencies
bundle config set --local path vendor/bundle && bundle install

# Setup database
bundle exec rails db:prepare

# Start the server
bundle exec rails server -b 0.0.0.0 -p 3000
```

The application will be available at http://localhost:3000

### Notes

- This template does not include sprockets. If you add the asset pipeline later, re-enable any `config.assets.*` settings as needed. In development, `config.assets.quiet` is commented out to avoid errors when sprockets is absent.
- Host allowlist is configured in `config/initializers/allow_hosts.rb` to allow sandbox preview domains (`*.vercel.run`, `*.sbox.bio`) and localhost. Set `ALLOWED_HOST` to permit a specific external host.

## Project Structure

```
├── app/
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── views/          # Templates
│   └── helpers/        # View helpers
├── config/             # Application configuration
│   ├── routes.rb       # URL routing
│   ├── database.yml    # Database config
│   └── environments/   # Environment-specific settings
├── db/                 # Database files
└── public/             # Static files
```

## Available Routes

- `GET /` - Home page
- `GET /up` - Health check endpoint

## Quick Commands

```bash
# Start server
rails server

# Start console
rails console

# Run migrations
rails db:migrate

# View routes
rails routes

# Run tests
rails test
```

## Learn More

- [Rails Guides](https://guides.rubyonrails.org/)
- [Ruby Documentation](https://ruby-doc.org/)
- [Rails API](https://api.rubyonrails.org/)
