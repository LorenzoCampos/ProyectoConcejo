<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getUsers(): JsonResponse
    {

        // Obtener usuarios que no tienen el rol de 'admin'
        $users = User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'admin'); // Cambia 'admin' al nombre de tu rol si es necesario
        })->select('id', 'name')->get();

        // Iterar sobre cada usuario y obtener solo el nombre del rol
        $usersWithRoles = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'roles' => $user->roles->pluck('name')->first() // Solo obtener los nombres de los roles
            ];
        });

        // Devolver los usuarios y sus roles en formato JSON
        return response()->json($usersWithRoles);


        // // Obtener todos los usuarios
        // $users = User::with('roles:name')->select('id', 'name')->get();

        // // Iterar sobre cada usuario y obtener sus roles
        // $usersWithRoles = $users->filter(function ($user) {

        //     $role = $user->roles->pluck('name');

        //     return !$role->contains('admin');

        // })->map(function($user){
        //     return [
        //         'id'=>$user->id,
        //         'name' => $user->name,
        //         'roles' => $user->roles->pluck('name') // Obtener los roles del usuario
        //     ];
        // });

        // // Devolver los usuarios y sus roles en formato JSON
        // return response()->json($usersWithRoles);
    }

    public function updateRole(Request $request, User $user)
    {
        try {
            // Validar la solicitud
            $request->validate([
                'role' => 'required|string|exists:roles,name',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 401);
        }

        // un admin no puede cabiar un rol a admin
        if ($user->hasRole('admin')) {
            return response()->json(['message' => 'No se puede cambiar el rol de un usuario administrador.']);
        }
        if ($request->role == 'admin') {
            return response()->json(['message' => 'No se puede cambiar el rol a administrador.']);
        }

        // Borrar todos los roles existentes
        $user->syncRoles([]); // Elimina todos los roles del usuario

        // Asignar el nuevo rol al usuario
        $user->assignRole($request->input('role'));

        return response()->json(['message' => 'Rol actualizado exitosamente.']);
    }

    public function getRole(): JsonResponse
    {
        // Obtener role del usuario
        $user = Auth::user();
        return response()->json([
            'user' => $user,
            'role' => $user->roles->pluck('name')->first()
        ]);
    }
}
