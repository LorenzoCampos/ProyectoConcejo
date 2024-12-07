<?php

namespace App\Services\Regulations;

use Illuminate\Support\Facades\Validator;

class Correspondence extends BaseRegulation
{
    public function validate()
    {
        $validator = Validator::make($this->data, [
            'type' => 'required|string|in:correspondence',
            'number' => 'nullable|integer', // Se genera automáticamente si no está presente
            'state' => 'required|string|in:process,approved',
            'subject' => 'required|string|max:255',
            'author_type' => 'required|string|in:DEM,Particular',
            'authors' => 'required|array|min:1', // Al menos un autor
            'authors.*' => 'required|string|max:255', // Cada autor debe ser un nombre válido
        ]);

        if ($validator->fails()) {
            return $validator->errors();
        }

        return null;
    }

    /**
     * Devuelve los datos listos para guardar en la base de datos,
     * eliminando los campos no permitidos en correspondencia.
     */
    public function getData(): array
    {
        return array_intersect_key($this->data, array_flip([
            'type', 'number', 'state', 'subject', 'author_type', 'authors'
        ]));
    }
}
