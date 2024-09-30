<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModRegulationsTable extends Migration
{
    public function up()
    {
        Schema::create('mod_regulations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fk_regulation')->constrained('regulations')->onDelete('restrict');
            $table->string('rule');
            $table->foreignId('fk_mod_regulation')->constrained('mod_regulations')->onDelete('restrict');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('mod_regulations');
    }
}
