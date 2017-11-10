<?php

namespace App;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Products extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
                        'name',
                        'number',
                        'standard',
                        'firm',
                        'sort_id',
                        'stock',
                        'price',
                        'status',
                        'p_unit',
                        'warn_stock'
                    ];

    protected   $table      = 'products';
    public      $timestamps = true;

    protected $dates = ['deleted_at'];
}
