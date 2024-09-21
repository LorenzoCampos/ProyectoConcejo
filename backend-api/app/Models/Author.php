<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    use HasFactory;

    protected $fillable = [
        'fk_regulation',
        'type',
        'name',
        'fk_user',
    ];

    // Relación con Regulation
    public function regulation()
    {
        return $this->belongsTo(Regulation::class, 'fk_regulation');
    }

    // Relación con User (usuario autor)
    public function user()
    {
        return $this->belongsTo(User::class, 'fk_user');
    }
}
