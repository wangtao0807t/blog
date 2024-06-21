<?php
error_reporting(0);
require 'pdo.php';
require 'crossDomain.php';
$data = $_GET;
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $title = isset($data["title"]) ? $data["title"] : "";
    $type = isset($data["type"]) ? $data["type"] : "";
    $sql = "select * from archives where is_recycle_bin=? ";
    $prepare = array(
        0
    );
    if ($title != "") {
        $sql = $sql . ($and ? ' AND ' : '') . 'and title=?';
        $prepare[] = $title;
    }
    if ($type != "") {
        $sql = $sql . ($and ? ' AND ' : '') . 'and type=?';
        $prepare[] = $type;
    }
    $result = $res->select($sql, $prepare);
    exit(json_encode(array(
        "code" => 200,
        "data" => $result
    )));
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);
    $title = $data["values"]["title"];
    $type = $data["values"]["type"];
    $action = $data["action"];
    $content = $data["editorValue"];
    $author = 'tao';
    $img_path = $data["imgPath"] == "" ? "" : 'http://121.41.108.225/' . $data["imgPath"];
    // $img_path == "" ? "" : 'http://121.41.108.225/' . $data["imgPath"] ;
    //新增
    if ($action == "add") {
        $sql = "insert into archives (title,author,type,content,img_path) values(?,?,?,?,?)";
        $res->insert($sql, array(
            $title,
            $author,
            $type,
            $content,
            $img_path
        ));
        exit(json_encode(array(
            "code" => 200,
            "message" => "新增成功"
        )));
    }
    //删除后进入回收站
    if ($data["action"] == "delete") {
        $id = $data["id"];
        $sql = "update archives set is_recycle_bin = ? where id = ?";
        $res->update($sql, array(
            1,
            $id
        ));
        exit(json_encode(array(
            "code" => 200,
            "message" => "删除成功"
        )));
    }
    //批量删除
        if ($data["action"] == "batchDel") {
            $ids = $data["ids"];
            $sql = "update archives set is_recycle_bin = ? where id = ?";
            foreach ($ids as $id) {
                $res->update($sql, array(
                    1,
                    $id
                ));
            }
            exit(json_encode(array(
                "code" => 200,
                "message" => "修改成功"
            )));
        }
    //修改
    if ($data["action"] == "update") {
        $id = $data["id"];
        $sql = "update archives set title = ?,type = ?,content = ?,img_path = ? where id = ?";
        $res->update($sql, array(
            $title,
            $type,
            $content,
            $img_path,
            $id
        ));
        exit(json_encode(array(
            "code" => 200,
            "message" => "修改成功"
        )));
    }
}
?>










