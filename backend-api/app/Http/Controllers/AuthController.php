<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        // Crear una instancia del validador
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Verificar si la validación falla
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Errores de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        // Continuar con el registro si la validación pasa
        try {
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al registrar el usuario.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Método para iniciar sesión
    public function login(Request $request)
    {
        try {
            // Validación de los datos
            $validatedData = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            // Intentar autenticar al usuario
            if (!Auth::attempt($validatedData)) {
                return response()->json([
                    'message' => 'Credenciales incorrectas.'
                ], 401);
            }

            $user = Auth::user();

            // Generar el token de acceso
            $token = $user->createToken('authToken')->plainTextToken;

            // Responder con los datos del usuario y el token
            return response()->json([
                'user' => $user,
                'token' => $token
            ], 200);

        } catch (\Exception $e) {
            // Capturar cualquier error inesperado
            return response()->json([
                'message' => 'Error al intentar iniciar sesión.',
                'error' => $e->getMessage()
            ], 500); // Error 500: problema interno del servidor
        }
    }

    // Método para cerrar sesión
    public function logout(Request $request)
    {
        try {
            // 1. Eliminar el token de acceso
            $request->user()->currentAccessToken()->delete();

            // 2. Devolver una respuesta de éxito
            return response()->json([
                'message' => 'Sesión cerrada exitosamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al cerrar sesión.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

