<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatedSysOperationLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sys_operation_logs', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('user_id'); // 操作人id
            $table->string('user_name', 64); // 操作人
            $table->string('opt_model', 16); // 操作model
            $table->text('opt_detail'); // 操作详情
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
