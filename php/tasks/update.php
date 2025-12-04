<?php

session_start([
    'cookie_path' => '/',
    'cookie_httponly' => false,
    'cookie_samesite' => 'Lax'
]);
header("Content-Type: application/json");

include __DIR__ . '/../db/db.php';
include __DIR__ . '/../helpers/response.php';

$user_id = requireAuth();

$data = json_decode(file_get_contents("php://input"), true);

validateRequiredFields($data, ['id']);



$id = intval($data['id']);

$fields = [];

if (isset($data['completed'])) {

    $fields[] = "completed=" . ($data['completed'] ? 1 : 0);

}

if (isset($data['deleted'])) {

    $fields[] = "deleted=" . ($data['deleted'] ? 1 : 0);

}

if (isset($data['reminded'])) {

    $fields[] = "reminded=" . ($data['reminded'] ? 1 : 0);

}

if (isset($data['datetime'])) {

    if ($data['datetime']) {
        $date = new DateTime($data['datetime']);
        $dt = $date->format('Y-m-d H:i:s');
        $fields[] = "datetime='$dt'";
    } else {
        $fields[] = "datetime=NULL";
    }

}



if (empty($fields)) {

    echo json_encode(["success"=>true]);

    exit;

}



$query = "UPDATE tasks SET " . implode(',', $fields) . " WHERE id=$id AND user_id=$user_id";

if ($conn->query($query)) {

    echo json_encode(["success"=>true]);

} else {

    http_response_code(500);

    echo json_encode(["error"=>"Failed to update task"]);

}

?>
