angular.module('JxcAdminApp').controller('sysUserController', function($rootScope, $scope, $http, $timeout, $state, JxcService) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
        JxcService.get_jxc_configs();
    });

    var vm = $scope.vm = {};
	// 初始化设置
    vm.before_init = function(){
        vm.url_getLists = 'sys/user/lists';
    }

    // 初始化后调用加载权限列表
    vm.after_init = function(){
    	fnGetMenus();
    }

    // 初始化值
    vm.delete_id = '';
    vm.edit_id = '';
    vm.edit_opt = false;
    vm.menus = [];
    vm.operation = [];
	vm.optUser = [];

	// 初始化添加数据
	vm.optData = {
		name : '',
		user : '',
		password: ''
	}

    // 添加用户modal
    vm.addUserModal = function() {
    	// 重置 optData
        for (var i in vm.optData) {
            vm.optData[i] = '';
        };

    	$('.add_user_modal').modal('toggle');
    }

    // 添加用户 操作
    vm.addUserOpt = function() {
    	$http({
    		url: 'sys/user/create',
    		method: 'POST',
    		data: vm.optData
    	}).success(function(data){
    		var code = data.code;
    		switch( code ) {
    			case '66666':
    				$('.add_user_modal').modal('toggle');
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '88888' :
                    $('.add_user_modal').modal('toggle');
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
                case '0' :
                	$('.add_user_modal').modal('toggle');
                    JxcService.jxc_notific8('success', '用户管理', '操作成功!', 3000);
                    $scope.get_data();
                    break;
                default :
                    JxcService.jxc_notific8('danger', '用户管理', data.msg, 3000);
                    break;
    		}
    	}).error(function(){
    		vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
    	});
    }

    // 删除操作
    vm.deleteUserModal = function(id) {
        vm.delete_id = id;
        $('#delete_opt').modal('toggle');
    }

    // 提交删除
    vm.submitDelOpt = function(){
        $http({
            url:'sys/user/'+vm.delete_id+'/delete',
            method:'POST',
        }).success(function(data){
            var code = data.code;
            switch(code) {
                case '0':
                    $('#delete_opt').modal('toggle');
                    JxcService.jxc_notific8('success', '用户管理', '操作成功!', 3000);
                    $scope.get_data();
                    break;
                case '66666' :
                    $('#delete_opt').modal('toggle');
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '-1' :
                    $('#delete_opt').modal('toggle');
                    vm.error_msg = data.msg;
                    $('#message_opt').modal('toggle');
                    break;
                case '88888' :
                    $('#delete_opt').modal('toggle');
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
                default :
                    JxcService.jxc_notific8('danger', '用户管理', data.msg, 3000);
                    break;
            }
        }).error(function(data){
            $('.delete_opt').modal('toggle');
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }

    // 编辑用户
    vm.editUserModal = function($index){
    	// 清除选中
    	if( ! vm.edit_opt ) {
    		vm.edit_opt = true;
    		$timeout(function(){
				cleanChecked();
	    		vm.editUserModal($index);
    		}, 200);
    	} else {
    		vm.edit_opt = false;
	    	$('.edit_user_modal').modal('toggle');
	    	vm.optUser = vm.listsData[$index];
    		isChecked();
    	}
    }

    /*
    * 提交编辑操作
    **/
    vm.submitOptFunc = function(){
    	var submitMenuIds = [],
    		submitOperationIds = [];

    	for (var i in vm.menus) {
    		if( typeof vm.menus[i].children != 'undefined') {
	   			for( var c = 0; c < vm.menus[i].children.length; c++) {
					if ( vm.menus[i].children[c].ischecked ) {
						submitMenuIds.push(vm.menus[i].children[c].id);
					}
	   			}
	   		}
   		};

   		for (var i in vm.operation) {
    		if( typeof vm.operation[i].children != 'undefined') {
	   			for( var c = 0; c < vm.operation[i].children.length; c++) {
					if ( vm.operation[i].children[c].ischecked ) {
						submitOperationIds.push(vm.operation[i].children[c].id);
					}
	   			}
	   		}
   		};

   		if( vm.optUser.name == '' || vm.optUser.user == '' ) {
   			JxcService.jxc_notific8('danger', '用户管理', '用户名，登陆账号不能为空~', 3000);
   			return;
   		}

   		var optEditData = {
   				menu_ids : submitMenuIds,
   				operation_ids : submitOperationIds,
   				name : vm.optUser.name,
   				user : vm.optUser.user
   			};

   		$http({
            url:'sys/user/' + vm.optUser.id + '/edit',
            method:'POST',
            data: optEditData,
        }).success(function(data){
            var code = data.code;
            switch(code) {
                case '0':
                    $('.edit_user_modal').modal('toggle');
                    JxcService.jxc_notific8('success', '用户管理', '操作成功!', 3000);
                    $scope.get_data();
                    break;
                case '66666' :
                    $('.edit_user_modal').modal('toggle');
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '-1' :
                    vm.error_msg = data.msg;
                    $('#message_opt').modal('toggle');
                    break;
                case '88888' :
                    $('.edit_user_modal').modal('toggle');
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
                default :
                    JxcService.jxc_notific8('danger', '用户管理', data.msg, 3000);
                    break;
            }
        }).error(function(data){
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }

    var cleanChecked = function(){
    	for (var i in vm.menus) {
    		if( typeof vm.menus[i].children != 'undefined') {
	   			for( var c = 0; c < vm.menus[i].children.length; c++) {
					vm.menus[i].children[c].ischecked = false;
	   			}
	   		}
   		};

   		for (var i in vm.operation) {
    		if( typeof vm.operation[i].children != 'undefined') {
	   			for( var c = 0; c < vm.operation[i].children.length; c++) {
					vm.operation[i].children[c].ischecked = false;
	   			}
    		}
   		};
    }

   	var isChecked = function() {
   		for (var i in vm.menus) {
    		if( typeof vm.menus[i].children != 'undefined') {
	   			for( var c = 0; c < vm.menus[i].children.length; c++) {
	   				for (var a = 0; a < vm.optUser.menu_ids.length; a++) {
	   					if (vm.menus[i].children[c].id == vm.optUser.menu_ids[a] ) {
	   						vm.menus[i].children[c].ischecked = true;
	   						break;
	   					} else {
	   						vm.menus[i].children[c].ischecked = false;
	   					}
	   				};
	   			}
	   		}
   		};

   		for (var i in vm.operation) {
    		if( typeof vm.operation[i].children != 'undefined') {
	   			for( var c = 0; c < vm.operation[i].children.length; c++) {
	   				for (var a = 0; a < vm.optUser.operation_ids.length; a++) {
	   					if (vm.operation[i].children[c].id == vm.optUser.operation_ids[a] ) {
	   						vm.operation[i].children[c].ischecked = true;
	   						break;
	   					} else {
	   						vm.operation[i].children[c].ischecked = false;
	   					}
	   				};
	   			}
	   		}
   		};
   	}

   	/*
   	* 获取权限菜单列表
   	**/
   	var fnGetMenus = function(){
   		$http({
    		url: 'sys/user/getoperationandmenus',
    		method: 'GET'
    	}).success(function(data){
    		var code = data.code,
    			data = data.data;
    		switch( code ) {
    			case '66666':
    				$('.add_user_modal').modal('toggle');
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '0' :
                	vm.menus = data.menus;
                	vm.operation = data.operation;
                	break;
    		}
    	}).error(function(){
    		console.log('服务器不想工作了~^_^');
    	});
   	}
});