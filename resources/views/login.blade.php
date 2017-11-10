<!DOCTYPE html>
<html lang="en">
    <!--<![endif]-->
    <!-- BEGIN HEAD -->
    <head>
        <meta charset="utf-8" />
        <title>Metronic | User Login 1</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="" name="description" />
        <meta content="" name="author" />
        <!-- BEGIN GLOBAL MANDATORY STYLES -->
        <link href="/assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <!-- END GLOBAL MANDATORY STYLES -->
        <!-- BEGIN PAGE LEVEL STYLES -->
        <link href="/assets/pages/css/login.css" rel="stylesheet" type="text/css" />
        <!-- END PAGE LEVEL STYLES -->
    <body class=" login">
        <!-- BEGIN LOGIN -->
        <div class="content">
            <!-- BEGIN LOGIN FORM -->
            <form class="login-form" method="POST">
                <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                <h3 class="form-title font-green">登录系统</h3>
                <div class="form-group">
                    <input class="form-control form-control-solid" type="text" placeholder="请输入用户名" name="username" />
                </div>
                <div class="form-group">
                    <input class="form-control form-control-solid" type="password" placeholder="请输入登录密码" name="password" />
                </div>
                <button type="button" class="btn btn-info dropdown-toggle" style="float:right">登录</button>
            </form>
        </div>
        <!-- BEGIN CORE PLUGINS -->
        <script src="../assets/global/plugins/jquery.min.js" type="text/javascript"></script>
    </body>
    <script type="text/javascript">
        $(function(){
            $('.login-form button').click(function(){
                submitLogin();
            });

            $(document).keypress(function(e) {  
                if(e.which == 13) {  
                    submitLogin();
                }  
            });


            var submitLogin = function(){
                var data = $('.login-form').serializeArray();
                $.post('/guest/login', data, function(response){
                    var code = response.code;
                    if (code == '0') {
                        alert('登录成功!');
                        window.location.href = '/';
                    } else {
                        var msg = response.msg;
                        alert(msg);
                    }
                }, 'JSON');
            }
        })
    </script>
</html>