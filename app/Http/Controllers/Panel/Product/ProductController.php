<?php

namespace App\Http\Controllers\Panel\Product;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use App\Service\CacheService;
use App\Service\PublicService;
use App\Products;
use App\Shipment_records;
use App\Utils\Constants;
use Input;
use Auth;

class ProductController extends Controller
{
	private $cacheService;
	private $publicService;

	public function __construct(CacheService $cacheService, PublicService $publicService)
	{
		$this->cacheService = $cacheService;
		$this->publicService = $publicService;
	}

	public function createOrEdit()
   	{
   		$res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
		do {
			$input = Input::except('_token');
			$id = (int)$input['id'];
			unset($input['id']);

			if(empty($input['number']) || empty($input['name']) || empty($input['standard']) 
				|| empty($input['firm']) || empty($input['sort_id']) || empty($input['price']) || empty($input['warn_stock']) ) {
				$res = ['code' => '00301', 'msg' => '请填写完整信息！'];
				break;
			}

			$input['price'] = (float)$input['price'];
			$count = Products::where('number', $input['number']);
			if ( $id !== 0 ) {
				$count->where('id', '<>', $id);
			}
			$count = $count->count();
			if ( $count > 0 ) {
				$res = ['code' => '00302', 'msg' => '该编号已经存在产品，请检查后重新输入!'];
				break;
			}

			if ($id === 0) {
				$input['stock'] = 0;
				$result = Products::create($input);
				$id = $result->id;
				$opt_detail = "添加产品：" . $input['name'] . ',产品编号：' . $input['number'];
			} else {
				$opt_detail = "编辑产品,id=" . $id;
				$result = Products::where('id', $id)->update($input);
			}

			if ( ! empty($result) ) {
   				// 插入操作记录
                $user = Auth::user();
                $this->publicService->sysOperationLog($user->id, $user->name, '产品管理', $opt_detail);
				$res = ['code' => '0', 'msg' => '操作成功！', 'data' => $id];
			}
		} while ( false );

		return response($res);
   	}

   	public function lists()
   	{
		$input = Input::except('_token');
		$name = $input['name'];
		$number = $input['number'];
        $firm = $input['firm'];
		$sort_id = $input['sort_id'];

   		$builder = Products::join('product_sorts as ps', 'ps.id', '=', 'products.sort_id')
    						->select('products.*', 'ps.name as sort_text');
       					
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

   		$result = $builder->orderBy('products.created_at', 'DESC')->paginate(Config::get('panel.paginate'));
   		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
   	}

   	/*
   	* 产地列表
   	**/
   	public function getFirmSort()
   	{
   		$sorts = $this->publicService->getSortLists(true);
        $result = [];
        $result['sorts'] = $sorts;
   		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
   	}

   	/*
   	* 处理上架
   	*/
   	public function optenable($id)
   	{
   		$res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
   		do{
	   		$product = Products::find($id);
	   		if ( empty($product) ) {
	   			$res = ['code' => '00310', 'msg' => '找不到该条记录！'];
	   			break;
	   		}

	   		$product->status = 'enable';
	   		$product->save();
			// 插入操作记录
            $user = Auth::user();
            $this->publicService->sysOperationLog($user->id, $user->name, '产品管理', '上架产品：' . $product->name . ',产品编号：' . $product->number);
	   		$res = ['code' => '0', 'msg' => '操作成功！'];
   		} while (false);

   		return response($res);
   	}

   	/*
   	* 删除产品
   	*/
   	public function delete($id) 
   	{
   		$res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
   		do{
	   		$product = Products::find($id);
	   		if ( empty($product) ) {
	   			$res = ['code' => '00310', 'msg' => '找不到该条记录！'];
	   			break;
	   		}

	   		$product->delete();
			if ( $product->trashed() ) {
				$user = Auth::user();
            	$this->publicService->sysOperationLog($user->id, $user->name, '产品管理', '删除产品：' . $product->name . ',产品编号：' . $product->number);
	   			$res = ['code' => '0', 'msg' => '操作成功！'];
			} else {
	   			$res = ['code' => '00311', 'msg' => '操作失败！'];
			}   		
   		} while (false);

   		return response($res);
   	}

   	/*
   	* 首页获取预警数量
   	*/
   	public function warns()
   	{
   		$status = 'enable';
   		$builder = Products::select('name', 'stock')
   							->whereColumn('stock', '<=', 'warn_stock')
   							->where('status', $status)
   							->whereNull('deleted_at');
   		$product_count = $builder->count();
   		$product_warns = $builder->orderBy('created_at', 'DESC')->limit(20)->get();

   		$status = Constants::SHIPMENT_WAIT_CONFIRM;
   		$builder = Shipment_records::select('flow_id', 'total_price', 'opt_name', 'created_at')
   									->where('status', $status);
   		$shipment_count = $builder->count();
   		$shipment_records = $builder->limit(20)->get();

   		return response(['code' => '0', 'msg' => 'success', 'data' => compact('product_warns', 'shipment_records', 'product_count', 'shipment_count')]);
   	}
}
