<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegulationInteraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'fk_regulation',
        'rule',
        'fk_mod_regulation'
    ];

    public function regulation()
    {
        return $this->belongsTo(Regulation::class, 'fk_regulation');
    }

    public function modRegulation()
    {
        return $this->belongsTo(RegulationInteraction::class, 'fk_mod_regulation');
    }
}
