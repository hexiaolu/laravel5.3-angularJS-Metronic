// 产品管理 controller
angular.module('JxcAdminApp').controller('goodsController', function($rootScope, $scope, $http, $timeout, $state, JxcService) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
        JxcService.get_jxc_configs();
    });

    var vm = $scope.vm = {};
    // 初始化值
    vm.delete_id = 0;
    vm.product_status = 0;
    // 初始化搜索
    vm.searchData = {
        firm : '',
    	sort_id : '',
    	number : '',
    	name : ''
    };
    // 初始化添加操作
    vm.optData = {
        id: '',
        number: '',
        p_unit: '',
        name: '',
        standard: '',
        firm: '',
        sort_id: '',
        price: '',
        warn_stock: ''
    };

    // 初始化设置
    vm.before_init = function(){
        vm.url_getLists = 'product/product/lists';
    }

    // 获取产地列表 
    vm.after_init = function(){
        // 获取产地列表
        $scope.fnGetFirmSort('product/product/getFirmSort');
        $('.list-select2').select2();
    }

    // 添加产品弹窗
    vm.addProductModal = function(){
        // 重置 optData
        for (var i in vm.optData) {
            vm.optData[i] = '';
        };

        vm.product_status = false;
        $('.add_product_modal').modal('toggle');
        $('.add_select_firm').select2();
        $('.add_select_sort').select2();
        // 默认选中
        $timeout(function(){
            JxcService.formatInput();
            $('.add_select_firm').select2('val', '');
            $('.add_select_sort').select2('val', '');
        }, 300);
    }

    // 编辑产品
    vm.editProduct = function(product){
        vm.product_status = product.status == 'enable' ? true : false;
        if ( $rootScope.jxc_configs.show_cost ) {
            vm.product_status = false;
        }
        
        vm.optData = {
            id: product.id,
            number: product.number,
            name: product.name,
            standard: product.standard,
            firm: product.firm,
            sort_id: product.sort_id,
            price: product.price,
            p_unit: product.p_unit,
            warn_stock: product.warn_stock
        };

        $('.add_product_modal').modal('toggle');
        $('.add_select_firm').select2();
        $('.add_select_sort').select2();
        $timeout(function(){
            JxcService.formatInput();
            $('.add_select_sort').select2('val', product.sort_id);
        }, 300);
    }

    // 提交操作
    vm.goodsSubmitOpt = function(){
        $http({
            url:'product/product/createoredit',
            method:'POST',
            data: vm.optData,
        }).success(function(data){
            var code = data.code;
            switch(code) {
                case '0':
                    $('.add_product_modal').modal('toggle');
                    JxcService.jxc_notific8('success', '产品管理', '操作成功!', 3000);
                    $scope.get_data();
                    break;
                case '66666' :
                    $('.add_product_modal').modal('toggle');
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '-1' :
                    $('.add_product_modal').modal('toggle');
                    vm.error_msg = data.msg;
                    $('#message_opt').modal('toggle');
                    break;
                case '88888' :
                    $('.add_product_modal').modal('toggle');
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
                default :
                    JxcService.jxc_notific8('danger', '产品管理', data.msg, 3000);
                    break;
            }
        }).error(function(data){
            $('.add_product_modal').modal('toggle');
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }

    // 删除弹窗
    vm.deleteModal = function(product_id){
        vm.delete_id = product_id;
        $('#delete_opt').modal('toggle');
    }

    // 提交删除
    vm.submitDelOpt = function(){
        $http({
            url:'product/product/'+vm.delete_id+'/delete',
            method:'POST',
        }).success(function(data){
            var code = data.code;
            switch(code) {
                case '0':
                    $('#delete_opt').modal('toggle');
                    JxcService.jxc_notific8('success', '产品管理', '操作成功!', 3000);
                    $scope.get_data();
                    break;
                case '66666' :
                    $('#delete_opt').modal('toggle');
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '-1' :
                    $('#delete_opt').modal('toggle');
                    vm.error_msg = data.msg;
                    $('#message_opt').modal('toggle');
                    break;
                case '88888' :
                    $('#delete_opt').modal('toggle');
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
                default :
                    JxcService.jxc_notific8('danger', '产品管理', data.msg, 3000);
                    break;
            }
        }).error(function(data){
            $('.delete_opt').modal('toggle');
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }

    // 处理上下架问题
    vm.handleProduct = function(product){
        $http({
            url: 'product/product/'+product.id+'/optenable',
            method: 'POST',
        }).success(function(res){
            var code = res.code;
            switch(code) {
                case '0':
                    product.status = 'enable';
                    JxcService.jxc_notific8('success', '产品管理', '操作成功!', 3000);
                    break;
                case '66666' :
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '-1' :
                    vm.error_msg = data.msg;
                    $('#message_opt').modal('toggle');
                    break;
                case '88888' :
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
                default :
                    JxcService.jxc_notific8('danger', '产品管理', data.msg, 3000);
                    break;
            }
        }).error(function(res){
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }

    /*
    * 添加操作回車事件
    **/ 
    vm.addProductKeyUp = function(e){
        var keyCode = window.event ? e.keyCode : e.which;
        if ( keyCode == 13 ) {
            vm.goodsSubmitOpt();
        }
    }

});