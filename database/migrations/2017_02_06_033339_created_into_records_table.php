<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatedIntoRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('into_records', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('flow_id', 64); // 产品编号
            $table->decimal('total_price', 10, 2); // 产品编号
            $table->integer('opt_id'); // 产品编号
            $table->string('opt_name', 64); // 产品编号
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
