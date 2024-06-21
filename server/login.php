 <?php
require 'pdo.php';
require 'crossDomain.php';
require 'authcode.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);
    $name = $data["name"];
    $password = $data["password"];
    $result = $res->select('select * from user where name =? and password=?', array(
        $name,
        $password
    ));
    if (count($result) == 1) {
        $key = 'https://121.41.108.225';
        $token = authcode($jsonData, 'ENCODE', $key, 0); //加密 注：第一个参数是字符串类型 json是字符串类型
        exit(json_encode(array(
            "code" => 200,
            "message" => "登录成功",
            "token" => $token,
            "isAdministrators" =>$result[0]["is_administrators"]
        )));
    } else {
        exit(json_encode(array(
            "code" => 500,
            "message" => "账号或密码错误"
        )));
    }
}
?>

