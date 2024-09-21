<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'news_title',
        'news_date',
        'description',
        'img_path',
    ];

    protected $casts = [
        'news_date' => 'datetime:Y-m-d H:i:s',
    ];
}
