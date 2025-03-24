<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'pdf_path',
        'date_creation'
    ];
}
