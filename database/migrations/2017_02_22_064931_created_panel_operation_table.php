<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatedPanelOperationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('panel_operation', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('opt_route', '32');
            $table->string('opt_depict', '32');
            $table->integer('fid');
            $table->string('href', '32');
            $table->integer('menu_level');
            $table->string('is_show', '32');
            $table->timestamps(); // created_at
            $table->softDeletes(); // deleted_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
