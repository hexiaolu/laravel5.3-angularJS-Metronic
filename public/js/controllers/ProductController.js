angular.module('JxcAdminApp').controller('projectGoodsController', function($rootScope, $scope, $http, $timeout, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
    });
});