<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sys_operation_logs extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
                        'id',
                        'user_id',
                        'user_name',
                        'opt_model',
                        'opt_detail'
                    ];

    protected   $table      = 'sys_operation_logs';
    public      $timestamps = true;

    protected $dates = ['deleted_at'];
}
