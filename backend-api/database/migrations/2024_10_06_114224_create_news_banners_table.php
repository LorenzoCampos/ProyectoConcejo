<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('news_banners', function (Blueprint $table) {
            $table->id();

            // Común para ambos
            $table->string('type'); // "new" o "banner"
            $table->string('image'); // URL o path de la imagen
            $table->boolean('status')->default(0); // Público (1) o no público (0)

            // Exclusivo para noticias
            $table->string('title')->nullable(); // Título para noticias
            $table->text('description')->nullable(); // Descripción para noticias

            // Fechas de publicación/despublicación (común para ambos)
            $table->timestamp('publication_date')->nullable(); // Fecha de publicación
            $table->timestamp('unpublication_date')->nullable(); // Fecha de despublicación

            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_banners');
    }
};
