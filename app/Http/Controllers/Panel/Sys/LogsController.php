<?php

namespace App\Http\Controllers\Panel\Sys;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use App\Sys_operation_logs;
use DB;

class LogsController extends Controller
{	
    public function lists()
    {
    	$result = Sys_operation_logs::select('user_id', 'user_name', 'opt_model', 'opt_detail', 'created_at')
                                    ->whereNull('deleted_at')
                                    ->orderBy('created_at', 'desc')
                                    ->paginate(Config::get('panel.paginate'));
   		return response(['code' => '0', 'msg' => 'success', 'data' => $result]);
    }
}
