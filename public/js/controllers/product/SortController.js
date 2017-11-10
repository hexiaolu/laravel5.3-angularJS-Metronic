angular.module('JxcAdminApp').controller('sortController', function($rootScope, $scope, $http, $timeout, $state, JxcService) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
        JxcService.get_jxc_configs();
    });

    var vm = $scope.vm = {};

    // 初始化设置
    vm.before_init = function(){
        vm.url_getLists = 'product/sort/lists';
    }

    // 初始化添加操作
    vm.optData = {
    	id: '',
        name: ''
    };

    // 初始化删除操作
    vm.delete_id = '';

    // 初始化提示操作
    vm.error_msg = '';

    // 编辑用户modal
    vm.addSortModal = function() {
    	// 重置 optData
        for (var i in vm.optData) {
            vm.optData[i] = '';
        };

    	$('.sort_update_modal').modal('toggle');
    }


     // 编辑产品
    vm.editSortModal = function(sort){
        vm.optData = {
            id: sort.id,
            name: sort.name,
            address: sort.address
        };

        $('.sort_update_modal').modal('toggle');
    }

    // 提交操作
    vm.sortSubmitOpt = function() {
        $http({
            url:'product/sort/createoredit',
            method:'POST',
            data: vm.optData,
        }).success(function(data){
            var code = data.code;
            switch( code ) {
                case '66666' :
                    $('.sort_update_modal').modal('toggle');
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '0' :
                    $('.sort_update_modal').modal('toggle');
                    JxcService.jxc_notific8('success', '分类管理', '操作成功!', 3000);
                    $scope.get_data();
                    break;
                case '-1' :
                    $('.sort_update_modal').modal('toggle');
                    vm.error_msg = data.msg;
                    $('#message_opt').modal('toggle');
                    break;
                case '88888' :
                    $('.sort_update_modal').modal('toggle');
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
                default :
                    JxcService.jxc_notific8('danger', '分类管理', data.msg, 3000);
                    break;
            }
        }).error(function(data){
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }

    // 删除操作
    vm.deleteSortModal = function(id) {
        vm.delete_id = id;
        $('#delete_opt').modal('toggle');
    }

    // 提交删除
    vm.submitDelOpt = function(){
        $http({
            url:'product/sort/'+vm.delete_id+'/delete',
            method:'POST',
        }).success(function(data){
            var code = data.code;
            switch(code) {
                case '0':
                    $('#delete_opt').modal('toggle');
                    JxcService.jxc_notific8('success', '分类管理', '操作成功!', 3000);
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
                    JxcService.jxc_notific8('danger', '分类管理', data.msg, 3000);
                    break;
            }
        }).error(function(data){
            $('.delete_opt').modal('toggle');
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }
});