<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Middleware\Authenticate;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/register', [RegisteredUserController::class, 'store']);

Route::get('/login', [AuthenticatedSessionController::class, 'store']);

Route::get('/forgot-password', [PasswordResetLinkController::class, 'store'])
                ->middleware('guest')
                ->name('password.email');

Route::get('/reset-password', [NewPasswordController::class, 'store'])
                ->middleware('guest')
                ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
                ->middleware(['auth', 'signed', 'throttle:6,1'])
                ->name('verification.verify');

Route::get('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
                ->middleware(['auth', 'throttle:6,1'])
                ->name('verification.send');

Route::get('/logout', [AuthenticatedSessionController::class, 'destroy']);
