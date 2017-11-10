<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatedSysMenusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sys_menus', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('title', 16); // 菜单名称
            $table->integer('fid'); // 父级id
            $table->string('href', 128); // 跳转地址
            $table->string('icon', 16); // 图标
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
