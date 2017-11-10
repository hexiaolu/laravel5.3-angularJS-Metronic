angular.module('JxcAdminApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout, JxcService) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
        JxcService.get_jxc_configs();
    });

    var vm = $scope.vm = {};
    vm.count = 0;
    vm.listData = [];

    // 获取预警数量
    $timeout(function() {
	    $http({
	        method: 'GET',
	        url: 'product/product/warns'
	    }).success(function(data){
	        var code = data.code;
	        if( code == '0' ) {
                vm.product_count = data.data.product_count;
                vm.product_warns = data.data.product_warns;
                vm.shipment_count = data.data.shipment_count;
                vm.shipment_records = data.data.shipment_records
	        }
	    }).error(function(){
	        vm.error_msg = '服务器不想工作了~^_^';
	        $('#message_opt').modal('toggle');
	    });
    }, 200);
});