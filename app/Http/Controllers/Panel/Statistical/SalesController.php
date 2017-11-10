<?php

namespace App\Http\Controllers\Panel\Statistical;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use App\Products;
use App\Shipment_products;
use Input;
use Auth;

class SalesController extends Controller
{	
    public function lists()
    {
    	$input = Input::except('_token');
		$start_at = Input::input('start_at') ? Input::input('start_at') : date('Y-m-01', strtotime("-1 months"));
   		$end_at = Input::input('end_at') ? Input::input('end_at'): date('Y-m-d');

        if( $end_at < $start_at ) {
            return response(['code' => '-1', 'msg' => '结束时间不能小于开始时间！']);
        }

        // 查询今日的销售业绩
        $today_date = date('Y-m-d');
        $today_res = Shipment_products::selectRaw("SUM(amount * price) AS total_cost, SUM(total_price) AS total_price")
                                            ->where('s_date', $today_date)
                                            ->first();
        if ( ! $today_res->total_cost ) {
            $today_res->total_cost = 0;
        }
        if ( ! $today_res->total_price ) {
            $today_res->total_price = 0;
        }
        // 根据日期查询销售业绩
        $total_res = Shipment_products::selectRaw('SUM(amount * price) AS total_cost, SUM(total_price) AS total_price')
                                        ->whereBetween('created_at', [$start_at . ' 00:00:00', $end_at . ' 23:59:59'])
                                        ->first();
        if ( ! $total_res->total_cost ) {
            $total_res->total_cost = 0;
        }
        if ( ! $total_res->total_price ) {
            $total_res->total_price = 0;
        }                           

        $lists = Shipment_products::selectRaw('SUM(amount * price) AS total_cost, SUM(total_price) AS total_price, s_date')
                                    ->whereBetween('created_at', [$start_at . ' 00:00:00', $end_at . ' 23:59:59'])
                                    ->orderBy('s_date', 'DESC')
                                    ->groupBy('s_date')
                                    ->paginate(20);
        $result = [];
        $result['today'] = $today_date;
        $result['total_date'] = $start_at . ' - ' . $end_at;
        $result['today_res'] = $today_res;
        $result['total_res'] = $total_res;

   		return response(['code' => '0', 'msg' => 'success', 'data' => $lists, 'statistical' => $result]);
    }
}
