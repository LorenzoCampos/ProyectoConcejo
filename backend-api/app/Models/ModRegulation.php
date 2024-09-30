<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModRegulation extends Model
{
    use HasFactory;

    protected $fillable = [
        'fk_regulation',
        'rule',
        'fk_mod_regulation',
    ];

    // Relación con Regulation
    public function regulation()
    {
        return $this->belongsTo(Regulation::class, 'fk_regulation');
    }

    // Relación con sí mismo (modificación de regulación)
    public function modRegulation()
    {
        return $this->belongsTo(ModRegulation::class, 'fk_mod_regulation');
    }
}
