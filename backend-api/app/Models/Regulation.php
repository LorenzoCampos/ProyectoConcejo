<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Regulation extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'number',
        'date',
        'state',
        'subject',
        'pdf_process',
        'pdf_approved',
        'fk_user_creator'
    ];

    public function userCreator()
    {
        return $this->belongsTo(User::class, 'fk_user_creator');
    }

    public function authors()
    {
        return $this->hasMany(Author::class, 'fk_regulation');
    }

    public function modifications()
    {
        return $this->hasMany(Modification::class, 'fk_regulation');
    }

    public function keyWords()
    {
        return $this->hasMany(KeyWord::class, 'fk_regulation');
    }

    public function interactions()
    {
        return $this->hasMany(RegulationInteraction::class, 'fk_regulation');
    }
}
