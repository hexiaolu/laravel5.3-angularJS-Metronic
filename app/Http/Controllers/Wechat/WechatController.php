<?php

namespace App\Http\Controllers\Wechat;

use App\Http\Controllers\Controller;
use App\User;
use Input;
use Auth;

class WechatController extends Controller
{
    public function test()
    {
    	$res = ['code' => '-1', 'msg' => '服务器不想工作了~'];
		do {
			$res = ['code' => '00101', 'msg' => '请输入账号以及密码！'];
		} while ( false );

		return response($res);
    } 
}
