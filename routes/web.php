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
// 登录接口，不需要判断登录状态。
Route::get('/login', ['as' => 'panel.login', 'uses' => function () {
	    return View('login');
	}]);
Route::post('guest/login', ['as' => 'guest.login' , 'uses' => 'Panel\GuestController@login']);

// 需要登录的接口
Route::group(['middleware' => 'panelVerify'], function(){
	Route::get('/', ['as' => 'panel.dashboard', 'uses' => function () {
	    return View::make('index');
	}]);

	Route::group(['namespace' => 'Panel'], function(){
		Route::group(['namespace' => 'Product', 'prefix' => 'product'], function(){
			// 厂商管理
			Route::post('firm/createoredit', ['as' => 'product.firm.createoredit', 'uses' => 'FirmController@createOrEdit']);
			Route::post('firm/{id}/delete', ['as' => 'product.firm.delete', 'uses' => 'FirmController@delete']);
			Route::get('firm/lists', ['as' => 'product.firm.lists', 'uses' => 'FirmController@lists']);

			// 厂商管理
			Route::post('sort/createoredit', ['as' => 'product.sort.createoredit', 'uses' => 'SortController@createOrEdit']);
			Route::post('sort/{id}/delete', ['as' => 'product.sort.delete', 'uses' => 'SortController@delete']);
			Route::get('sort/lists', ['as' => 'product.sort.lists', 'uses' => 'SortController@lists']);

			// 产品管理
			Route::post('product/createoredit', ['as' => 'product.product.createoredit', 'uses' => 'ProductController@createOrEdit']);
			Route::post('product/{id}/optenable', ['as' => 'product.product.optenable', 'uses' => 'ProductController@optenable']);
			Route::post('product/{id}/delete', ['as' => 'product.product.delete', 'uses' => 'ProductController@delete']);
			Route::get('product/lists', ['as' => 'product.product.lists', 'uses' => 'ProductController@lists']);
			Route::get('product/getFirmSort', ['as' => 'product.product.getfirmsort', 'uses' => 'ProductController@getFirmSort']);
			Route::get('product/warns', ['as' => 'product.product.warns', 'uses' => 'ProductController@warns']);

			// 入库管理
			Route::get('into/lists', ['as' => 'product.into.lists', 'uses' => 'IntoController@lists']);
			Route::get('into/products', ['as' => 'product.into.products', 'uses' => 'IntoController@products']);
			Route::get('into/{id}/detail', ['as' => 'product.into.detail', 'uses' => 'IntoController@detail']);
			Route::post('into/intoproduct', ['as' => 'product.into.intoproduct', 'uses' => 'IntoController@intoProduct']);
			Route::get('into/getflowid', ['as' => 'product.into.get.flow_id', 'uses' => 'IntoController@getFlowId']);

			// 出库管理
			Route::get('shipment/lists', ['as' => 'product.shipment.lists', 'uses' => 'ShipmentController@lists']);
			Route::post('shipment/shipmentproduct', ['as' => 'product.shipment.shipmentproduct', 'uses' => 'ShipmentController@shipmentProduct']);
			Route::get('shipment/{id}/detail', ['as' => 'product.shipment.detail', 'uses' => 'ShipmentController@detail']);
			Route::post('shipment/{id}/confirm', ['as' => 'product.shipment.confirm', 'uses' => 'ShipmentController@confirm']);
			Route::post('shipment/{id}/cancel', ['as' => 'product.shipment.cancel', 'uses' => 'ShipmentController@cancel']);
			Route::get('shipment/getflowid', ['as' => 'product.shipment.get.flow_id', 'uses' => 'ShipmentController@getFlowId']);

			// 库存预警
			Route::get('warn/lists', ['as' => 'product.warn.lists', 'uses' => 'WarnController@lists']);
		});

		Route::group(['namespace' => 'Sys', 'prefix' => 'sys'], function(){
			//用户管理
			Route::post('user/create', ['as' => 'sys.user.create', 'uses' => 'UserController@create']);
			Route::post('user/{id}/edit', ['as' => 'sys.user.edit', 'uses' => 'UserController@edit']);
			Route::post('user/{id}/delete', ['as' => 'sys.user.delete', 'uses' => 'UserController@delete']);
			Route::get('user/lists', ['as' => 'sys.user.lists', 'uses' => 'UserController@lists']);
			Route::get('user/getoperationandmenus', ['as' => 'sys.user.get.operation.menus', 'uses' => 'UserController@getOperationAndMenus']);
			Route::get('user/getjxcconfigs', ['as' => 'sys.user.get.jxc.configs', 'uses' => 'UserController@getJxcConfigs']);

			// 操作日志
			Route::get('logs/lists', ['as' => 'sys.logs.lists', 'uses' => 'LogsController@lists']);

			// 系统设置
			Route::post('settings/updatesettings', ['as' => 'settings.updatesettings', 'uses' => 'SettingsController@updateSettings']);
		});

		Route::group(['namespace' => 'Statistical', 'prefix' => 'statistical'], function(){
			Route::get('product/lists', ['as' => 'statistical.product.lists', 'uses' => 'ProductController@lists']);
			Route::get('sales/lists', ['as' => 'statistical.sales.lists', 'uses' => 'SalesController@lists']);

		});
	});
});


// // 测试api接口
// Route::post('sys/user/add', 'MasterController@sysAdd');
