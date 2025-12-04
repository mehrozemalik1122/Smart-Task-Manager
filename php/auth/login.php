<?php

session_start([
    'cookie_path' => '/',
    'cookie_httponly' => false,
    'cookie_samesite' => 'Lax'
]);
header("Content-Type: application/json");

include __DIR__ . '/../db/db.php';
include __DIR__ . '/../helpers/response.php';

$data = json_decode(file_get_contents("php://input"), true);

validateRequiredFields($data, ['email', 'password']);



$email = $conn->real_escape_string($data['email']);

$pwd = $data['password'];



$result = $conn->query("SELECT id, password_hash, name FROM users WHERE email='$email' LIMIT 1");

if (!$result || $result->num_rows == 0) {

    http_response_code(401);

    echo json_encode(["error"=>"Invalid credentials"]);

    exit;

}



$user = $result->fetch_assoc();

if (password_verify($pwd, $user['password_hash'])) {

    // set session

    $_SESSION['user_id'] = $user['id'];

    $_SESSION['user_name'] = $user['name'];

    echo json_encode(["success"=>true, "id"=>$user['id'], "name"=>$user['name']]);

} else {

    http_response_code(401);

    echo json_encode(["error"=>"Invalid credentials"]);

}

?>
