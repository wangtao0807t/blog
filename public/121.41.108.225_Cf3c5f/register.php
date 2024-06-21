<?php
require 'crossDomain.php';
require 'pdo.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);
    $name = $data["name"];
    $password = $data["password"];
    $result = $res-> select('select * from user where name = ?',array($name));
    if (count($result) > 0) {
        exit(json_encode(array(
            "code" => 500,
            "message" => "该账号已被注册,请换个用户名"
        )));
    } else {
        $res->insert("insert into user(name,password) values(?,?)", array(
            $name,
            $password
        ));
        exit(json_encode(array(
            "code" => 200,
            "message" => "注册成功"
        )));
    }
}
?>
