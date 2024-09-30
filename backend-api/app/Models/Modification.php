<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modification extends Model
{
    use HasFactory;

    protected $fillable = [
        'fk_regulation',
        'date',
        'name_cell',
        'old_cell',
        'fk_old_user',
        'new_cell',
        'fk_new_user',
    ];

    protected $casts = [
        'date' => 'datetime:Y-m-d H:i:s',
    ];

    // Relación con Regulation
    public function regulation()
    {
        return $this->belongsTo(Regulation::class, 'fk_regulation');
    }

    // Relación con User (usuario anterior)
    public function oldUser()
    {
        return $this->belongsTo(User::class, 'fk_old_user');
    }

    // Relación con User (nuevo usuario)
    public function newUser()
    {
        return $this->belongsTo(User::class, 'fk_new_user');
    }
}
