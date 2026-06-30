<?php

use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;

/*
| The service is mounted behind the "/php" prefix on Vercel (the path is
| preserved when forwarded), so every route is grouped under "/php".
*/
Route::prefix('php')->group(function () {
    Route::get('/', [InvoiceController::class, 'form'])->name('invoice.form');
    Route::post('/generate', [InvoiceController::class, 'generate'])->name('invoice.generate');
    Route::get('/health', fn () => 'ok');
});
