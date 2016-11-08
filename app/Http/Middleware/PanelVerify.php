<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class PanelVerify
{
    public function handle($request, Closure $next, $guard = null)
    {
        if (Auth::guard($guard)->guest()) {
            if ($request->ajax() || $request->wantsJson()) {
            	$response = ['code' => 1, 'msg' => '用户未登录，请先登录！'];
                return response($response);
            } else {
                return redirect()->guest('login');
            }
        }

        return $next($request);
    }
}