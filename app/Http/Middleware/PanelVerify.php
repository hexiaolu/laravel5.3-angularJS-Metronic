<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Service\CacheService;

class PanelVerify
{
    private $cacheService;
    public function __construct(CacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    public function handle($request, Closure $next, $guard = null)
    {
        if (Auth::guard($guard)->guest()) {
            if ($request->ajax() || $request->wantsJson()) {
                $response = ['code' => '66666', 'msg' => '用户未登录，请先登录！'];
                return response($response);
            } else {
                return redirect()->route('panel.login');
            }
        } else {
            $opt_excepts = [
                            'product.product.getfirmsort',
                            'sys.user.get.jxc.configs',
                            'sys.user.get.operation',
                            'sys.user.get.operation.menus',
                            'product.into.products',
                            'product.product.warns',
                            'product.into.get.flow_id',
                            'product.shipment.get.flow_id'
                        ];
            $routeName = $request->route()->getName();
            if ( ! in_array($routeName, $opt_excepts) ) {
                if ($request->ajax() || $request->wantsJson() ) {
                    $user = Auth::user();
                    $operation = $this->cacheService->getUserOperation($user->id);
                    if ( empty($operation) ) {
                        $result = $this->cacheService->setUserOperationAndMenu($user->id, $user->menu_ids, $user->operation_ids);
                        $operation = $result['operation'];
                        unset($result);
                    }

                    if( ! in_array($routeName, $operation) ) {
                        unset($operation, $opt_excepts);
                        $response = ['code' => '88888', 'msg' => '您没有权限进行该操作，请联系管理员查询~^_^'];
                        return response($response);
                    }
                }
            }
        }
        return $next($request);
    }
}