<?php 

namespace App\Service;

use Log;
use Cache;
use Illuminate\Support\Facades\Config;
use App\Utils\Constants;
use App\Product_sorts;
use App\Products;
use App\Panel_operation;
use App\User;

/**
* 缓存服务。用来统一管理缓存
*/
class CacheService
{
	private $cache;

	public function __construct(Cache $cache)
	{
		$this->ceche = $cache;
	}
	
	/*
	* 获取产地列表Cache
	**/	
	public function getSortsCache()
	{
		$data = [];
		try {
			$data = Cache::get(Constants::CACHE_SORT_LISTS);
		} catch (\Throwable $e) {
			Log::error('Sorts_lists cache get faild:'.$e);
		}

		return $data;
	}

	/*
	* 设置产地列表Cache
	**/	
	public function setSortsCache($is_reload = false, $sortLists = [])
	{
		try {
			if ( $is_reload ) {
				$sortLists = Product_sorts::select('id', 'name')->get();
			}
			Cache::put(Constants::CACHE_SORT_LISTS, $sortLists, Config::get('panel.cacheTime'));
		} catch (\Throwable $e) {
			Log::error('Sorts_lists cache pust faild:'.$e);
		}
	}

	/*
	* 设置用户操作以及菜单列表Cache
	**/	
	public function setUserOperationAndMenu($user_id, $menu_ids = '', $operation_ids = '')
	{
		try {
			$operation_lists = $menus = $operation = [];
			// 获取权限列表
			$lists = Panel_operation::select('id', 'opt_route', 'opt_depict', 'fid', 'href', 'icon', 'menu_level')->orderBy('menu_level', 'ASC')->orderBy('order', 'ASC')->get();
			if( $user_id != 1 ){
				if ( ! empty($menu_ids) ) {
					$menu_ids = explode(',', $menu_ids);
				}

				if ( ! empty($operation_ids) ) {
					$operation_ids = explode(',', $operation_ids);
				}

				foreach ($lists as $item) {
					$operation_lists[$item->id] = $item;
				}
				//获取用户信息
				$user = User::find($user_id);

				// 根据用户菜单权限进行设置
				if ( ! empty($menu_ids) ) {
					foreach ($menu_ids as $item) {
						$children = [];
						$fid = $operation_lists[$item]->fid;
						if ( empty($menus[$fid]) ) {
							$menus[$fid]['opt_depict'] = $operation_lists[$fid]->opt_depict;
							$menus[$fid]['href'] = $operation_lists[$fid]->href;
							$menus[$fid]['icon'] = $operation_lists[$fid]->icon;
							$menus[$fid]['children'] = [];
						}

						$children['opt_depict'] = $operation_lists[$item]->opt_depict;
						$children['href'] = $operation_lists[$item]->href;
						$children['icon'] = $operation_lists[$item]->icon;
						$menus[$fid]['children'][] = $children;
					}
				}
			

				// 根据用户操作权限进行设置
				if( ! empty($operation_ids) ) {
					foreach ($operation_ids as $item) {
						$operation[] = $operation_lists[$item]->opt_route;
					}
				}

				unset($operation_ids, $menu_ids);
			} else {  // 若用户是超级管理员
				foreach ($lists as $item) {
					$children = [];
					if ( $item->menu_level == 0 ) {
						$menus[$item->id]['opt_depict'] = $item->opt_depict;
						$menus[$item->id]['href'] = $item->href;
						$menus[$item->id]['icon'] = $item->icon;
						$menus[$item->id]['children'] = [];
					} else if ( $item->menu_level == 1 ) {
						$children['opt_depict'] = $item->opt_depict;
						$children['href'] = $item->href;
						$children['icon'] = $item->icon;
						$menus[$item->fid]['children'][] = $children;
					} else {
						$operation[] = $item->opt_route;
					}
				}
			}

			unset($operation_lists, $user, $lists);

			// 重排KEY
			$menus = array_values($menus);
			Cache::put(Constants::CACHE_USER_MENUS . '_' . $user_id, $menus, Config::get('panel.cacheTime'));
			Cache::put(Constants::CACHE_USER_OPERATION . '_' . $user_id, $operation, Config::get('panel.cacheTime'));

			return array('menus' => $menus, 'operation' => $operation);
		} catch (\Throwable $e) {
			Log::error('Operation cache push faild:'.$e);
		}
	}

	/*
	* 获取用户操作权限cache
	**/	
	public function getUserOperation($user_id)
	{
		$data = [];
		try {
			$data = Cache::get(Constants::CACHE_USER_OPERATION . '_' . $user_id);
		} catch (\Throwable $e) {
			Log::error('user operation cache get faild:'.$e);
		}

		return $data;
	}

	/*
	* 获取用户菜单权限cache
	**/	
	public function getUserMenus($user_id)
	{
		$data = [];
		try {
			$data = Cache::get(Constants::CACHE_USER_MENUS . '_' . $user_id);
		} catch (\Throwable $e) {
			Log::error('user menus cache get faild:'.$e);
		}

		return $data;
	}
}