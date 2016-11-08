# laravel5.3-angularJS-Metronic
使用larave5.3 + angularJS + Metronic 实现的后台管理框架模型。

laravel 负责后台业务逻辑的处理，提供数据接口给前端使用，5.3跟之前的版本有点不同，建议先看下5.3版本文档。
angularJS 负责前端业务逻辑以及请求数据。
Metronic 作为一名phper并不懂得专业的前端技术，只能靠前端框架实现UI。

# 文件介绍
routes/web.php  -- 用来配置接口路由的
public/js/jxc_admin_router.js -- 用来存ng的路由

初步能实现与后台接口的对接（数据库未实现），不同页面的跳转。