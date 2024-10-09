<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KeyWord extends Model
{
    use HasFactory;

    protected $fillable = [
        'fk_regulation',
        'word'
    ];

    public function regulation()
    {
        return $this->belongsTo(Regulation::class, 'fk_regulation');
    }
}
