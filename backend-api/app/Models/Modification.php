<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Modification extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_modification';

    protected $fillable = [
        'id_regulation',
        'date',
        'name_cell',
        'old_cell',
        'old_user',
        'new_cell',
        'new_user',
    ];

    protected $casts = [
        'date' => 'datetime:Y-m-d H:i:s',
    ];

    public function regulation(): BelongsTo
    {
        return $this->belongsTo(Regulation::class, 'id');
    }

    public function oldUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'old_user');
    }

    public function newUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'new_user');
    }
}
