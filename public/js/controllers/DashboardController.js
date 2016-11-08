angular.module('JxcAdminApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    $scope.data = [];
    for (var i = 0; i <= 15; i++) {
    	var num = Math.ceil(Math.random()*50);
		$scope.data.push({'num': num});
    };
});