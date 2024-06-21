 <?php
require 'pdo.php';  
require 'authcode.php';
$isToken = false;
$user = null;
$key = 'https://121.41.108.225';
if ($_SERVER['HTTP_TOKEN']) {
    $token = $_SERVER["HTTP_TOKEN"]; //获取token
    $decryption = json_decode(authcode($token, 'DECODE', $key, 0) , true); //解密
    $user = $decryption["name"];
    $r = $res-> select("select * from user_test where name = ?",array($user));
    if(count($r) == 1 ){
        $isToken = true;
    }
    else{
        $isToken = false;
    }
}
?>
