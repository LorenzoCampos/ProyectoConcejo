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
        'state',
        'subject',
        'author_type',
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

    /**
     * Regulaciones que esta regulación modifica.
     */
    public function regulationsModified()
    {
        return $this->belongsToMany(
            Regulation::class,
            'regulation_interactions',
            'fk_regulation',
            'fk_mod_regulation'
        );
    }

    /**
     * Regulaciones que modifican esta regulación.
     */
    public function regulationsThatModify()
    {
        return $this->belongsToMany(
            Regulation::class,
            'regulation_interactions',
            'fk_mod_regulation',
            'fk_regulation'
        );
    }
}
