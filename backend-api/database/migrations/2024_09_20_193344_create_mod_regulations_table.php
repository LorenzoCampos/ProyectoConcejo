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
        Schema::create('mod_regulations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fk_regulation')->constrained('regulations');
            $table->string('rule');
            $table->foreignId('fk_mod_regulation')->constrained('regulations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mod_regulations');
    }
};
