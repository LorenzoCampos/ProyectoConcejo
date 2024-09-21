<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Regulation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'number',
        'date',
        'state',
        'subject',
        'pdf_path',
        'user_creator',
    ];

    protected $casts = [
        'date' => 'datetime:Y-m-d H:i:s',
        'number' => 'integer',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'fk_user_creator');
    }
}
