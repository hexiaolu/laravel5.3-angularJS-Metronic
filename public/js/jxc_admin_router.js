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
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/sys/UserController.js'
                        ] 
                    }]);
                }] 
            }
        })

        .state('product_goods', {
            url: "/product_goods.html",
            templateUrl: "views/product/goods.html",
            data: {pageTitle: '进销存管理 - 产品管理'},
            controller: "goodsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            //select2
                            'assets/global/plugins/select2/css/select2.min.css',          
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',                           

                            'assets/global/plugins/select2/js/select2.full.min.js',                        
                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',                   
                            'assets/pages/scripts/components-select2.min.js',            
                            'js/controllers/product/GoodsController.js',
                        ] 
                    }]);
                }] 
            }
        })
        
        .state('product_firm', {
            url: "/product_firm.html",
            templateUrl: "views/product/firm.html",
            data: {pageTitle: '进销存管理 - 产品管理'},
            controller: "firmController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/product/FirmController.js',
                        ] 
                    }]);
                }] 
            }
        })

        .state('product_sort', {
            url: "/product_sort.html",
            templateUrl: "views/product/sort.html",
            data: {pageTitle: '进销存管理 - 分类管理'},
            controller: "sortController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/product/SortController.js',
                        ] 
                    }]);
                }] 
            }
        })

        .state('product_into', {
            url: "/product_into.html",
            templateUrl: "views/product/into.html",
            data: {pageTitle: '进销存管理 - 产品管理'},
            controller: "intoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            //select2
                            'assets/global/plugins/select2/css/select2.min.css',          
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',                           
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',                           

                            'assets/pages/scripts/components-select2.min.js', 
                            'assets/global/plugins/select2/js/select2.full.js',                        
                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',                           

                            'js/controllers/product/IntoController.js',
                        ] 
                    }]);
                }] 
            }
        })

        .state('product_shipment', {
            url: "/product_shipment.html",
            templateUrl: "views/product/shipment.html",
            data: {pageTitle: '进销存管理 - 产品管理'},
            controller: "shipmentController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/lodash.js',
                            //select2
                            'css/shipment.css',          
                            'assets/global/plugins/select2/css/select2.min.css',          
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',                           
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',                           

                            'assets/pages/scripts/components-select2.min.js', 
                            'assets/global/plugins/select2/js/select2.full.js',                        
                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',                           

                            'js/controllers/product/ShipmentController.js',
                        ] 
                    }]);
                }] 
            }
        })

        .state('product_warn', {
            url: "/product_warn.html",
            templateUrl: "views/product/warn.html",
            data: {pageTitle: '进销存管理 - 产品管理'},
            controller: "warnController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/product/WarnController.js'
                        ] 
                    }]);
                }] 
            }
        })

        .state('sys_logs', {
            url: "/sys_logs.html",
            templateUrl: "views/sys/logs.html",
            data: {pageTitle: '进销存管理 - 系统管理'},
            controller: "logsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/sys/LogsController.js'
                        ] 
                    }]);
                }] 
            }
        })

        .state('sys_settings', {
            url: "/sys_settings.html",
            templateUrl: "views/sys/settings.html",
            data: {pageTitle: '进销存管理 - 系统管理'},
            controller: "settingsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/sys/SettingsController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // 产品统计
        .state('statistical_product', {
            url: "/statistical_product.html",
            templateUrl: "views/statistical/product.html",
            data: {pageTitle: '进销存管理 - 统计管理'},
            controller: "StaProductController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            //select2
                            'assets/global/plugins/select2/css/select2.min.css',          
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',                           
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',                           

                            'assets/pages/scripts/components-select2.min.js', 
                            'assets/global/plugins/select2/js/select2.full.js',                        
                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',                           

                            'js/controllers/statistical/ProductController.js',
                        ] 
                    }]);
                }] 
            }
        })

        // 营业额统计
        .state('statistical_sales', {
            url: "/statistical_sales.html",
            templateUrl: "views/statistical/sales.html",
            data: {pageTitle: '进销存管理 - 统计管理'},
            controller: "StaSalesController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'JxcAdminApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            //select2
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',                           
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',                           

                            'js/controllers/statistical/SalesController.js',
                        ] 
                    }]);
                }] 
            }
        })
}]);