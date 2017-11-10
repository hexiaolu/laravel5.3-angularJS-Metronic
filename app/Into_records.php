<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Into_records extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
                        'id',
                        'flow_id',
                        'total_price',
                        'opt_id',
                        'opt_name'
                    ];

    protected   $table      = 'into_records';
    public      $timestamps = true;

    protected $dates = ['deleted_at'];
}
