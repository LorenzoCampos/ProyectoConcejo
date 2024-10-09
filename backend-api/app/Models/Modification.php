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
        'fk_new_user'
    ];

    public function regulation()
    {
        return $this->belongsTo(Regulation::class, 'fk_regulation');
    }

    public function oldUser()
    {
        return $this->belongsTo(User::class, 'fk_old_user');
    }

    public function newUser()
    {
        return $this->belongsTo(User::class, 'fk_new_user');
    }
}
