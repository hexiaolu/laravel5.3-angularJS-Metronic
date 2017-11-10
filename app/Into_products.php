<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Into_products extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
                        'id',
                        'record_id',
                        'product_id',
                        'amount',
                        'price',
                        's_date',
                        'total_price'
                    ];

    protected   $table      = 'into_products';
    public      $timestamps = true;

    protected $dates = ['deleted_at'];
}
