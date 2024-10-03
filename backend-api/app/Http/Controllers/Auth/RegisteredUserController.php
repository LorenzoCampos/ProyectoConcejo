<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        try {
            try {
                // Validar los datos
                $request->validate([
                    'name' => ['required', 'string', 'max:255'],
                    'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
                    'password' => ['required', 'confirmed', Rules\Password::defaults()],
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => $e->getMessage()
                ], 401);
            }

            // Validar el rol, no se puede registrar un usuario administrador
            if ($request->role == 'admin') {
                return response()->json(['message' => 'No se puede registrar un usuario administrador.'], 400);
            }

            try {
                // Crear el usuario
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => $e->getMessage()
                ], 422);
            }

            // Registrar el usuario
            event(new Registered($user));

            // Asignar el rol
            if ($request->role) {
                $user->assignRole($request->role);
            } else {
                $user->assignRole('user');
            }

            $role = $user->roles->pluck('name');

            // Devolver el usuario
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ],
                'role' => $role
            ], 201);
        } catch (\Exception $e) {
            // Manejar el error
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
