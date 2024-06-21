<?php
header('Content-Type: text/html; charset=utf-8');
class DbClass {
    public $serverName; //数据库地址
    public $userName; //用户名
    public $pwd; //密码
    public $dbName; //数据库名
    public $pdo;
    public function __construct($serverName, $userName, $pwd, $dbName) {
        $this->serverName = $serverName;
        $this->userName = $userName;
        $this->pwd = $pwd;
        $this->dbName = $dbName;
        $this->pdo = new PDO("mysql:host=$serverName;dbname=$dbName", $userName, $pwd);
        // try{
        //   echo "成功连接数据库";
        // }catch(PDOException $e){
        //     echo "连接失败";
        // }
        
    }
    //查询
    public function select($sql, $data) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($data);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
    //新增
    public function insert($sql, $data) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($data);
    }
    //删除
    public function deleteDb($sql, $ids) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($ids);
    }
    //修改
    public function update($sql, $data) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($data);
    }
}
$res = new DbClass("localhost", "6_4_15_19", "b2aKcib6pj7Hm2J5", "6_4_15_19");
?>

