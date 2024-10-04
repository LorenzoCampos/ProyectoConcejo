<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(
                config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
            );
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect()->intended(
            config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
        );
    }

    public function verify(Request $request){

        // Validar que el enlace es válido y tiene la firma correcta
        if (!$request->hasValidSignature()) {
            return response()->json(['message' => 'Invalid verification link'], 403);
        }

        // Buscar al usuario basado en el ID proporcionado en la URL
        $user = User::findOrFail($request->route('id'));

        // Verificar si el correo ya fue verificado
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        // Si el correo no ha sido verificado, lo marcamos como verificado
        if ($user->markEmailAsVerified()) {
            event(new Verified($user)); // Despachar el evento de verificación
        }

        return response()->json(['message' => 'Email successfully verified'], 200);

    }
}
