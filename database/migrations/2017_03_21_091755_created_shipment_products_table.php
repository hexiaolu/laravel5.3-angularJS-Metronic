<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatedShipmentProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipment_products', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('record_id'); // 产品名称 
            $table->integer('product_id'); // 产品名称 
            $table->integer('amount'); // 产品数量
            $table->decimal('price', 10, 2); // 产品成本价
            $table->decimal('total_price', 10, 2); // 总金额
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
