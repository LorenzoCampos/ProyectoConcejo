<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsBanner extends Model
{
    use HasFactory;

    // Nombre de la tabla (opcional si sigue la convención de nombres)
    protected $table = 'news_banners';

    // Permitir asignación masiva en los siguientes campos
    protected $fillable = [
        'type',               // Tipo de registro (new o banner)
        'title',              // Título (solo para noticias)
        'description',        // Descripción (solo para noticias)
        'image',              // Imagen común para ambos
        'status',             // Estado (público o no público)
        'publication_date',   // Fecha de publicación
        'unpublication_date', // Fecha de despublicación
        'created_at',         // Fecha de creación (opcional si quieres manejar manualmente)
    ];

    // Reglas o Scopes personalizados (Opcional)
    public function scopePublished($query)
    {
        return $query->where('status', 1)
            ->where('publication_date', '<=', now())
            ->where(function ($query) {
                $query->whereNull('unpublication_date')
                    ->orWhere('unpublication_date', '>', now());
            });
    }

    // Accesor para comprobar si es noticia
    public function isNews()
    {
        return $this->type === 'new';
    }

    // Accesor para comprobar si es banner
    public function isBanner()
    {
        return $this->type === 'banner';
    }
}
