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
        Schema::create('modifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fk_regulation')->constrained('regulations'); // Relación con regulations
            $table->date('date');
            $table->string('name_cell');
            $table->string('old_cell');
            $table->foreignId('fk_old_user')->constrained('users');
            $table->string('new_cell');
            $table->foreignId('fk_new_user')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modifications');
    }
};
