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
        Schema::create('regulations', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->integer('number');
            $table->string('state');
            $table->string('subject');
            $table->string('author_type');
            $table->string('pdf_process')->nullable();
            $table->string('pdf_approved')->nullable();
            $table->foreignId('fk_user_creator')->constrained('users'); // Relación con usuarios
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regulations');
    }
};
