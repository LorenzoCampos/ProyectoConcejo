<?php

namespace App\Services\Regulations;

use Illuminate\Support\Facades\Validator;

class Decree extends BaseRegulation
{
    public function validate(bool $isCreation = true)
    {
        $rules = [
            'type' => $isCreation ? 'required|string|in:decree' : 'sometimes|string|in:decree',
            'number' => 'nullable|integer',
            'state' => $isCreation ? 'required|string|in:process,approved' : 'sometimes|string|in:process,approved',
            'subject' => $isCreation ? 'required|string|max:255' : 'sometimes|string|max:255',
            'pdf_process' => 'nullable|string|file',
            'pdf_approved' => 'nullable|string|file',
            'modifies' => 'nullable|array',
            'modifies.*' => 'nullable|integer|max:255',
            'modified_by' => 'nullable|array',
            'modified_by.*' => 'nullable|integer|max:255',
            'author_type' => $isCreation ? 'required|string|in:concejal' : 'sometimes|string|in:concejal',
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
}
