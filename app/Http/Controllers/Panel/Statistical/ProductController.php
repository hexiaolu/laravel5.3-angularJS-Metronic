<?php

namespace App\Http\Controllers\Panel\Statistical;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use App\Products;
use App\Into_products;
use App\Shipment_products;
use Input;
use Auth;

class ProductController extends Controller
{	
    public function lists()
    {
    	$input = Input::except('_token');
		$name = $input['name'];
		$number = $input['number'];
        $firm = $input['firm'];
        $sort_id = $input['sort_id'];
		$type = Input::get('type', 'into');
		$start_at = Input::input('start_at') ? Input::input('start_at') . ' 00:00:00' : date('Y-m-01 00:00:00', strtotime("-3 month"));
   		$end_at = Input::input('end_at') ? Input::input('end_at') . ' 23:59:59': date('Y-m-d H:i:s');
		$status = 'enable';

        if( $end_at < $start_at ) {
            return response(['code' => '-1', 'msg' => '结束时间不能小于开始时间！']);
        }

        if ( $type == 'into' ) {
            $builder = Into_products::selectRaw('p.standard, p.name, p.number, p.firm, ps.name AS sort, 
                                        SUM(into_products.amount) AS total_amount, SUM(into_products.total_price) AS total_price')
                                    ->leftJoin('products AS p', 'p.id', '=', 'into_products.product_id')
                                    ->leftJoin('product_sorts AS ps', 'ps.id', '=', 'p.sort_id')
                                    ->whereBetween('into_products.created_at', [$start_at, $end_at]);
        } else {
            $builder = Shipment_products::selectRaw('p.standard, p.name, p.number, p.firm, ps.name AS sort, 
                                        SUM(shipment_products.amount) AS total_amount, SUM(shipment_products.total_price) AS total_price')
                                        ->leftJoin('products AS p', 'p.id', '=', 'shipment_products.product_id')
                                        ->leftJoin('product_sorts AS ps', 'ps.id', '=', 'p.sort_id')
                                        ->whereBetween('shipment_products.created_at', [$start_at, $end_at]);
        }


		$builder->whereNull('p.deleted_at')->where('p.status', $status);

		if ( ! empty($name) ) {
   			$builder->where('p.name', 'LIKE', "%{$name}%");
   		}
   		if ( ! empty($number) ) {
   			$builder->where('p.number', 'LIKE', "%{$number}%");
   		}
		if ( ! empty($firm) ) {
   			$builder->where('p.firm', 'LIKE', "%{$firm}%");
   		}
        if ( ! empty($sort_id) ) {
            $builder->where('p.sort_id', $sort_id);
        }

   		$result = $builder->groupBy('p.id')->paginate(50);

   		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
    }
}
