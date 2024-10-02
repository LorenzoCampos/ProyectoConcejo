<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        try {
            try {
                // Aunteticar el usuario
                $request->authenticate();
            } catch (\Exception $e) {
                return response()->json([
                    'message' => $e->getMessage()
                ], 401);
            }

            $user = $request->user();

            // Crear un nuevo token para el usuario
            $deviceId = $request->header('Device-Id');

            // Eliminar el token existente
            if ($user->tokens()->where('name', $deviceId)->exists()) {
                $user->tokens()->where('name', $deviceId)->delete();
            }

            // Crear el nuevo token
            $token = $user->createToken($deviceId);

            // Devolver el token
            return response()->json([
                'user' => $user,
                'token' => $token->plainTextToken,
            ], 200);
        } catch (\Exception $e) {
            // Manejar el error
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        try {
            // Eliminar el token específico que se está utilizando para esta solicitud
            $request->user()->currentAccessToken()->delete();
            // Devolver el token
            return response()->json([
                'message' => 'Successfully logged out'
            ], 200);
        } catch (\Exception $e) {
            // Manejar el error
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
