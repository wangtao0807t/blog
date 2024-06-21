<?php
// 允许所有域进行跨域请求
header('Access-Control-Allow-Origin: *');
// 允许的HTTP方法
header('Access-Control-Allow-Methods: *');
// 允许的头信息
header('Access-Control-Allow-Headers: *');
// 设置字符编码
header('Content-Type: text/html; charset=utf-8');
// 屏蔽warning信息
error_reporting(0);
?>