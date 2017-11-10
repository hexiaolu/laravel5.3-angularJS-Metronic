<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sys_settings extends Model
{
    protected $fillable = [
                        'auto_into_flow',
                        'auto_shipment_flow'
                    ];

    protected   $table      = 'sys_settings';
    public      $timestamps = false;
}
