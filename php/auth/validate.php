<?php

session_start([
    'cookie_path' => '/',
    'cookie_httponly' => false,
    'cookie_samesite' => 'Lax'
]);
header("Content-Type: application/json");

include __DIR__ . '/../db/db.php';
include __DIR__ . '/../helpers/response.php';

if (!isset($_SESSION['user_id'])) {
    jsonResponse(["authenticated" => false], 401);
}

echo json_encode([
    "authenticated" => true,
    "user_id" => $_SESSION['user_id'],
    "user_name" => $_SESSION['user_name']
]);
