<?php

header("Content-Type: application/json");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    include __DIR__ . '/../db/db.php';
    include __DIR__ . '/../helpers/response.php';
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        throw new Exception("Invalid JSON data received");
    }
    
    validateRequiredFields($data, ['email', 'password', 'name']);
    
    $email = $conn->real_escape_string($data['email']);
    $name  = $conn->real_escape_string($data['name']);
    $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
    
    // Check existing
    $check = $conn->query("SELECT id FROM users WHERE email='$email' LIMIT 1");
    
    if ($check && $check->num_rows > 0) {
        http_response_code(409);
        echo json_encode(["error"=>"Email already registered"]);
        exit;
    }
    
    $query = "INSERT INTO users (name, email, password_hash) VALUES ('$name', '$email', '$password_hash')";
    
    if ($conn->query($query)) {
        echo json_encode(["success"=>true, "id"=>$conn->insert_id]);
    } else {
        throw new Exception("Database error: " . $conn->error);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error"=>"Signup failed: " . $e->getMessage()]);
}
?>