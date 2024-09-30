<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
<<<<<<< HEAD
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
=======
        if ($request->user()->hasVerifiedEmail()) {
>>>>>>> main
            return redirect()->intended(
                config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
            );
        }

<<<<<<< HEAD
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
=======
        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
>>>>>>> main
        }

        return redirect()->intended(
            config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
        );
    }
}
