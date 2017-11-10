/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var JxcAdminApp = angular.module("JxcAdminApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize"
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
JxcAdminApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
JxcAdminApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
JxcAdminApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
JxcAdminApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
    });
}]);

/* Setup Layout Part - Header */
JxcAdminApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
JxcAdminApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Init global settings and run the app */
JxcAdminApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);

JxcAdminApp.service('JxcService', function($rootScope, $http) {
    var factory = {};
    factory.jxc_notific8 = function(color, header, text, life) {
        var settings = {
                theme: color, // 我是颜色
                sticky: false,
                horizontalEdge: 'top',
                verticalEdge: 'right'
            },
            $button = $(this);

        settings.life = life;  //我是时间
        settings.heading = header;
        $.notific8('zindex', 11500);
        $.notific8(text, settings);
        $button.attr('disabled', 'disabled');
        setTimeout(function() {
            $button.removeAttr('disabled');
        }, 1000);
    }

    factory.formatInput = function() {
        $(".mask_number").inputmask({
            "mask": "9",
            "repeat": 6,
            "greedy": false
        });

        $(".mask_double").inputmask({ mask: "9{1,5}[.9{0,5}]"});
    }

    factory.get_jxc_configs = function() {
        if (typeof $rootScope.jxc_configs == 'undefined') {
            $rootScope.jxc_configs = {
                sidebar_menus : '',
                jxc_settings_into_flow: '',
                jxc_settings_shipment_flow: ''
            }
            $http({
                url:'/sys/user/getjxcconfigs',
                method:'GET',
            }).success(function(data){
                var code = data.code;
                switch(code) {
                    case '0':
                        $rootScope.jxc_configs.sidebar_menus = data.data.menus;
                        $rootScope.jxc_configs.show_cost = data.data.show_cost;
                        $rootScope.jxc_configs.jxc_settings_into_flow = data.data.auto_into_flow == 'Y' ? true : false;
                        $rootScope.jxc_configs.jxc_settings_shipment_flow = data.data.auto_shipment_flow == 'Y' ? true : false;
                        break;
                    case '66666' :
                        alert('用户登录已经失效, 请重新登录！');
                        window.location.href = '/login';
                        break;
                }
            }).error(function(data){
                alert('服务器不想工作了~^_^');
            });
        } 
    }


    factory.changeRmb = function(n){
        var fraction = ['角', '分'];  
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];  
        var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];  
        var head = n < 0? '欠': '';  
        n = Math.abs(n);  

        var s = '';  

        for (var i = 0; i < fraction.length; i++)   
        {  
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');  
        }  
        s = s || '整';  
        n = Math.floor(n);  

        for (var i = 0; i < unit[0].length && n > 0; i++)   
        {  
            var p = '';  
            for (var j = 0; j < unit[1].length && n > 0; j++)   
            {  
                p = digit[n % 10] + unit[1][j] + p;  
                n = Math.floor(n / 10);  
            }  
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;  
        }  
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');  
    } 

    return factory;
}); 
