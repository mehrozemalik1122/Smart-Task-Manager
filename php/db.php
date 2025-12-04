<?php
$host = "localhost";
$user = "root";
$pass = "mehroze123@sql";
$dbname = "task_manager";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed."]));
}
?>