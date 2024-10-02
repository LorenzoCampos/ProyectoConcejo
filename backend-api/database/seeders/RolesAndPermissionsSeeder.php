<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {

        // Definir permisos
        $permissions = [
            'crear normativa',
            'modificar normativa',
            'crear banner',
            'modificar banner',
            'crear noticia',
            'modificar noticia',
            'crear orden del día',
            'crear orden de comisión',
            'ver normativa',
            'ver modificaciones',
            'registrar usuarios'
        ];

        // Crear cada permiso
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Crear roles
        $adminRole = Role::create(['name' => 'admin']);
        $secretarioRole = Role::create(['name' => 'secretario']);
        $concejalRole = Role::create(['name' => 'concejal']);
        $cmRole = Role::create(['name' => 'cm']);
        $userRole = Role::create(['name' => 'user']);

        // Asignar todos los permisos al rol de admin
        $adminRole->givePermissionTo([
            'crear normativa',
            'modificar normativa',
            'crear orden del día',
            'crear orden de comisión',
            'ver normativa',
            'ver modificaciones',
            'registrar usuarios'
        ]);

        $secretarioRole->givePermissionTo([
            'crear normativa',
            'modificar normativa',
            'ver normativa',
            'ver modificaciones'
        ]);

        $concejalRole->givePermissionTo([
            'crear normativa',
            'ver normativa',
            'ver modificaciones'
        ]);

        $cmRole->givePermissionTo([
            'crear banner',
            'modificar banner',
            'crear noticia',
            'modificar noticia'
        ]);
    }
}
