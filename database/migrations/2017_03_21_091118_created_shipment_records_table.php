<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatedShipmentRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipment_records', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('flow_id', 64); // 流水号
            $table->decimal('total_price', 10, 2); // 总金额
            $table->integer('opt_id'); // 操作人id
            $table->string('opt_name', 64); // 操作人名称
            $table->string('status', 32); // 状态
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
