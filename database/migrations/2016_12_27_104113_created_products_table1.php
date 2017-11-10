<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatedProductsTable1 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('name', 64); // 产品名称
            $table->string('number', 32); // 产品编号
            $table->string('standard', 16); // 产品规格
            $table->string('firm', 64); // 产地id
            $table->decimal('price', 10, 2); // 产品成本价
            $table->integer('stock'); // 产品库存
            $table->integer('warn_stock'); // 产品预警库存
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
