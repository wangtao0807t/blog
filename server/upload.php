<?php
require 'pdo.php';
require 'crossDomain.php';
if (isset($_FILES["name"])) {
    $file = $_FILES["name"];
    if (is_uploaded_file($file['tmp_name'])) {
        // 是上传文件
        if (move_uploaded_file($file['tmp_name'], 'upload/' . $file['name'])) {
            exit(json_encode(array(
                "code" => 200,
                "message" => "文件保存成功",
                "data" => 'upload/' . $file['name']
            )));
        } else {
            echo '文件保存失败';
        }
    } else {
        return false;
    }
}
if (isset($_FILES["wangeditor-uploaded-image"])) {
    $file = $_FILES["wangeditor-uploaded-image"];
    if (is_uploaded_file($file['tmp_name'])) {
        // 是上传文件
        if (move_uploaded_file($file['tmp_name'], 'upload/' . $file['name'])) {
            $response = ['errno' => 0, 'data' => ["url" => 'http://121.41.108.225/upload/' . $file['name'], ], 'errmsg' => '上传成功。'];
            exit(json_encode($response));
        } else {
            $response = ['errno' => 1, "message" => "上传失败"];
            exit(json_encode($response));
        }
    } else {
        // 不是上传文件
        return false;
    }
}
?>




