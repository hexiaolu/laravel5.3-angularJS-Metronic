<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/
/* 不用判断用户登录情况 */
// Route::get('login', function () {
//     return view('panel.login');
// });

// // 登录接口
// Route::post('guest/login', 'Panel\GuestController@login');

// /* 需要登录的接口 */
// Route::group(['middleware' => ['panelVerify']], function() {
//     Route::get('/', 'MasterController@getIndex');
// });



Route::get('/', function () {
    return View::make('index');
});

// 测试api接口
Route::post('sys/user/add', 'MasterController@sysAdd');
