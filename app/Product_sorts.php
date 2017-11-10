<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product_sorts extends Model
{
    use SoftDeletes;
    
    protected $fillable = ['name'];

    protected   $table      = 'product_sorts';
    public      $timestamps = true;

    protected $dates = ['deleted_at'];
}
