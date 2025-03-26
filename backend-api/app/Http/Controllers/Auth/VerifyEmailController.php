<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Auth\Events\Verified;

class VerifyEmailController extends Controller
{
    /*
        * Mark the authenticated user's email address as verified.
    */
    public function __invoke($id, $hash)
    {
        $user = User::findOrFail($id); // Busca el usuario por id en la ruta

        // Verifica si el hash en la URL es válido para este usuario.
        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect()->intended(
                config('app.frontend_url') . '/verified/failure'
            );
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(
                // ruta proveniente del .env
                config('app.frontend_url') . '/verified/success'
            );
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect()->intended(
            config('app.frontend_url') . '/verified/success'
        );
    }
}
