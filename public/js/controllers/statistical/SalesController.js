// 统计管理 controller
angular.module('JxcAdminApp').controller('StaSalesController', function($rootScope, $scope, $http, $state, JxcService) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
        JxcService.get_jxc_configs();
    });

    var vm = $scope.vm = {};

    // 初始化搜索
    vm.searchData = {
        start_at : '',
        end_at : ''
    };

    // 初始化设置
    vm.before_init = function(){
        vm.url_getLists = 'statistical/sales/lists';
    }

    /**
    * 日期初始化
    * @returns {undefined}
    */
    $('.into_date_modal').datepicker({
        format: "yyyy-mm-dd",
        autoclose: true
    });

    /*
    * 查看详情
    **/
    vm.showShipment = function(date){
        window.location.href = "#/product_shipment.html?s_date=" + date;
    }
});