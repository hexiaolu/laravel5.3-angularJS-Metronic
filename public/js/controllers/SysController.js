angular.module('JxcAdminApp').controller('sysUserController', function($rootScope, $scope, $http, $timeout, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
        $scope.edit_opt = false;
        // 发起http 请求后台。
	    $scope.all_users = [
	    	{
	    		'name' : '何小录',
	    		'user' : 'hexiaolu',
	    		'id' : '1111',
	    		'authority_ids' : [1,32,31]
	    	}, {
	    		'name' : '何小录11111111',
	    		'user' : 'hexiaolu111111111',
	    		'id' : '222',
	    		'authority_ids' : [1,12,33]
	    	}
	    ];

	    // 测试使用菜单
	    $scope.menus = [
				{
					"name" : '系统管理',
					"children" : [
						{
							"name" : '用户管理',
							"id" : '1',
							"isChecked" : false
						},{
							"name" : '系统设置',
							"id" : '2',
							"isChecked" : false
						}
					]
				},{
					"name" : '测试菜单',
					"children" : [
						{
							"name" : '测试子菜单1',
							"id" : '12',
							"isChecked" : false
						},{
							"name" : '测试子菜单2',
							"id" : '21',
							"isChecked" : false
						},{
							"name" : '测试子菜单3',
							"id" : '23',
							"isChecked" : false
						},{
							"name" : '测试子菜单4',
							"id" : '24',
							"isChecked" : false
						},{
							"name" : '测试子菜单5',
							"id" : '25',
							"isChecked" : false
						}
					]
				},{
					"name" : '测试管理',
					"children" : [
						{
							"name" : '测试子菜单1',
							"id" : '31',
							"isChecked" : false
						},{
							"name" : '测试子菜单2',
							"id" : '32',
							"isChecked" : false
						},{
							"name" : '测试子菜单3',
							"id" : '33',
							"isChecked" : false
						},{
							"name" : '测试子菜单4',
							"id" : '34',
							"isChecked" : false
						},{
							"name" : '测试子菜单5',
							"id" : '35',
							"isChecked" : false
						}
					]
				}
			];
    });
	

    // 添加用户modal
    $scope.addUserFunc = function() {
    	$('.add_user_modal').modal('toggle');
    }

    // 添加用户 操作
    $scope.addUserOpt = function() {
    	var data = $('.sys-add-user').serializeArray();
    	$http({
    		url: '/sys/user/add',
    		method: 'POST',
    		data: data
    	}).success(function(res){
    		var new_user = {};
    		for(var i = 0; i < data.length; i++) {
    			new_user[data[i].name] = data[i ].value;
    		}
    		$scope.all_users.push(new_user);
    		$('.add_user_modal').modal('toggle');
    	}).error(function(){
    		alert('服务器出错！');
    	});
    }

    // 编辑用户modal
    $scope.editUserFunc = function($index) {
    	if( ! $scope.edit_opt ) {
    		$scope.edit_opt = true;
    		$timeout(function(){
	    		$scope.editUserFunc($index);
    		}, 200);
    	} else {
	    	$scope.user = $scope.all_users[$index];
    		isChecked();
	    	$('.edit_user_modal').modal('toggle');
    	}
    }

   	var isChecked = function() {
   		for (var i in $scope.menus) {
   			for( var c = 0; c < $scope.menus[i].children.length; c++) {
   				for (var a = 0; a < $scope.user.authority_ids.length; a++) {
   					console.log($scope.menus[i].children[c]);
   					if ($scope.menus[i].children[c].id == $scope.user.authority_ids[a] ) {
   						$scope.menus[i].children[c].isChecked = true;
   						break;
   					} else {
   						$scope.menus[i].children[c].isChecked = false;
   					}
   				};
   			}
   		};
   	}
});