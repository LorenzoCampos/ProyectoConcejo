<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mod_regulation extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    protected $fillable = [
        'fk_regulation',
        'rule',
        'fk_mod_regulation',
    ];

    public function regulation(): BelongsTo
    {
        return $this->belongsTo(Regulation::class, 'fk_regulation');
    }

    public function modRegulation(): BelongsTo
    {
        return $this->belongsTo(Regulation::class, 'mod_regulation');
    }
}
