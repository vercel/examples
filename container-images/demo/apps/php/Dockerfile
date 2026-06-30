# Build stage: scaffold a real Laravel app and install dependencies.
FROM php:8.3-cli AS builder

# System deps for composer + dompdf (zip, gd for image handling, etc.).
RUN apt-get update && apt-get install -y --no-install-recommends \
      git unzip libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip gd \
    && rm -rf /var/lib/apt/lists/*

# Composer from the official image.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Create a fresh Laravel skeleton (guarantees a correct framework layout),
# then add the dompdf package for PDF generation.
RUN composer create-project --no-interaction --prefer-dist laravel/laravel:^12.0 . \
    && composer require --no-interaction barryvdh/laravel-dompdf

# Overlay our application files (routes, controller, views, public assets).
COPY app/ ./app/
COPY routes/ ./routes/
COPY resources/ ./resources/
COPY bootstrap/app.php ./bootstrap/app.php

# Configure for a stateless, database-less deployment:
#  - session/cache use the in-memory "array" store (no DB, no local files)
#  - production env with debug off
RUN sed -i \
      -e 's/^APP_ENV=.*/APP_ENV=production/' \
      -e 's/^APP_DEBUG=.*/APP_DEBUG=false/' \
      -e 's/^SESSION_DRIVER=.*/SESSION_DRIVER=array/' \
      -e 's/^CACHE_STORE=.*/CACHE_STORE=array/' \
      .env

# Generate an application key.
RUN php artisan key:generate --force \
    && php artisan config:clear

# Runtime stage.
FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
      libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip gd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app /app

# Laravel needs these writable.
RUN chmod -R ug+rw storage bootstrap/cache

# Vercel routes traffic to port 80 by default.
ENV PORT=80
EXPOSE 80

# Serve via PHP's built-in server, routing all requests through Laravel's
# public/index.php front controller.
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-80} -t public public/index.php"]
