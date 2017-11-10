<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\User;
use Input;
use Auth;

class GuestController extends Controller
{
    public function login()
    {
    	$res = ['code' => '-1', 'msg' => '服务器不想工作了~'];
		do {
			$input = Input::except('_token');
			if ( empty($input['username']) || empty($input['password'])) {
				$res = ['code' => '00101', 'msg' => '请输入账号以及密码！'];
				break;
			}
			
			if ( Auth::attempt(['user' => $input['username'], 'password' => $input['password']])) {
				$res = ['code' => '0', 'msg' => 'success!'];
			} else {
				$res = ['code' => '00102', 'msg' => '账号或密码错误!'];
			}

		} while ( false );

		return response($res);
    }
}
