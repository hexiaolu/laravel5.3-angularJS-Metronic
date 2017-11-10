<?php

namespace App\Http\Controllers\Panel\Sys;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use App\Sys_settings;
use Input;
use DB;

class SettingsController extends Controller
{	
    public function updateSettings()
    {
        $res = ['code' => '-1', 'msg' => '服务器不想工作了~^_^'];
        do {
            $data = [];
            $data['auto_into_flow'] = Input::input('auto_into_flow') ? 'Y' : 'N';
            $data['auto_shipment_flow'] = Input::input('auto_shipment_flow') ? 'Y' : 'N';

            DB::table('sys_settings')->update($data);
            $res = ['code' => '0', 'msg' => 'success'];
        } while (false);
        return response($res);
    }
}
