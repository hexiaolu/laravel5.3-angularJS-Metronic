<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Auth;
use Input;

class MasterController extends Controller
{
	public function getIndex()
	{
		return view('panel.dashboard');
	}

	/*
	* 测试接口
 	**/
 	public function sysAdd()
 	{
 		return response(['code' => '0', 'msg' => 'success']);
 	}
}