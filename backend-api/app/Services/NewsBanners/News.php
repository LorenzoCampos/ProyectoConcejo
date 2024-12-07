<?php

namespace App\Services\NewsBanners;

use Illuminate\Support\Facades\Validator;

class News extends BaseNewBanner
{
    // Validación específica para noticias
    public function validate(bool $isCreation = true)
    {
        $rules = [
            'image' => $isCreation ? 'required|image|mimes:jpg,jpeg,png|max:2048' : 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
            'status' => $isCreation ? 'required|boolean' : 'sometimes|boolean',
            'title' => $isCreation ? 'required|string|max:510|min:10' : 'sometimes|string|max:510|min:10',
            'description' => $isCreation ? 'required|string|min:10' : 'sometimes|string|min:10',
            'publication_date' => 'nullable|date',
            'unpublication_date' => 'nullable|date|after_or_equal:publication_date',
        ];

        $validator = Validator::make($this->data, $rules);

        if ($validator->fails()) {
            return $validator->errors();
        }

        return null;
    }
}
