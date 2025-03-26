<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function show(): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::user();

            // Obtener el rol del usuario como un string
            $role = $user->roles->pluck('name')->first();

            // Verificar si el correo electrónico está verificado
            if ($user->email_verified_at === null) {
                $verified_email = false;
            } else {
                $verified_email = true;
            }

            // Devolver la respuesta
            return response()->json([
                'user' => $user,
                'role' => $this->typeTranslate($role),
                'email_verified' => $verified_email
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function update(Request $request): JsonResponse
    {
        try {
            // Validar la solicitud
            $validated = $request->validate([
                'name' => 'string|max:255',
                'last_name' => 'string|max:255',
            ]);

            // Obtener el usuario autenticado
            $user = Auth::user();

            // Actualizar el nombre y/o apellido del usuario
            if (isset($validated['name'])) {
                $user->name = $validated['name'];
            }
            if (isset($validated['last_name'])) {
                $user->last_name = $validated['last_name'];
            }

            // Guardar los cambios en la base de datos
            $user->save();

            // Devolver una respuesta exitosa
            return response()->json([
                'message' => 'Usuario actualizado exitosamente.'
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Errores de validación.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function getNonAdminUsers(): JsonResponse
    {
        try {
            // Obtener usuarios que no tienen el rol de 'admin'
            $users = User::whereDoesntHave('roles', function ($query) {
                $query->where('name', 'admin');
            })->get();

            $usersResponse = [];
            // Iterar sobre cada usuario y obtener solo el nombre del rol
            foreach ($users as $user) {
                $role = $user->roles->pluck('name')->first();
                $usersResponse[] = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $role
                ];
            }

            // Devolver los usuarios y sus roles en formato JSON
            return response()->json($usersResponse, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function changeUserRole(Request $request, User $user)
    {
        try {
            // Validar la solicitud
            $validated = $request->validate([
                'role' => 'required|string|exists:roles,name',
            ]);


            // un admin no puede cabiar un rol a admin
            if ($user->hasRole('admin')) {
                return response()->json(['message' => 'No se puede cambiar el rol de un usuario administrador.']);
            }
            if ($validated['role'] == 'admin') {
                return response()->json(['message' => 'No se puede cambiar el rol a administrador.']);
            }

            // Borrar todos los roles existentes
            $user->syncRoles([]); // Elimina todos los roles del usuario

            // eliminar todos los tokens relacionados al usuario
            $user->tokens()->delete();

            // Asignar el nuevo rol al usuario
            $user->assignRole($validated['role']);

            return response()->json(['message' => 'Rol actualizado exitosamente.'], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Errores de validación.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 401);
        }
    }

    public function getRole(): JsonResponse
    {
        try {
            // Obtener role del usuario
            $user = Auth::user();
            return response()->json([
                'user' => $user,
                'role' => $user->roles->pluck('name')->first()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function getAllRoles(): JsonResponse
    {
        $roles = Role::all();

        if (!$roles) {
            return response()->json(['message' => 'No hay registros'], 404);  // Responder con status 404 si no hay registros
        }

        return response()->json($roles, 200);
    }

    public function typeTranslate($type)
    {
        switch ($type) {
            case 'ordinance':
                return 'Ordenanza';
            case 'correspondence':
                return 'Correspondencia';
            case 'declaration':
                return 'Declaración';
            case 'resolution':
                return 'Resolución';
            case 'minute':
                return 'Minuta';
            case 'decree':
                return 'Decreto';
            case 'dem-message':
                return 'Mensaje DEM';
            default:
                return 'Desconocido';
        }
    }
}
