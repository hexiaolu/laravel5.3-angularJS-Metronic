<?php

namespace App\Http\Controllers\Panel\Product;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use App\Products;

class WarnController extends Controller
{	
    public function lists()
    {
        $status = 'enable';
    	$result = Products::select('firm', 'name', 'number', 'stock', 'standard')
                            ->whereNull('deleted_at')
                            ->whereColumn('stock', '<=', 'warn_stock')
                            ->where('status', $status)
                            ->orderBy('created_at', 'DESC')
                            ->paginate(Config::get('panel.paginate'));
   		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
    }
}
