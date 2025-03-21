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
            'registrar usuarios',
            'ver usuarios',
            'modificar roles de usuarios',
            'ver todos los roles'
        ];

        // Crear cada permiso
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Crear roles
        $adminRole = Role::create(['name' => 'admin']);
        $asesorRole = Role::create(['name' => 'asesor']);
        $mesaDeEntradaRole = Role::create(['name' => 'mesa']);
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
            'ver usuarios',
            'modificar roles de usuarios',
            'registrar usuarios',
            'ver todos los roles'
        ]);

        $asesorRole->givePermissionTo([
            'crear normativa',
            'modificar normativa',
            'ver normativa',
            'ver modificaciones'
        ]);

        $mesaDeEntradaRole->givePermissionTo([
            'crear normativa',
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
