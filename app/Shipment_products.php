<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shipment_products extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
                        'id',
                        'record_id',
                        'product_id',
                        'amount',
                        'price',
                        'total_price',
                        's_date',
                        'remark'
                    ];

    protected   $table      = 'shipment_products';
    public      $timestamps = true;

    protected $dates = ['deleted_at'];
}
