<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatedSysSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sys_settings', function(Blueprint $table)
        {
            $table->string('auto_into_flow', 4)->default('N'); // 自动入库流水号
            $table->string('auto_shipment_flow', 4)->default('N'); // 自动出库流水号
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
