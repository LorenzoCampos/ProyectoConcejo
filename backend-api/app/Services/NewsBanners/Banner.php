<?php

namespace App\Services\NewsBanners;

use Illuminate\Support\Facades\Validator;

class Banner extends BaseNewBanner
{
    public function validate(bool $isCreation = true)
    {
        $rules = [
            'image' => $isCreation ? 'required|image|mimes:jpg,jpeg,png|max:2048' : 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
            'status' => $isCreation ? 'required|boolean' : 'sometimes|boolean',
            'publication_date' => 'nullable|date',
            'unpublication_date' => 'nullable|date|after_or_equal:publication_date',
        ];

        $validator = Validator::make($this->data, $rules);

        if ($validator->fails()) {
            return $validator->errors();
        }

        // Remover campos no válidos para banners
        $this->data['title'] = null;
        $this->data['description'] = null;

        return null;
    }
}
