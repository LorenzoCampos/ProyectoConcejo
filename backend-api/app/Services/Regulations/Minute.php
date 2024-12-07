<?php

namespace App\Services\Regulations;

use Illuminate\Support\Facades\Validator;

class Minute extends BaseRegulation
{
    public function validate()
    {
        $validator = Validator::make($this->data, [
            'type' => 'required|string|in:minute',
            'number' => 'nullable|integer', // Se genera automáticamente si no está presente
            'date' => 'required|date',
            'state' => 'required|string|in:process,approved',
            'subject' => 'required|string|max:255',
            'pdf_process' => 'nullable|string',
            'pdf_approved' => 'nullable|string',
            'author_type' => 'required|string|in:Concejal',
            'authors' => 'required|array|min:1', // Al menos un autor
            'authors.*' => 'required|string|max:255', // Cada autor debe ser un nombre válido
        ]);

        if ($validator->fails()) {
            return $validator->errors();
        }

        return null;
    }
}
