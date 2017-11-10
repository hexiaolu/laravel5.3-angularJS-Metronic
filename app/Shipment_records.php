<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shipment_records extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
                        'id',
                        'flow_id',
                        'customer_name',
                        'total_price',
                        'opt_id',
                        'opt_name',
                        'status'
                    ];

    protected   $table      = 'shipment_records';
    public      $timestamps = true;

    protected $dates = ['deleted_at'];
}
