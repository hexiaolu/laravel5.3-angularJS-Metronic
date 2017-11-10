// 产品管理 controller
angular.module('JxcAdminApp').controller('shipmentController', function($location, $rootScope, $scope, $http, $state, $timeout, JxcService) {
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
    vm.showLists = 1;
    vm.showPrint = 0;
    vm.detailProducts = [];
    vm.chooseProducts = [];
    vm.flow_id = '';
    vm.customer_name = '';
    vm.record_once = {};
    vm.confirm_title = '';
    vm.confirm_url = '';
    vm.printType = '1';
    vm.printTitle = "出 库 单";
    vm.printProducts = [];
    vm.printPageSelect = [];
    vm.selectedPage = '0';
    vm.total_price_rmb = '';
    vm.total_price = 0;
    vm.ischeckedArray = [];


    /**
    * 日期初始化
    * @returns {undefined}
    */
    $('.into_date_modal').datepicker({
        format: "yyyy-mm-dd",
        autoclose: true
    });

    // 初始化设置
    vm.before_init = function(){
        var s_date = $location.search().s_date;
        if (s_date != undefined) {
            vm.searchData.start_at = s_date;
            vm.searchData.end_at = s_date;
        }
        vm.url_getLists = 'product/shipment/lists';
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


    /*
    * 选择产品弹窗
    */
    vm.chooseProductModal = function(){
        $('.choose_product_modal').modal('toggle');
    }

    /*
    * 出库弹窗
    */
    vm.shipmentProductModal = function(){
         $http({
            method: "get",
            url: "product/shipment/getflowid",
        }).success(function(data){
            var code = data.code;
            switch( code ) {
                case '66666' :
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '0' :
                    vm.flow_id = data.data;
                    $('.shipment_product_modal').modal('toggle');
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
    * 提交出库产品
    **/
    vm.shipmentSubmitOpt = function(){
        if ( vm.flow_id == '') {
            JxcService.jxc_notific8('danger', '出库操作', '出库流水号不能为空', 3000);
            return;
        }

        if ( vm.chooseProducts.length == 0 ){
            JxcService.jxc_notific8('danger', '出库操作', '请选择出库产品', 3000);
            return;   
        }

        var is_true = false;
        for (var i in vm.chooseProducts) {
            if (vm.chooseProducts[i].amount > vm.chooseProducts[i].stock || vm.chooseProducts[i].amount == 0) {
                is_true = true;
                JxcService.jxc_notific8('danger', '出库操作', "请填写产品：{" + vm.chooseProducts[i].name + '}的出库数量且保证库存充足！', 5000);
            }
        };

        if ( is_true ) {
            return ;
        }

        var optData = {
                flow_id: vm.flow_id,
                customer_name: vm.customer_name,
                products: vm.chooseProducts
            };

        $http({
            method: "post",
            url: "product/shipment/shipmentproduct",
            data: optData
        }).success(function(data){
            var code = data.code;
            switch( code ) {
                case '66666' :
                    $('.shipment_product_modal').modal('toggle');
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '0' :
                    vm.chooseProducts = [];
                    $('.shipment_product_modal').modal('toggle');
                    JxcService.jxc_notific8('success', '出库管理', '操作成功!', 3000);
                    $scope.get_data();
                    break;
                case '-1' :
                    $('.shipment_product_modal').modal('toggle');
                    vm.error_msg = data.msg;
                    $('#message_opt').modal('toggle');
                    break;
                case '88888' :
                    $('.shipment_product_modal').modal('toggle');
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
                    break;
                case '00502' :
                    var msg_data = data.data;
                    for(var i in msg_data) {
                        JxcService.jxc_notific8('danger', '出库操作', "请填写产品：{" + msg_data[i] + '}的出库数量且保证库存充足！', 5000);
                    }
                    break;
                default :
                    JxcService.jxc_notific8('danger', '出库管理', data.msg, 3000);
                    break;
            }
        }).error(function(){
            vm.error_msg = '服务器不想工作了~^_^';
            $('#message_opt').modal('toggle');
        });
    }

    /*
    * 确认/撤销 出库操作
    */
    vm.confirmModal = function(id, opt) {
        if ( opt == 'confirm' ) {
            vm.confirm_title = '是否确认出库，确认后不可恢复！';
            vm.confirm_url = 'product/shipment/' + id + '/confirm';
        } else {
            vm.confirm_title = '是否撤销出库，确认后不可恢复！';
            vm.confirm_url = 'product/shipment/' + id + '/cancel';
        }

        $('#confirm_shipment_opt').modal('toggle');
    }

    /*
    * 提交出库确认/撤销操作
    */
    vm.submitConfirmOpt = function(){
        $http({
            method: 'POST',
            url: vm.confirm_url
        }).success(function(data){
            var code = data.code;
            switch( code ) {
                case '66666' :
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '0' :
                    JxcService.jxc_notific8('success', '出库操作', "操作成功！", 2000);
                    $scope.get_data();
                    $('#confirm_shipment_opt').modal('toggle');
                    break;
                case '88888' :
                    vm.error_msg = '您没有权限进行该操作，请联系管理员查询~^_^';
                    $('#message_opt').modal('toggle');
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
    * 查看详情弹窗
    **/
    vm.detailModal = function(record, opt){
        $http({
            method: 'GET',
            url: 'product/shipment/' + record.id + '/detail'
        }).success(function(data){
            var code = data.code;
            switch( code ) {
                case '66666' :
                    alert('用户登录已经失效, 请重新登录！');
                    window.location.href = '/login';
                    break;
                case '0' :
                    vm.record_once = record;
                    vm.detailProducts = data.data;
                    if ( opt == 'detail' ) {
                        $('.shipment_detail_modal').modal('toggle');
                    } else {
                        vm.tempProducts = _.chunk(data.data, 7);
                        length = vm.tempProducts.length;
                        vm.printPageSelect = [];
                        for (var i = 0; i < length; i++) {
                            var page = i + 1;
                            vm.printPageSelect.push({key: i, value: "第" + page + '页'});
                        };

                        vm.printProducts = vm.tempProducts[0];
                        totalPriceFunc();
                        vm.showLists = 0;
                        vm.showPrint = 1;
                    }
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

    /*
    * 打印操作
    **/
    vm.shipmentPrint = function(){
        if ( vm.printType == 0 ){
            JxcService.jxc_notific8('danger', '出库管理-打印操作', '请选择打印类型！', 3000);
            return;
        }

        switch( vm.printType ) {
            case '1' :
                vm.printTitle = "出 库 单";
                break;
            case '2' :
                vm.printTitle = "送 货 单";
                break;
            case '3' :
                vm.printTitle = "收款收据";
                break;
        }

        setTimeout(function() {
            window.print();
        }, 200);
    }

    /*
    * 返回操作
    **/
    vm.returnLists = function(){
        vm.showPrint = 0;
        vm.showLists = 1;
    }

    /*
    * 打印分页操作
    **/
    vm.selectPageFunc = function(){
        vm.printProducts = vm.tempProducts[vm.selectedPage];
        totalPriceFunc();
    }

    var totalPriceFunc = function(){
        var total_price = 0, total_price_rmb = '', length = vm.printProducts.length;
        for ( var i = 0; i < length; i++) {
            if (vm.printProducts[i].name != undefined && vm.printProducts[i].standard != undefined) {
                vm.printProducts[i].new_name = vm.printProducts[i].name + '(' + vm.printProducts[i].standard + ')';
            }
            if (vm.printProducts[i].total_price != undefined) {
                total_price += parseFloat(vm.printProducts[i].total_price);
            }
        }

        if ( length < 7 ) {
            for (var i = length; i < 7; i++) {
                vm.printProducts.push({});
            }
        }

        total_price_rmb = JxcService.changeRmb(total_price);
        vm.total_price = total_price;
        vm.total_price_rmb = total_price_rmb;
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