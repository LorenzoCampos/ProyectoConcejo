<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */

    public function store(LoginRequest $request): JsonResponse
    {
        try {
            // Verificar si el correo electrónico está registrado
            $user = User::where('email', $request->input('email'))->first();

            if (!$user) {
                return response()->json([
                    'message' => 'El correo electrónico no está registrado.'
                ], 422);
            }

            // Intentar autenticar al usuario
            if (!Hash::check($request->input('password'), $user->password)) {
                return response()->json([
                    'message' => 'La contraseña es incorrecta.'
                ], 422);
            }

            // Autenticar al usuario
            $request->authenticate();

            // Crear un nuevo token para el usuario
            $deviceId = $request->header('Device-Id');

            // Eliminar el token existente si existe
            $user->tokens()->where('name', $deviceId)->delete();

            // Crear el nuevo token
            $token = $user->createToken($deviceId);

            // Obtener el rol del usuario como un string
            $role = $user->roles->first()->name;

            if ($user->email_verified_at === null) {
                $verified_email = false;
            } else {
                $verified_email = true;
            }


            // Devolver la respuesta
            return response()->json([
                "user" => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'email_verified' => $verified_email,
                ],
                "token" => $token->plainTextToken,
                "role" => $role
            ], 200);
        } catch (\Exception $e) {
            // Manejar errores generales
            return response()->json([
                'message' => 'Ocurrió un error al iniciar sesión.',
                'error' => $e->getMessage()
            ], 500);
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
