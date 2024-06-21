<?php
require 'pdo.php';
require 'crossDomain.php';
$data = $_GET;
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $title =isset($data["title"]) ? $data["title"] : "";
    $type =isset($data["type"]) ? $data["type"] : "";
    $sql = "select * from archives where is_recycle_bin=? ";
    $prepare = array(1);
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
    //删除
    if ($data["action"] == "delete") {
        $id = $data["id"];
        $sql = "delete from archives where id=?";
        $res->deleteDb($sql, array($id));
        exit(json_encode(array(
            "code" => 200,
            "message" => "删除成功"
        )));
    }
    //恢复
    if ($data["action"] == "restore") {
        $id = $data["id"];
        $sql = "update archives set is_recycle_bin = ? where id = ?";
        $res->update($sql, array(0,$id));
        exit(json_encode(array(
            "code" => 200,
            "message" => "恢复成功"
        )));
    }
     //批量恢复
        if ($data["action"] == "batchRestore") {
            $ids = $data["ids"];
            $sql = "update archives set is_recycle_bin = ? where id = ?";
            foreach ($ids as $id) {
                $res->update($sql, array(
                    0,
                    $id
                ));
            }
            exit(json_encode(array(
                "code" => 200,
                "message" => "恢复成功"
            )));
        }
}
?>