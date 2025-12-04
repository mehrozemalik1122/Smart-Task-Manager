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

// Hard delete: actually remove from database
$query = "DELETE FROM tasks WHERE id=$id AND user_id=$user_id";

if ($conn->query($query)) {
    echo json_encode(["success"=>true]);
} else {
    http_response_code(500);
    echo json_encode(["error"=>"Failed to permanently remove task"]);
}

?>