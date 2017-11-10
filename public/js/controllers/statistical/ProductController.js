// 统计管理 controller
angular.module('JxcAdminApp').controller('StaProductController', function($rootScope, $scope, $http, $state, JxcService) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
        JxcService.get_jxc_configs();
    });

    var vm = $scope.vm = {};

    // 初始化搜索
    vm.searchData = {
        start_at : '',
        end_at : '',
        firm : '',
        sort_id : '',
        number : '',
        name : '',
        type : 'into'
    };

    // 初始化设置
    vm.before_init = function(){
        vm.url_getLists = 'statistical/product/lists';
    }

    // 分类列表 
    vm.after_init = function(){
        // 分类列表
        $scope.fnGetFirmSort('product/product/getFirmSort');
        $('.list-select2').select2();
    }

    /**
    * 日期初始化
    * @returns {undefined}
    */
    $('.into_date_modal').datepicker({
        format: "yyyy-mm-dd",
        autoclose: true
    });
});