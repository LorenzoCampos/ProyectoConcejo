<?php

namespace App\Services\Regulations;

use Illuminate\Support\Facades\Validator;
use App\Services\Regulations\BaseRegulation;

class Ordinance extends BaseRegulation
{
    public function validate(bool $isCreation = true)
    {
        $rules = [
            'type' => $isCreation ? 'required|string|in:ordinance' : '',
            'number' => 'nullable|integer', // Se genera automáticamente si no está presente
            'state' => $isCreation ? 'required|string|in:process,approved' : 'sometimes|string|in:process,approved',
            'subject' => $isCreation ? 'required|string|max:255' : 'sometimes|string|max:255',
            // debe recibir un pdf
            'pdf_process' => 'nullable|file',
            'pdf_approved' => 'nullable|file',
            'author_type' => $isCreation ? 'required|string|in:DEM,concejal' : 'sometimes|string|in:DEM,concejal',
            'authors' =>  $isCreation ? 'required|array|min:1' : 'sometimes|array|min:1', // Al menos un autor
            'authors.*' => 'required|string|max:255', // Cada autor debe ser un nombre válido
            'keywords' => 'nullable|array',
            'keywords.*' => 'required|string|max:255', // Cada palabra clave debe ser un nombre valido
        ];

        $validator = Validator::make($this->data, $rules);



        if ($validator->fails()) {
            return $validator->errors();
        }

        return null;
    }
}
