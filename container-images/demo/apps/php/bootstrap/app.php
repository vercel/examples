<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // The app runs behind Vercel's HTTPS proxy. Trust the forwarded
        // headers so Laravel knows the real scheme/host and never generates
        // insecure (http://) URLs.
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR
                | Request::HEADER_X_FORWARDED_HOST
                | Request::HEADER_X_FORWARDED_PORT
                | Request::HEADER_X_FORWARDED_PROTO
                | Request::HEADER_X_FORWARDED_AWS_ELB,
        );

        // This service is fully stateless (no auth, no stored data), and runs
        // without a database/session store. CSRF protection has nothing to
        // protect here and only causes 419 "Page Expired" when the session
        // backing the token isn't available, so exclude the invoice routes.
        $middleware->validateCsrfTokens(except: [
            'php/generate',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
