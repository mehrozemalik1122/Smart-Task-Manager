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

$input = json_decode(file_get_contents("php://input"), true);

validateRequiredFields($input, ['text', 'datetime']);



$text = $conn->real_escape_string($input['text']);

$datetime = NULL;
if (isset($input['datetime']) && $input['datetime']) {
    $date = new DateTime($input['datetime']);
    $datetime = $date->format('Y-m-d H:i:s');
}



$query = "INSERT INTO tasks (user_id, text, datetime, completed, deleted, reminded) VALUES ($user_id, '$text', " . ($datetime ? "'$datetime'" : "NULL") . ", 0, 0, 0)";

if ($conn->query($query)) {

    $id = $conn->insert_id;

    echo json_encode(["id"=>$id, "text"=>$text, "datetime"=>$datetime, "completed"=>0, "deleted"=>0, "reminded"=>0]);

} else {

    http_response_code(500);

    echo json_encode(["error"=>"Failed to add task"]);

}

?>
