<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

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
            // Validar los datos de la petición
            $validatedData = $request->validate([
                'name' => ['nullable', 'string', 'max:255'],
                'last_name' => ['nullable', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                'email_confirmation' => ['required', 'string', 'email', 'max:255', 'same:email'],
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'role' => ['required', 'string', 'min:1', 'regex:/^[a-z]+$/', 'exists:roles,name'] // Verifica si el rol existe en la tabla 'roles'
            ]);

            // Validar que el rol no sea 'admin'
            if ($validatedData['role'] === 'admin') {
                return response()->json([
                    'message' => 'No se puede registrar un usuario administrador.',
                    'errors' => ['role' => ['El rol admin está restringido para este registro.']]
                ], 403);
            }

            // Crear el usuario
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
            ]);

            // Registrar el evento de registro
            event(new Registered($user));

            // Asignar el rol (por defecto "user" si no se proporciona)
            $user->assignRole($validatedData['role'] ?? 'user');

            // Obtener el rol como un string
            $role = $user->roles->first()->name;  // Esto obtiene el nombre del rol como string

            // Devolver el usuario con el rol asignado
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'role' => $role
            ], 201);
        } catch (ValidationException $e) {
            // Manejar los errores de validación
            return response()->json([
                'message' => 'Errores de validación.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Manejar errores generales
            return response()->json([
                'message' => 'Ocurrió un error al crear el usuario.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
