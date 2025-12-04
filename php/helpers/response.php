<?php

function requireAuth() {
    if (!isset($_SESSION['user_id'])) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(["error" => "Authentication required"]);
        exit;
    }
    return $_SESSION['user_id'];
}

function jsonResponse($data, $statusCode = 200) {
    header('Content-Type: application/json');
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function validateRequiredFields($data, $requiredFields) {
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            jsonResponse(["error" => "Missing required field: $field"], 400);
        }
    }
}
