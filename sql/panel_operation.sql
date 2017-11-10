-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 120.25.94.93
-- Generation Time: 2017-11-10 14:54:02
-- 服务器版本： 5.7.20-0ubuntu0.16.04.1
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jxc`
--

-- --------------------------------------------------------

--
-- 表的结构 `panel_operation`
--

CREATE TABLE `panel_operation` (
  `id` int(10) UNSIGNED NOT NULL,
  `opt_route` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `opt_depict` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `fid` int(11) NOT NULL,
  `href` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `icon` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `menu_level` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `panel_operation`
--

INSERT INTO `panel_operation` (`id`, `opt_route`, `opt_depict`, `fid`, `href`, `icon`, `menu_level`, `order`, `deleted_at`) VALUES
(1, '', '首页', 0, '#/dashboard.html', 'icon-home', 0, 0, '2017-02-14 16:00:00'),
(2, '', '产品管理', 0, 'javascript:;', 'fa fa-database', 0, 1, NULL),
(3, '', '系统管理', 0, 'javascript:;', 'icon-settings', 0, 3, NULL),
(9, '', '产品管理', 2, '#/product_goods.html', 'fa fa-flask', 1, 11, NULL),
(11, '', '入库管理', 2, '#/product_into.html', 'fa fa-mail-forward', 1, 13, NULL),
(12, '', '出库管理', 2, '#/product_shipment.html', 'fa fa-mail-reply', 1, 14, NULL),
(13, '', '用户管理', 3, '#/sys_user.html', 'icon-users', 1, 21, NULL),
(14, 'product.product.createoredit', '添加或修改操作', 9, '', '', 2, 0, NULL),
(15, 'product.product.optenable', '启用或下架操作', 9, '', '', 2, 0, NULL),
(16, 'product.product.delete', '删除操作', 9, '', '', 2, 0, NULL),
(17, 'product.product.lists', '获取列表操作', 9, '', '', 2, 0, NULL),
(18, 'product.product.firm.lists', '获取厂商操作', 9, '', '', 2, 0, '2017-02-15 16:00:00'),
(19, 'product.firm.createoredit', '添加或修改操作', 10, '', '', 2, 0, NULL),
(20, 'product.firm.delete', '删除操作', 10, '', '', 2, 0, NULL),
(21, 'product.firm.lists', '获取列表操作', 10, '', '', 2, 0, NULL),
(22, 'product.into.lists', '获取列表操作', 11, '', '', 2, 0, NULL),
(23, 'product.into.products', '获取产品操作', 11, '', '', 2, 0, NULL),
(24, 'product.into.detail', '查看详情操作', 11, '', '', 2, 0, NULL),
(25, 'product.into.intoproduct', '入库操作', 11, '', '', 2, 0, NULL),
(26, 'sys.user.create', '创建用户操作', 13, '', '', 2, 0, NULL),
(27, 'sys.user.delete', '删除用户操作', 13, '', '', 2, 0, NULL),
(28, 'sys.user.lists', '获取列表操作', 13, '', '', 2, 0, NULL),
(29, 'sys.user.edit', '编辑用户操作', 13, '', '', 2, 0, NULL),
(30, '', '库存预警', 2, '#/product_warn.html', 'fa fa-warning', 1, 15, NULL),
(31, 'product.shipment.lists', '获取列表操作', 12, '', '', 2, 0, NULL),
(32, 'product.shipment.shipmentproduct', '出库操作', 12, '', '', 2, 0, NULL),
(33, 'product.shipment.detail', '出库详情操作', 12, '', '', 2, 0, NULL),
(34, 'product.shipment.confirm', '确认出库操作', 12, '', '', 2, 0, NULL),
(35, 'product.shipment.cancel', '撤销出库操作', 12, '', '', 2, 0, NULL),
(36, 'product.warn.lists', '获取列表操作', 30, '', '', 2, 0, NULL),
(37, '', '操作日志', 3, '#/sys_logs.html', 'fa fa-file-text', 1, 22, NULL),
(38, 'sys.logs.lists', '操作日志', 37, '', '', 2, 0, NULL),
(39, '', '系统设置', 3, '#/sys_settings.html', 'fa fa-gear', 1, 20, NULL),
(40, '', '统计管理', 0, 'javascript:;', 'fa fa-industry', 0, 2, NULL),
(41, '', '产品统计', 40, '#/statistical_product.html', 'fa fa-industry', 1, 401, NULL),
(42, '', '营业额统计', 40, '#/statistical_sales.html', 'fa fa-industry', 1, 402, NULL),
(44, 'statistical.product.lists', '产品统计-lists', 41, '', '', 2, 0, NULL),
(45, '', '分类管理', 2, '#/product_sort.html', 'fa fa-list', 1, 14, NULL),
(46, 'product.sort.createoredit', '添加或修改操作', 45, '', '', 2, 0, NULL),
(47, 'product.sort.delete', '删除操作', 45, '', '', 2, 0, NULL),
(48, 'product.sort.lists', '获取列表操作', 45, '', '', 2, 0, NULL),
(49, 'statistical.sales.lists', '销售额统计-lists', 42, '', '', 2, 0, NULL),
(50, 'settings.show_cost', '成本价查看权限', 39, '', '', 2, 0, NULL),
(52, 'settings.updatesettings', '启用自动流水号', 39, '', '', 2, 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `panel_operation`
--
ALTER TABLE `panel_operation`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `panel_operation`
--
ALTER TABLE `panel_operation`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
