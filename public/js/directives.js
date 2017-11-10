/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
JxcAdminApp.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
JxcAdminApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
JxcAdminApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});

JxcAdminApp.directive('submitButtonDirectives', function($timeout) {
    return {
        restrict: 'A', 
        link: function(scope, iElement, iAttrs) {
            iElement.bind('click', function() {
                iElement.prop('disabled',true);
                $timeout(function () {
                    iElement.prop('disabled',false);
                }, 2000);
            });
        }
    };
});


//分页指令
JxcAdminApp.value('jxcpageConfig',{
    pageSize : 20,
    firstText: '首页',
    prevText: '上一页',
    nextText: '下一页',
    lastText: '末页'
}).directive("jxcpage", ['$http','$compile','jxcpageConfig', function ($http, $compile, pagerConfig) {
    return {
        restrict: 'EA',
        link: function($scope, $element, $attr) {
            var vm = $scope.vm;
            vm.firmSelectLists = {};
            vm.searchData = (typeof vm.searchData == 'undefined') ? {} : vm.searchData;
            vm.pageSize = pagerConfig.pageSize;
            vm.currentPage = (typeof vm.currentPage == 'undefined') ? 1 : vm.currentPage;
            vm.firstText = pagerConfig.firstText;
            vm.prevText = pagerConfig.prevText;
            vm.nextText = pagerConfig.nextText;
            vm.lastText = pagerConfig.lastText;

            $scope.blockUI = function(){
                if(typeof $.blockUI == "function"){
                    if(typeof App.blockUI() == "function"){
                        App.blockUI();
                    }
                }
            }
            $scope.unblockUI = function(){
                if(typeof $.blockUI == "function"){
                    if(typeof App.unblockUI() == "function"){
                        App.unblockUI();
                    }
                }
            }
            $scope.do_init = function() {
                $scope.blockUI();
                //before_init()
                if(typeof vm.before_init == "function"){
                    vm.before_init();
                }
                //init()
                if(typeof vm.init == "function"){
                    vm.init();
                    $scope.unblockUI();
                }else{
                    if(typeof vm.currentPage == 'undefined'){
                        vm.currentPage = 1;
                    }
                    vm.searchData.page = vm.currentPage;
                    $http({
                        url: vm.url_getLists,
                        method: 'GET',
                        params: vm.searchData,
                    }).success(function(res){
                        var code = res.code;
                        switch ( code ) {
                            case '66666' :
                                alert('用户登录已经失效, 请重新登录！');
                                window.location.href = '/login';
                                break;
                            case '0' :
                                var data = res.data.data,
                                count = res.data.total;
                                vm.otherRes = res;
                                vm.listsData = (typeof data != 'undefined') ? data : {};
                                vm.count = (typeof count != 'undefined') ? count : 0; //数据总数
                                vm.totalPage = Math.ceil(vm.count / vm.pageSize);
                                $scope.pager_html();
                                $scope.unblockUI();
                                //after_init()
                                if(typeof vm.after_init == "function"){
                                    vm.after_init();
                                }
                                break;
                            case '88888':
                                vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                                $('#message_opt').modal('toggle');
                                $scope.unblockUI();
                                break;
                        }
                    }).error(function(){
                        vm.error_msg = '服务器不想工作了~^_^';
                        $('#message_opt').modal('toggle');
                        $scope.unblockUI();
                    });
                }
            }
            $scope.do_init();

            $scope.first_page = function() {
                if(vm.currentPage != 1) {
                    vm.currentPage = 1;
                    $scope.get_data();
                }
            }
            $scope.pre_page = function() {
                if(vm.currentPage > 1){
                    vm.currentPage --;
                    $scope.get_data();
                }
            }
            $scope.next_page = function() {
                if(vm.currentPage < vm.totalPage){
                    vm.currentPage ++;
                    $scope.get_data();
                }
            }
            $scope.last_page = function() {
                if(vm.currentPage != vm.totalPage){
                    vm.currentPage = vm.totalPage;
                    $scope.get_data();
                }
            }
            $scope.jump = function($i) {
                vm.currentPage = $i;
                $scope.get_data();
            }
            $scope.get_data = function() {
                $scope.blockUI();
                vm.searchData.page = vm.currentPage;
                $http({
                    url: vm.url_getLists,
                    method:'GET',
                    params: vm.searchData,
                }).success(function(res){
                    var code = res.code;
                    switch ( code ) {
                        case '66666' :
                            alert('用户登录已经失效, 请重新登录！');
                            window.location.href = '/login';
                            break;
                        case '0' :
                            var data = res.data.data,
                            count = res.data.total;
                            vm.otherRes = res;
                            vm.listsData = (typeof data != 'undefined') ? data : {};
                            vm.count = (typeof count != 'undefined') ? count : 0; //数据总数
                            vm.totalPage = Math.ceil(vm.count / vm.pageSize);
                            $scope.pager_html();
                            $scope.unblockUI();
                            break;
                        case '88888':
                            vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                            $('#message_opt').modal('toggle');
                            $scope.unblockUI();
                            break;
                    }
                }).error(function(){
                    $scope.unblockUI();
                    vm.error_msg = '服务器不想工作了~^_^';
                    $('#message_opt').modal('toggle');
                    $scope.unblockUI();
                });
            }
            vm.handleSearch = function() {
                if(typeof $scope.before_search == "function"){
                    $scope.before_search();
                }
                vm.currentPage = 1;
                $scope.get_data();
            }
            vm.resetSearch = function() {
                // 重置 searchData
                for (var i in vm.searchData) {
                    vm.searchData[i] = '';
                };
                vm.currentPage = 1;
                $scope.get_data();
            }

            /*
            * 回車事件
            **/ 
            vm.searchKeyUp = function(e){
                var keyCode = window.event ? e.keyCode : e.which;
                if ( keyCode == 13 ) {
                    vm.handleSearch();
                }
            }

            $scope.fnGetFirmSort = function(url){
                $http({
                    url: url,
                    method: 'GET',
                }).success(function(res){
                    var code = res.code;
                    if ( code == '0' ) {
                        vm.sortSelectLists = res.data.sorts;
                    }
                }).error(function(res){
                    vm.error_msg = '服务器不想工作了~^_^';
                    $('#message_opt').modal('toggle');
                });
            }

            $scope.pager_html = function() {
                vm.totalPage = Math.ceil(vm.count / vm.pageSize);
                var pagerHtml =
                    '<div class="page pull-left" data-target="content-result">'
                    +'<span class="pg_first btn btn-default margin-right-10" ng-click="first_page()">' + vm.firstText + '</span>'
                    +'<span class="pg_pre btn btn-default margin-right-10" ng-click="pre_page()">' + vm.prevText + '</span>';

                for(var i = vm.currentPage - 2; i <= vm.currentPage + 2; i++) {
                    if(i == vm.currentPage){
                        pagerHtml += '<span style="border:0px;" class="pg_curr btn btn-default margin-right-10" ng-click="jump('+ i +')">'+ i +'</span>'
                    }else if(i > 0 && i <= vm.totalPage){
                        pagerHtml += '<span class="pg_link btn btn-default margin-right-10" ng-click="jump('+ i +')">'+ i +'</span>';
                    }
                }

                pagerHtml +=
                    '<span class="pg_next btn btn-default margin-right-10" ng-click="next_page()">' + vm.nextText + '</span>'
                    +'<span class="pg_last btn btn-default margin-right-10" ng-click="last_page()">' + vm.lastText + '</span>'
                    +'<span class="btn total" style="font-size:16px">共 : <span style="color:blue">' + vm.totalPage + '</span>页<span style="color:red;font-weight:bolder">' + vm.count + '</span>条</span>'
                    +'</div>';

                $element.html(pagerHtml);
                $compile($element.contents())($scope);
            }

        }
    };
}]);


//弹窗分页指令
JxcAdminApp.value('jxcmodalpageConfig',{
    pageSize : 50,
    firstText: '首页',
    prevText: '上一页',
    nextText: '下一页',
    lastText: '末页'
}).directive("jxcmodalpage", ['$http','$compile','jxcmodalpageConfig', function ($http, $compile, pagerConfig) {
    return {
        restrict: 'EA',
        link: function($scope, $element, $attr) {
            var vm = $scope.vm;
            vm.modalSearchData = (typeof vm.modalSearchData == 'undefined') ? {} : vm.modalSearchData;
            vm.modalPageSize = pagerConfig.pageSize;
            vm.modalCurrentPage = (typeof vm.modalCurrentPage == 'undefined') ? 1 : vm.modalCurrentPage;
            vm.modalFirstText = pagerConfig.firstText;
            vm.modalPrevText = pagerConfig.prevText;
            vm.modalNextText = pagerConfig.nextText;
            vm.modalLastText = pagerConfig.lastText;

            $scope.model_do_init = function() {
                //before_init()
                if(typeof vm.modal_before_init == "function"){
                    vm.modal_before_init();
                }
                //init()
                if(typeof vm.modalInit == "function"){
                    vm.modalInit();
                }else{
                    if(typeof vm.modalCurrentPage == 'undefined'){
                        vm.modalCurrentPage = 1;
                    }
                    vm.modalSearchData.page = vm.modalCurrentPage;
                    $http({
                        url: vm.modal_url_getLists,
                        method: 'GET',
                        params: vm.modalSearchData,
                    }).success(function(res){
                        var code = res.code;
                        switch ( code ) {
                            case '66666' :
                                alert('用户登录已经失效, 请重新登录！');
                                window.location.href = '/login';
                                break;
                            case '0' :
                                var data = res.data.data,
                                count = res.data.total;
                                vm.modalListsData = (typeof data != 'undefined') ? data : {};
                                vm.modalCount = (typeof count != 'undefined') ? count : 0; //数据总数
                                vm.modalTotalPage = Math.ceil(vm.modalCount / vm.modalPageSize);
                                $scope.model_pager_html();
                                //after_init()
                                if(typeof vm.modal_after_init == "function"){
                                    vm.modal_after_init();
                                }
                                break;
                            case '88888':
                                vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                                $('#message_opt').modal('toggle');
                                break;
                        }
                    }).error(function(){
                        vm.error_msg = '服务器不想工作了~^_^';
                        $('#message_opt').modal('toggle');
                    });
                }
            }
            $scope.model_do_init();

            $scope.model_first_page = function() {
                if(vm.modalCurrentPage != 1) {
                    vm.modalCurrentPage = 1;
                    $scope.modal_get_data();
                }
            }
            $scope.model_pre_page = function() {
                if(vm.modalCurrentPage > 1){
                    vm.modalCurrentPage --;
                    $scope.modal_get_data();
                }
            }
            $scope.modal_next_page = function() {
                if(vm.modalCurrentPage < vm.modalTotalPage){
                    vm.modalCurrentPage ++;
                    $scope.modal_get_data();
                }
            }
            $scope.modal_last_page = function() {
                if(vm.modalCurrentPage != vm.modalTotalPage){
                    vm.modalCurrentPage = vm.modalTotalPage;
                    $scope.modal_get_data();
                }
            }
            $scope.modal_jump = function($i) {
                vm.modalCurrentPage = $i;
                $scope.modal_get_data();
            }
            $scope.modal_get_data = function() {
                vm.modalSearchData.page = vm.modalCurrentPage;
                $http({
                    url: vm.modal_url_getLists,
                    method:'GET',
                    params: vm.modalSearchData,
                }).success(function(res){
                    var code = res.code;
                    switch ( code ) {
                        case '66666' :
                            alert('用户登录已经失效, 请重新登录！');
                            window.location.href = '/login';
                            break;
                        case '0' :
                            var data = res.data.data,
                            count = res.data.total;
                            vm.modalListsData = (typeof data != 'undefined') ? data : {};
                            vm.modalCount = (typeof count != 'undefined') ? count : 0; //数据总数
                            vm.modalTotalPage = Math.ceil(vm.modalCount / vm.modalPageSize);
                            $scope.model_pager_html();
                            if(typeof vm.modal_after_init == "function"){
                                vm.modal_after_init();
                            }
                            break;
                        case '88888':
                            vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                            $('#message_opt').modal('toggle');
                            break;
                    }
                }).error(function(){
                    vm.error_msg = '服务器不想工作了~^_^';
                    $('#message_opt').modal('toggle');
                });
            }
            vm.modalHandleSearch = function() {
                vm.modalCurrentPage = 1;
                $scope.modal_get_data();
            }
            vm.modalResetSearch = function() {
                // 重置 modalSearchData
                for (var i in vm.modalSearchData) {
                    vm.modalSearchData[i] = '';
                };
                vm.modalCurrentPage = 1;
                $scope.modal_get_data();
            }

            /*
            * 回車事件
            **/ 
            vm.modalSearchKeyUp = function(e){
                var keyCode = window.event ? e.keyCode : e.which;
                if ( keyCode == 13 ) {
                    vm.modalHandleSearch();
                }
            }

            $scope.model_pager_html = function() {
                vm.modalTotalPage = Math.ceil(vm.modalCount / vm.modalPageSize);
                var pagerHtml =
                    '<div class="page pull-left" data-target="content-result">'
                    +'<span class="pg_first btn btn-default margin-right-10" ng-click="model_first_page()">' + vm.modalFirstText + '</span>'
                    +'<span class="pg_pre btn btn-default margin-right-10" ng-click="model_pre_page()">' + vm.modalPrevText + '</span>';

                for(var i = vm.modalCurrentPage - 2; i <= vm.modalCurrentPage + 2; i++) {
                    if(i == vm.modalCurrentPage){
                        pagerHtml += '<span style="border:0px;" class="pg_curr btn btn-default margin-right-10" ng-click="modal_jump('+ i +')">'+ i +'</span>'
                    }else if(i > 0 && i <= vm.modalTotalPage){
                        pagerHtml += '<span class="pg_link btn btn-default margin-right-10" ng-click="modal_jump('+ i +')">'+ i +'</span>';
                    }
                }

                pagerHtml +=
                    '<span class="pg_next btn btn-default margin-right-10" ng-click="modal_next_page()">' + vm.modalNextText + '</span>'
                    +'<span class="pg_last btn btn-default margin-right-10" ng-click="modal_last_page()">' + vm.modalLastText + '</span>'
                    +'<span class="btn total" style="font-size:16px">共 : <span style="color:blue">' + vm.modalTotalPage + '</span>页<span style="color:red;font-weight:bolder">' + vm.modalCount + '</span>条</span>'
                    +'</div>';

                $element.html(pagerHtml);
                $compile($element.contents())($scope);
            }

        }
    };
}]);