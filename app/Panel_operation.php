<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Panel_operation extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
                        'opt_route',
                        'opt_depict',
                        'fid',
                        'href',
                        'icon',
                        'menu_level'
                    ];

    protected   $table      = 'panel_operation';
    public      $timestamps = false;

    protected $dates = ['deleted_at'];
}
