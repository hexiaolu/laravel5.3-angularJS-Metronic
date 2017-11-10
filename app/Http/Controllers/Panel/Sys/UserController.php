<?php

namespace App\Http\Controllers\Panel\Sys;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use App\Service\CacheService;
use App\Service\PublicService;
use App\User;
use App\Panel_operation;
use App\Sys_settings;
use Input;
use Auth;
use Hash;
use Log;

class UserController extends Controller
{	
    private $cacheService;
	private $publicService;

	public function __construct(CacheService $cacheService, PublicService $publicService)
	{
        $this->cacheService = $cacheService;
		$this->publicService = $publicService;
	}

    public function create()
    {
    	$res = ['code' => '-1', 'msg' => '服务器不想工作了~'];
    	do {
    		$name = Input::input('name');
    		$user = Input::input('user');
    		$password = Input::input('password');

    		if( empty($name) || empty($user) || empty($password) ) {
    			$res = ['code' => '00110', 'msg' => '请填写完整信息~'];
    			break;
    		}
    		if ( strlen($password) < 5 || strlen($password) > 20) {
    			$res = ['code' => '00111', 'msg' => '请输入5-20位密码~'];
    			break;	
    		}

    		$count = User::where('user', $user)->count();
    		if ( $count > 0 ) {
    			$res = ['code' => '00112', 'msg' => '已存在相同账号~请勿重复添加！'];
    			break;
    		}

    		$password = Hash::make($password);
    		$result = User::create([
    					'name' => $name,
    					'user' => $user,
    					'password' => $password,
    					'menu_ids' => '',
    					'operation_ids' => ''
    				]);

            if ( ! empty($result) ) {
                // 插入操作记录
                $user = Auth::user();
                $this->publicService->sysOperationLog($user->id, $user->name, '用户管理', '创建用户：' . $name);
    			$res = ['code' => '0', 'msg' => '操作成功'];
            } else {
                $res = ['code' => '00113', 'msg' => '操作失败！'];
            }
    	} while ( false );

    	return response($res);
    }

    public function lists()
    {
    	$result = User::select('id', 'name', 'user', 'menu_ids', 'operation_ids')
    				  ->where('id', '<>', 1)
    				  ->paginate(Config::get('panel.paginate'));
    	foreach ($result as $item) {
    		$item->menu_ids = explode(',', $item->menu_ids);
    		$item->operation_ids = explode(',', $item->operation_ids);
    	}

   		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
    }

    public function delete($id)
    {
    	$res = ['code' => '-1', 'msg' => '服务器不想工作了~'];
    	do{
	    	$user = User::find($id);
			if ( empty($user) ) {
				$res = ['code' => '00120', 'msg' => '找不到该条记录！'];
				break;
			}

			$user->delete();
			if ( $user->trashed() ) {
                // 插入操作记录
                $opt_user = Auth::user();
                $this->publicService->sysOperationLog($opt_user->id, $opt_user->name, '用户管理', '删除用户，用户账号：' . $user->user);
	   			$res = ['code' => '0', 'msg' => '操作成功！'];
			} else {
	   			$res = ['code' => '00121', 'msg' => '操作失败！'];
			} 
    	} while ( false );

    	return response($res);
    }

    /*
    * 获取权限列表
    * $data = ['menus' => [], 'operation' => []]
    **/
    public function getOperationAndMenus()
    {
    	$menus_temp = $operation = $menus = [];
    	// 排除首页.
    	$results = Panel_operation::select('id', 'fid', 'opt_depict', 'menu_level')->where('id', '<>', 1)->orderBy('menu_level', 'ASC')->orderBy('order', 'ASC')->get();
    	foreach ($results as $item) {
    		switch ($item->menu_level) {
    			case '0' :
    				$menus_temp[$item->id]['opt_depict'] = $item->opt_depict;
    				break;
    			case '1' :
    				$menus_temp[$item->fid]['children'][] = ['id' => $item->id, 'opt_depict' => $item->opt_depict, 'ischecked' => false];
    				$operation[$item->id]['opt_depict'] = $item->opt_depict;
    				break;
    			default:
    				$operation[$item->fid]['children'][] = ['id' => $item->id, 'opt_depict' => $item->opt_depict, 'ischecked' => false];
    				break;
    		}
    	}

        foreach ($menus_temp as $item) {
            $menus[] = $item;
        }

    	$data = ['menus' => $menus, 'operation' => $operation];
    	return response(['code' => '0', 'data' => $data]);
    }

    /*
    * 修改用户
    **/
    public function edit($id)
    {
    	$res = ['code' => '-1', 'msg' => '服务器不想工作了~'];
    	do {
    		$menu_ids = Input::input('menu_ids');
    		$operation_temp = Input::input('operation_ids');
    		$user = Input::input('user');
    		$name = Input::input('name');

            if ( empty($user) || empty($name) ) {
                $res = ['code' => '00130', 'msg' => '用户名，登陆账号不能为空~'];
                break;
            }

            $count = User::where('user', $user)->where('id', '<>', $id)->count();
            if ( $count > 0 ) {
                $res = ['code' => '00131', 'msg' => '已存在相同账号~请勿重复添加！'];
                break;
            }

            $lists = Panel_operation::select('id', 'fid')->whereIn('id', $operation_temp)->orderBy('menu_level', 'ASC')->orderBy('order', 'ASC')->get();
            $operation_ids = [];
            foreach ($lists as $item) {
                if ( in_array($item->fid, $menu_ids) ) {
                    $operation_ids[] = $item->id;
                }
            }

            if ( ! empty($menu_ids) ) {
                $menu_ids = implode(',', $menu_ids);
            } else {
                $menu_ids = '';
            }
            if ( ! empty($operation_ids) ) {
                $operation_ids = implode(',', $operation_ids);
            } else {
                $operation_ids = '';
            }
    		$result = User::where('id', $id)->update([
    								'menu_ids' => $menu_ids,
    								'operation_ids' => $operation_ids,
    								'user' => $user,
    								'name' => $name
    							]);
    		if ( $result ) {
                // 写入缓存
    			$this->cacheService->setUserOperationAndMenu($id, $menu_ids, $operation_ids);
    			$res = ['code' => '0', 'msg' => '操作成功！'];
    		} else {
    			$res = ['code' => '00132', 'msg' => '操作失败！'];
    		}
    	} while ( false );

    	return response($res);
    }


    /*
    * 获取用户所属菜单
    **/
    public function getJxcConfigs()
    {
        $user = Auth::user();
        $data = [];
        $data['auto_into_flow'] = '';
        $data['auto_shipment_flow'] = '';
        $data['into_flow'] = '';
        $data['shipment_flow'] = '';
        // 獲取菜单列表
        $data['menus'] = $this->cacheService->getUserMenus($user->id);
        $operation = $this->cacheService->getUserOperation($user->id);
        if ( empty($data['menus']) ) {
            $result = $this->cacheService->setUserOperationAndMenu($user->id, $user->menu_ids, $user->operation_ids);
            $data['menus'] = $result['menus'];
            $operation = $result['operation'];
        }

        if ( in_array('settings.show_cost', $operation) ) {
            $data['show_cost'] = true;
        } else {
            $data['show_cost'] = false;
        }

        // 获取系统设置
        $result = Sys_settings::first();
        if( ! empty($result) ) {
            $data['auto_into_flow'] = $result->auto_into_flow;
            $data['auto_shipment_flow'] = $result->auto_shipment_flow;
        }
        return response(['code' => '0', 'data' => $data]);
    }
}
