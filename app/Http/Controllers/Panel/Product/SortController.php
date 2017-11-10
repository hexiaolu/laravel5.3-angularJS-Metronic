<?php

namespace App\Http\Controllers\Panel\Product;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use App\Service\CacheService;
use App\Service\PublicService;
use App\Product_sorts;
use App\Products;
use Input;
use Auth;

class SortController extends Controller
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

			if(empty($input['name'])) {
				$res = ['code' => '00201', 'msg' => '请填写完整信息！'];
				break;
			}

			$count = Product_sorts::where('name', $input['name']);
			if ( $id !== 0 ) {
				$count->where('id', '<>', $id);
			}
			$count = $count->count();
			if ( $count > 0 ) {
				$res = ['code' => '00202', 'msg' => '分类名称已经存在，请重新输入!'];
				break;
			}

			if ($id === 0) {
				$result = Product_sorts::create($input);
				$id = $result->id;
				$opt_detail = '新增分类:' . $input['name'];
			} else {
				$result = Product_sorts::where('id', $id)->update($input);
				$opt_detail = '编辑分类id:' . $id;
			}
			
			if ( ! empty($result) ) {
				// 重置缓存
   				$this->cacheService->setSortsCache();
   				// 插入操作记录
   				$user = Auth::user();
   				$this->publicService->sysOperationLog($user->id, $user->name, '分类管理', $opt_detail);
				$res = ['code' => '0', 'msg' => '操作成功！', 'data' => $id];
			}
		} while ( false );

		return response($res);
   	}

   	public function lists()
   	{
   		$result = $this->publicService->getSortLists();
   		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
   	}

   	/*
   	* 删除操作
   	*/
   	public function delete($id) 
   	{
   		$res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
		do {
			$sort = Product_sorts::find($id);
			if ( empty($sort) ) {
				$res = ['code' => '00210', 'msg' => '找不到该条记录！'];
				break;
			}

			$results = Products::where('sort_id', $id)->select('id')->get();
			$productIds = array_pluck($results, 'id');
			if ( !empty($productIds) ) {
				$res = ['code' => '00211', 'msg' => '请先删除绑定该分类的所有产品！'];
				break;
			}

			$sort->delete();
			if ( $sort->trashed() ) {
				// 重置缓存
   				$this->cacheService->setSortsCache(true);
   				// 插入操作记录
   				$user = Auth::user();
   				$this->publicService->sysOperationLog($user->id, $user->name, '分类管理', '删除分类：' . $sort->name);
	   			$res = ['code' => '0', 'msg' => '操作成功！'];
			} else {
	   			$res = ['code' => '00212', 'msg' => '操作失败！'];
			}   					
		} while ( false );

		return response($res);
   	}
}
