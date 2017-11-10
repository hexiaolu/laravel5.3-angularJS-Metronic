// 产品管理 controller
angular.module('JxcAdminApp').controller('intoController', function($rootScope, $scope, $http, $state, $timeout, JxcService) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
        JxcService.get_jxc_configs();
    });
    var vm = $scope.vm = {};

    // 初始化搜索
    vm.searchData = {
        flow_id : '',
        start_at : '',
        end_at : '',
    };

    vm.modalSearchData = {
        number: '',
        name: '',
        firm: '',
        sort_id: '',
    }

    //初始化数据
    vm.detailProducts = [];
    vm.chooseProducts = [];
    vm.flow_id = '';
    vm.ischeckedArray = [];

    // 初始化设置
    vm.before_init = function(){
        vm.url_getLists = 'product/into/lists';
    }

    // 获取产品列表 
    vm.modal_before_init = function(){
        $scope.fnGetFirmSort('product/product/getFirmSort');
        $('.list-select2').select2();
        // 获产品列列表
        vm.modal_url_getLists = 'product/into/products';
    }

    vm.modal_after_init = function(){
        var length = vm.modalListsData.length;
        for ( var i = 0; i < length; i++) {
            if ( vm.ischeckedArray[vm.modalListsData[i].id] == undefined ) {
                vm.ischeckedArray[vm.modalListsData[i].id] = false;
            }
        }
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
    * 入库弹窗
    */
    vm.intoProductModal = function(){
        $http({
            method: "get",
            url: "product/into/getflowid",
        }).success(function(data){
            var code = data.code;
            switch( code ) {
                case '66666' :
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '0' :
                    vm.flow_id = data.data;
                    $('.into_product_modal').modal('toggle');
                    break;
                case '-1' :
                    vm.error_msg = data.msg;
                    $('#message_opt').modal('toggle');
                    break;
            }
        }).error(function(){
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }

    /*
    * 选择产品弹窗
    */
    vm.chooseProductModal = function(){
        $('.choose_product_modal').modal('toggle');
    }

    /*
    * 产品选择点击事件
    */
    vm.submitChoose = function(index){
        $timeout(function () {
            JxcService.formatInput();
        }, 500);
        $('.choose_product_modal').modal('toggle');
    }

    /*
    * 删除选中
    **/
    vm.deleteChoose = function(product_id){
        var tempChooseProducts = [],length = vm.chooseProducts.length;
        for (var i = 0; i < length; i++) {
            if ( vm.chooseProducts[i].id != product_id) {
                tempChooseProducts.push(vm.chooseProducts[i])
            }
        };
        vm.chooseProducts = tempChooseProducts;
        vm.ischeckedArray[product_id] = false;
    }

    /*
    * 提交入库产品
    **/
    vm.intoSubmitOpt = function(){
        if ( vm.flow_id == '') {
            JxcService.jxc_notific8('danger', '入库操作', '入库流水号不能为空', 3000);
            return;
        }

        if ( vm.chooseProducts.length == 0 ){
            JxcService.jxc_notific8('danger', '入库操作', '请选择入库产品', 3000);
            return;   
        }

        var optData = {
                flow_id: vm.flow_id,
                products: vm.chooseProducts
            };

        $http({
            method: "post",
            url: "product/into/intoproduct",
            data: optData
        }).success(function(data){
            var code = data.code;
            switch( code ) {
                case '66666' :
                    $('.into_product_modal').modal('toggle');
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '0' :
                    vm.chooseProducts = [];
                    $('.into_product_modal').modal('toggle');
                    JxcService.jxc_notific8('success', '入库管理', '操作成功!', 3000);
                    $scope.get_data();
                    break;
                case '-1' :
                    $('.into_product_modal').modal('toggle');
                    vm.error_msg = data.msg;
                    $('#message_opt').modal('toggle');
                    break;
                case '88888' :
                    $('.into_product_modal').modal('toggle');
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
                default :
                    JxcService.jxc_notific8('danger', '入库管理', data.msg, 3000);
                    break;
            }
        }).error(function(){
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }

    /*
    * 查看详情弹窗
    **/
    vm.detailModal = function(id){
        $http({
            method: 'GET',
            url: 'product/into/' + id + '/detail'
        }).success(function(data){
            var code = data.code;
            switch( code ) {
                case '66666' :
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '0' :
                    vm.detailProducts = data.data;
                    $('.into_detail_modal').modal('toggle');
                    break;
                case '88888' :
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
            }
        }).error(function(){
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }

    vm.chooseProductFunc = function(product_id, child){
        var isCheck = vm.ischeckedArray[product_id];
        if ( isCheck ) {
            vm.chooseProducts.push(child);
        } else {
            var tempChooseProducts = [],length = vm.chooseProducts.length;
            for (var i = 0; i < length; i++) {
                if ( vm.chooseProducts[i].id != product_id) {
                    tempChooseProducts.push(vm.chooseProducts[i])
                }
            };
            vm.chooseProducts = tempChooseProducts;
        }
    }
});