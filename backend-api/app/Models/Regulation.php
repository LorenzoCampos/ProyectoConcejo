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
        'fk_user_creator',
    ];

    protected $casts = [
        'date' => 'datetime:Y-m-d H:i:s',
    ];

    // Relación con User (creador de la regulación)
    public function creator()
    {
        return $this->belongsTo(User::class, 'fk_user_creator');
    }

    // Relación con Modifications
    public function modifications()
    {
        return $this->hasMany(Modification::class, 'fk_regulation');
    }

    // Relación con ModRegulations
    public function modRegulations()
    {
        return $this->hasMany(ModRegulation::class, 'fk_regulation');
    }

    // Relación con Authors
    public function authors()
    {
        return $this->hasMany(Author::class, 'fk_regulation');
    }
}
