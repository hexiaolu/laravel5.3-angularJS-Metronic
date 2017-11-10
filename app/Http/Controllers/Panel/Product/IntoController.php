<?php

namespace App\Http\Controllers\Panel\Product;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use App\Service\CacheService;
use App\Service\PublicService;
use App\Product_firms;
use App\Products;
use App\Into_records;
use App\Into_products;
use App\Sys_settings;
use Input;
use Auth;

class IntoController extends Controller
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

   		$builder = Into_records::select('flow_id', 'total_price', 'id', 'opt_name', 'created_at')
   								->whereBetween('created_at', [$start_at, $end_at]);
   		if ( ! empty($flow_id) ) {
   			$builder->where('flow_id', 'LIKE', "%{$flow_id}%");
   		}
   		$result = $builder->orderBy('created_at', 'DESC')->paginate(Config::get('panel.paginate'));

   		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
   	}


   	public function products()
   	{
        $input = Input::except('_token');
        $name = $input['name'];
        $number = $input['number'];
        $firm = $input['firm'];
        $sort_id = $input['sort_id'];

  		$builder = Products::leftJoin('product_sorts as ps', 'ps.id', '=', 'products.sort_id')
  							->select('products.id', 'products.firm', 'products.stock', 'products.name', 'products.number', 'products.standard', 'products.price', 'ps.name as sort')
  							->where('products.status', 'enable');

        if ( ! empty($name) ) {
            $builder->where('products.name', 'LIKE', "%{$name}%");
        }
        if ( ! empty($number) ) {
            $builder->where('products.number', 'LIKE', "%{$number}%");
        }
        if ( ! empty($firm) ) {
            $builder->where('products.firm', 'LIKE', "%{$firm}%");
        }
        if ( ! empty($sort_id) ) {
            $builder->where('products.sort_id', $sort_id);
        }

        $result = $builder->orderBy('products.created_at', 'DESC')->paginate(50);
      	if ( count($result) > 0 ) {
      		foreach ($result as $item) {
                $item->amount = 0;
                $item->sales_price = 0;
                $item->remark = '';
      		}
      	}

   		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
   	}

   	public function intoProduct()
   	{
   		$res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
   		do {
   			$flow_id = Input::input('flow_id');
   			$products_temp = Input::input('products');
   			$user = Auth::user();

   			if( empty($flow_id) ) {
   				$res = ['code' => '00400', 'msg' => '请输入入库流水号！'];
   				break;
   			}

   			if ( empty($products_temp) ) {
   				$res = ['code' => '00401', 'msg' => '请选择产品且入库数量不能为0！'];
   				break;	
   			}

   			$products = [];
   			foreach ($products_temp as $item) {
   				if ($item['amount'] > 0) {
   					$products[] = $item;
   				}
   			}

   			if ( empty($products) ) {
   				$res = ['code' => '00401', 'msg' => '请选择产品且入库数量不能为0！'];
   				break;	
   			}

   			$result = \DB::transaction(function() use($flow_id, $products, $user){
   				$total_price = 0;
      			$insert_products = [];
      			$into_records = Into_records::create([
      							'flow_id' => $flow_id,
      							'total_price' => 0,
      							'opt_name' => $user->name,
      							'opt_id' => $user->id
      						]);
      			$record_id = $into_records->id;
                $created_at = date('Y-m-d H:i:s');
      			foreach ($products as $item) {
      				$temp = [];
                    $product_total_price = number_format($item['amount'] * $item['price'], '5','.','');
      				$temp['record_id'] = $record_id;
      				$temp['product_id'] = $item['id'];
      				$temp['amount'] = $item['amount'];
      				$temp['price'] = (float)$item['price'];
                    $temp['total_price'] = $product_total_price;
                    $temp['s_date'] = date('Y-m-d');
                    $temp['created_at'] = $created_at;
      				$temp['updated_at'] = $created_at;
      				$total_price += $product_total_price;
      				$insert_products[] = $temp;
      				// Products::find($item['id'])->increment('stock', $item['amount']);
      				$product = Products::find($item['id']);
      				$product->price = $temp['price'];
      				$product->stock += $item['amount'];
      				$product->save();
      			}
      			$into_records->total_price = $total_price;
      			$into_records->save();
      			Into_products::insert($insert_products);
                unset($insert_products, $products);
      			return 'SUCCESS';
       		});

   			if($result == 'SUCCESS') {
                // 插入操作记录
                $this->publicService->sysOperationLog($user->id, $user->name, '入库管理', '进行入库，入库流水号：' . $flow_id);
   				$res = ['code' => '0', 'msg' => '操作成功！'];
   			} else {
                $res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
   			}
   		} while ( false );

   		return response($res);
   	}

   	public function detail($id)
   	{
   		$result = Into_products::leftJoin('products as p', 'p.id', '=', 'into_products.product_id')
   								->leftJoin('product_sorts as ps', 'ps.id', '=', 'p.sort_id')
   								->select('p.name', 'p.firm', 'p.number', 'p.standard', 'ps.name as sort', 'into_products.price', 'into_products.amount', 'into_products.total_price')
   								->where('into_products.record_id', $id)
   								->get();

   		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
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
                $flow_id = $result->auto_into_flow == 'Y' ? 'RK'.$flow : '';
            }

            $res = ['code' => '0', 'data' => $flow_id];
        } while (false);

        return response($res);
    }
}
