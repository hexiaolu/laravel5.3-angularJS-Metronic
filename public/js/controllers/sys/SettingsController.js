// 产品管理 controller
angular.module('JxcAdminApp').controller('settingsController', function($rootScope, $scope, $http, $state, $timeout, JxcService) {
    $scope.$on('$viewContentLoaded', function() {   
        // App.initAjax();
        App.blockUI();
        JxcService.get_jxc_configs();
    });
    var vm = $scope.vm = {};

    vm.optData = {
    	auto_shipment_flow: false,
    	auto_into_flow: false
    };

    $timeout(function() {
        vm.optData.auto_into_flow = $rootScope.jxc_configs.jxc_settings_into_flow;
        vm.optData.auto_shipment_flow = $rootScope.jxc_configs.jxc_settings_shipment_flow;
        App.unblockUI();
    }, 1000);

    vm.submitSettings = function(){
    	$http({
            method: "post",
            url: "sys/settings/updatesettings",
            data: vm.optData
        }).success(function(data){
            var code = data.code;
            switch( code ) {
                case '66666' :
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '0' :
                    $rootScope.jxc_configs.jxc_settings_into_flow = vm.optData.auto_into_flow;
                    $rootScope.jxc_configs.jxc_settings_shipment_flow = vm.optData.auto_shipment_flow;
                    JxcService.jxc_notific8('success', '系统设置', '操作成功!', 3000);
                    break;
                case '-1' :
                    vm.error_msg = data.msg;
                    $('#message_opt').modal('toggle');
                    break;
                case '88888' :
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
            }
        }).error(function(){
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }
});