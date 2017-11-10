// 产品管理 controller
angular.module('JxcAdminApp').controller('logsController', function($rootScope, $scope, $http, $state, JxcService) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
        JxcService.get_jxc_configs();
    });

    var vm = $scope.vm = {};

    // 初始化设置
    vm.before_init = function(){
        vm.url_getLists = 'sys/logs/lists';
    }
});