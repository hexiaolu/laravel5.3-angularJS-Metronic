<?php

namespace App\Http\Controllers\Panel\Product;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use App\Service\CacheService;
use App\Service\PublicService;
use App\Utils\Constants;
use App\Products;
use App\Shipment_records;
use App\Shipment_products;
use App\Sys_settings;
use Input;
use Auth;

class ShipmentController extends Controller
{
	private $cacheService;
    private $publicService;

    public function __construct(CacheService $cacheService, PublicService $publicService)
    {
        $this->cacheService = $cacheService;
        $this->publicService = $publicService;
    }

	public function lists()
	{
		$result = [];
        $flow_id = Input::input('flow_id');
        $start_at = Input::input('start_at') ? Input::input('start_at') . ' 00:00:00' : date('Y-m-01 00:00:00', strtotime("-3 month"));
        $end_at = Input::input('end_at') ? Input::input('end_at') . ' 23:59:59': date('Y-m-d H:i:s');

        if( $end_at < $start_at ) {
            return response(['code' => '-1', 'msg' => '结束时间不能小于开始时间！']);
        }

        $builder = Shipment_records::select('flow_id', 'total_price', 'id', 'opt_name', 'created_at', 'status', 'updated_at', 'customer_name')
                                    ->whereBetween('created_at', [$start_at, $end_at]);
        if ( ! empty($flow_id) ) {
            $builder->where('flow_id', 'LIKE', "%{$flow_id}%");
        }
        $result = $builder->orderBy('created_at', 'DESC')->paginate(Config::get('panel.paginate'));

        foreach ($result as $item) {
            $status_desc = '';
            switch ($item->status) {
                case Constants::SHIPMENT_WAIT_CONFIRM :
                   $status_desc = '未出库';
                   break;
                case Constants::SHIPMENT_CONFIRM :
                   $status_desc = '已出库';
                   break;
                case Constants::SHIPMENT_CANCEL :
                   $status_desc = '撤销出库';
                   break;
            }
            $item->status_desc = $status_desc;
            $item->total_price_rmb = $this->publicService->numToRmb($item->total_price);
        }

		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
	}

    public function shipmentProduct()
    {
        $res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
        do {
            $flow_id = Input::input('flow_id');
            $customer_name = Input::input('customer_name');
            $products_temp = Input::input('products');
            $user = Auth::user();

            if( empty($flow_id) ) {
                $res = ['code' => '00500', 'msg' => '请输入出库流水号！'];
                break;
            }

            if ( empty($products_temp) ) {
                $res = ['code' => '00501', 'msg' => '请选择产品且出库数量不能为0！'];
                break;  
            }

            $not_in_stock = [];
            foreach ($products_temp as $item) {
                if ($item['amount'] > $item['stock'] || $item['amount'] == 0 ) {
                    $not_in_stock[] = $item['name'];
                }
            }

            if ( ! empty($not_in_stock) ){
                $res = ['code' => '00502', 'data' => $not_in_stock];
                break;
            }

            $result = \DB::transaction(function() use($flow_id, $products_temp, $user, $customer_name){
                $total_price = 0;
                $insert_products = [];
                $shipment_records = Shipment_records::create([
                                'flow_id' => $flow_id,
                                'total_price' => 0,
                                'opt_name' => $user->name,
                                'customer_name' => $customer_name,
                                'opt_id' => $user->id,
                                'status' => Constants::SHIPMENT_WAIT_CONFIRM
                            ]);
                $record_id = $shipment_records->id;
                $created_at = date('Y-m-d H:i:s');
                foreach ($products_temp as $item) {
                    $temp = [];
                    $product_total_price = number_format($item['amount'] * $item['sales_price'], '5','.','');
                    $temp['record_id'] = $record_id;
                    $temp['product_id'] = $item['id'];
                    $temp['remark'] = $item['remark'];
                    $temp['amount'] = $item['amount'];
                    $temp['price'] = (float)$item['price'];
                    $temp['sales_price'] = (float)$item['sales_price'];
                    $temp['total_price'] = $product_total_price;
                    $temp['s_date'] = date('Y-m-d');
                    $temp['created_at'] = $created_at;
                    $temp['updated_at'] = $created_at;
                    $total_price += $product_total_price;
                    $insert_products[] = $temp;
                    // 冻结库存
                    Products::find($item['id'])->decrement('stock', $item['amount']);
                }

                $shipment_records->total_price = $total_price;
                $shipment_records->save();
                Shipment_products::insert($insert_products);
                unset($insert_products, $products_temp);
                return 'SUCCESS';
            });

            if($result == 'SUCCESS') {
                // 插入操作记录
                $this->publicService->sysOperationLog($user->id, $user->name, '出库管理', '进行出库，出库流水号：' . $flow_id);
                $res = ['code' => '0', 'msg' => '操作成功！'];
            } else {
                $res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
            }
        } while ( false );

        return response($res);
    }

    public function detail($id)
    {
        $result = Shipment_products::leftJoin('products as p', 'p.id', '=', 'shipment_products.product_id')
                                ->leftJoin('product_sorts as ps', 'ps.id', '=', 'p.sort_id')
                                ->select('p.name', 'p.p_unit', 'p.firm', 'p.number', 'p.standard', 'ps.name as sort', 'shipment_products.price', 
                                        'shipment_products.remark', 'shipment_products.sales_price', 'shipment_products.amount', 'shipment_products.total_price')
                                ->where('shipment_products.record_id', $id)
                                ->get();

        return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
    }

    public function confirm($id)
    {
        $res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
        do {
            if ( empty($id) ) {
                $res = ['code' => '-1', 'msg' => '服务器不想工作了~缺少id！'];
                break;
            }
            $records = Shipment_records::find($id);
            $records->status = Constants::SHIPMENT_CONFIRM;
            $records->save();
            // 插入操作记录
            $user = Auth::user();
            $this->publicService->sysOperationLog($user->id, $user->name, '出库管理', '确认出库，出库流水号：' . $records->flow_id);
            $res = ['code' => '0', 'msg' => '操作成功！'];
        } while ( false );

        return response($res);
    }

    public function cancel($id)
    {
        $res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
        do {
            if ( empty($id) ) {
                $res = ['code' => '-1', 'msg' => '服务器不想工作了~缺少id！'];
                break;
            }

            $products = Shipment_products::select('product_id', 'amount')
                                        ->where('record_id', $id)
                                        ->get();

            $result = \DB::transaction(function() use($id, $products){
                foreach ($products as $item) {
                    Products::find($item->product_id)->increment('stock', $item->amount);
                }
                Shipment_records::where('id', $id)->update(['status' => Constants::SHIPMENT_CANCEL]);
                unset($products);
                return 'SUCCESS';
            });

            if ( $result == 'SUCCESS' ) {
                // 插入操作记录
                $user = Auth::user();
                $records = Shipment_records::find($id);
                $this->publicService->sysOperationLog($user->id, $user->name, '出库管理', '撤销出库，出库流水号：' . $records->flow_id);
                $res = ['code' => '0', 'msg' => '操作成功！'];
            } else {
                $res = ['code' => '-1', 'msg' => '服务器不想工作了~操作失败！'];
            }
        } while ( false );

        return response($res);
    }

    public function getFlowId()
    {
        $res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
        do{ 
            // 获取系统设置
            $flow_id = '';
            $result = Sys_settings::first();
            if( ! empty($result) ) {
                $flow = date('Ymd');
                $flow .= substr(time(), -5, 5);
                $flow_id = $result->auto_shipment_flow == 'Y' ? 'CK'.$flow : '';
            }

            $res = ['code' => '0', 'data' => $flow_id];
        } while (false);

        return response($res);
    }
}
