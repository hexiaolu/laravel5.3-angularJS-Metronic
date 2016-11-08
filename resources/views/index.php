<!DOCTYPE html>
<html lang="en" data-ng-app="JxcAdminApp">
    <!--<![endif]-->
    <!-- BEGIN HEAD -->

    <head>
        <title data-ng-bind="$state.current.data.pageTitle"></title>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="" name="description" />
        <meta content="" name="author" />
        <!-- BEGIN GLOBAL MANDATORY STYLES -->
        <link href="assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <link href="assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
        <link href="assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="assets/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
        <link href="assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css" />
        <!-- END GLOBAL MANDATORY STYLES -->
        <!-- BEGIN DYMANICLY LOADED CSS FILES(all plugin and page related styles must be loaded between GLOBAL and THEME css files ) -->
        <link id="ng_load_plugins_before" />
        <!-- END DYMANICLY LOADED CSS FILES -->
        <!-- BEGIN THEME STYLES -->
        <!-- DOC: To use 'rounded corners' style just load 'components-rounded.css' stylesheet instead of 'components.css' in the below style tag -->
        <link href="assets/global/css/components.min.css" id="style_components" rel="stylesheet" type="text/css" />
        <link href="assets/global/css/plugins.min.css" rel="stylesheet" type="text/css" />
        <link href="assets/layouts/layout/css/layout.min.css" rel="stylesheet" type="text/css" />
        <link href="assets/layouts/layout/css/themes/light2.min.css" rel="stylesheet" type="text/css" id="style_color" />
        <link href="assets/layouts/layout/css/custom.min.css" rel="stylesheet" type="text/css" />
        <!-- END THEME STYLES -->
        <link rel="shortcut icon" href="favicon.ico" /> </head>
    <!-- END HEAD -->
    <!-- BEGIN BODY -->
    <body ng-controller="AppController" class="page-header-fixed page-sidebar-closed-hide-logo page-on-load" ng-class="{'page-content-white': settings.layout.pageContentWhite,'page-container-bg-solid': settings.layout.pageBodySolid, 'page-sidebar-closed': settings.layout.pageSidebarClosed}">
        <!-- BEGIN PAGE SPINNER -->
        <div ng-spinner-bar class="page-spinner-bar">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
        <!-- END PAGE SPINNER -->
        <!-- BEGIN HEADER -->
        <div data-ng-include="'tpl/header.html'" data-ng-controller="HeaderController" class="page-header navbar navbar-fixed-top"> </div>
        <!-- END HEADER -->
        <div class="clearfix"> </div>
        <!-- BEGIN CONTAINER -->
        <div class="page-container">
            <!-- BEGIN SIDEBAR -->
            <div data-ng-include="'tpl/sidebar.html'" data-ng-controller="SidebarController" class="page-sidebar-wrapper"> </div>
            <!-- END SIDEBAR -->
            <!-- BEGIN CONTENT -->
            <div class="page-content-wrapper">
                <div class="page-content">
                    <!-- BEGIN ACTUAL CONTENT -->
                    <div ui-view class="fade-in-up">回到顶部</div>
                    <!-- END ACTUAL CONTENT -->
                </div>
            </div>
        </div>
        <!-- END CONTAINER -->
        <!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
        <!-- BEGIN CORE JQUERY PLUGINS -->
        <script src="assets/global/plugins/jquery.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
        <!-- END CORE JQUERY PLUGINS -->
        <!-- BEGIN CORE ANGULARJS PLUGINS -->
        <script src="assets/global/plugins/angularjs/angular.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/angularjs/angular-sanitize.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/angularjs/angular-touch.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/angularjs/plugins/angular-ui-router.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/angularjs/plugins/ocLazyLoad.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/angularjs/plugins/ui-bootstrap-tpls.min.js" type="text/javascript"></script>
        <!-- END CORE ANGULARJS PLUGINS -->
        <!-- BEGIN APP LEVEL ANGULARJS SCRIPTS -->
        <script src="js/main.js" type="text/javascript"></script>
        <script src="js/directives.js" type="text/javascript"></script>
        <script src="js/jxc_admin_router.js" type="text/javascript"></script>
        <!-- END APP LEVEL ANGULARJS SCRIPTS -->
        <!-- BEGIN APP LEVEL JQUERY SCRIPTS -->
        <script src="assets/global/scripts/app.min.js" type="text/javascript"></script>
        <script src="assets/layouts/layout/scripts/layout.min.js" type="text/javascript"></script>
        <!-- END APP LEVEL JQUERY SCRIPTS -->
        <!-- END JAVASCRIPTS -->
    </body>
    <!-- END BODY -->
</html>