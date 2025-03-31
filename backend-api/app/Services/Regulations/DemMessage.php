<?php

namespace App\Services\Regulations;

use Illuminate\Support\Facades\Validator;

class DemMessage extends BaseRegulation
{
    public function validate(bool $isCreation = true)
    {
        $rules = [
            'type' => $isCreation ? 'required|string|in:dem-message' : 'sometimes|string|in:dem-message',
            'number' => 'nullable|integer',
            'creation_date' => 'nullable|date_format:Y-m-d',
            'state' => $isCreation ? 'required|string|in:process,approved' : 'sometimes|string|in:process,approved',
            'subject' => $isCreation ? 'required|string|max:255' : 'sometimes|string|max:255',
            'author_type' => $isCreation ? 'required|string|in:DEM,particular' : 'sometimes|string|in:DEM,particular',
            'authors' => $isCreation ? 'required|array|min:1' : 'sometimes|array|min:1',
            'authors.*' => 'required|string|max:255',
            'keywords' => 'nullable|array',
            'keywords.*' => 'nullable|string|max:255',
        ];

        $validator = Validator::make($this->data, $rules);
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
            'type', 'number', 'state', 'subject', 'fk_user_creator', 'author_type', 'authors', 'keywords'
        ]));
    }
}
