/* Setup Rounting For All Pages */
JxcAdminApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard.html");  
    $stateProvider
        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "/views/dashboard.html",            
            data: {pageTitle: '进销存管理 - 首页'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'assets/global/plugins/morris/morris.css',                            
                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',                            
                            'assets/global/plugins/jquery.sparkline.min.js',

                            // 控制器js
                            'js/controllers/DashboardController.js',
                        ] 
                    });
                }]
            }
        })

        .state('sys_user', {
            url: "/sys_user.html",
            templateUrl: "views/sys/user.html",
            data: {pageTitle: '进销存管理 - 用户管理'},
            controller: "sysUserController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        files: [
                            'js/controllers/SysController.js'
                        ] 
                    }]);
                }] 
            }
        })

        .state('product_goods', {
            url: "/product_goods.html",
            templateUrl: "views/product/goods.html",
            data: {pageTitle: '进销存管理 - 用户管理'},
            controller: "projectGoodsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        files: [
                            'js/controllers/ProductController.js'
                        ] 
                    }]);
                }] 
            }
        })
}]);