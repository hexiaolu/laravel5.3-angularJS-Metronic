<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\User;
use Input;
use Auth;

class GuestController extends Controller
{
	public function createUser()
    {
		$res = ['code' => '00100', 'msg' => 'faily'];
    	do {
	    	$user = Input::input('user');
	    	$name = Input::input('name');
	    	$password = Input::input('password');
	    	if ( empty($user) || empty($name) || empty($password) ) {
	    		$res = ['code' => '00101', 'msg' => '账号或姓名或密码为空，请填写完整！'];
				break;
	    	}

	    	$password = bcrypt($password);
	    	User::create([
	    				'user' => $user,
	    				'name' => $name,
	    				'password' => $password
	    			]);

	   		$res = ['code' => '00102', 'msg' => '添加成功！'];
    	} while ( false );

    	return response($res);
    }
    
    public function login()
    {
    	$res = ['code' => '00110', 'msg' => 'faily'];
		do {
			$input = Input::except('_token');
			if ( empty($input['username']) || empty($input['password'])) {
				$res = ['code' => '00110', 'msg' => 'faily, fill on the info!'];
				break;
			}
			
			if ( Auth::attempt(['user' => $input['username'], 'password' => $input['password']])) {
				$user = Auth::user();
				$res = ['code' => '00111', 'msg' => 'success!', 'data' => $user];
			} else {
				$res = ['code' => '00112', 'msg' => '账号或密码错误!'];
			}

		} while ( false );

		return response($res);
    }
}
