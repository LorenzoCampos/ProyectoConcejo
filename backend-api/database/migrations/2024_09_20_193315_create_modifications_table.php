<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModificationsTable extends Migration
{
    public function up()
    {
        Schema::create('modifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fk_regulation')->constrained('regulations')->onDelete('restrict');
            $table->date('date');
            $table->string('name_cell');
            $table->string('old_cell');
            $table->foreignId('fk_old_user')->constrained('users')->onDelete('restrict');
            $table->string('new_cell');
            $table->foreignId('fk_new_user')->constrained('users')->onDelete('restrict');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('modifications');
    }
}
