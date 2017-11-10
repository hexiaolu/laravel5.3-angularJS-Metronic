<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use SoftDeletes;
    
    protected $fillable = [
                        'name',
                        'password',
                        'user',
                        'menu_ids',
                        'operation_ids'
                    ];

    protected   $table      = 'user';
    public      $timestamps = true;

    protected $dates = ['deleted_at'];
}
