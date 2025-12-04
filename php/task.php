<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get':
        getTasks($conn);
        break;

    case 'add':
        addTask($conn);
        break;

    case 'update':
        updateTask($conn);
        break;

    case 'delete':
        deleteTask($conn);
        break;

    default:
        echo json_encode(["error" => "Invalid or missing action."]);
        break;
}


function getTasks($conn) {
    $result = $conn->query("SELECT * FROM tasks ORDER BY id DESC");
    $tasks = [];

    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }

    echo json_encode($tasks);
}

function addTask($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $text = $conn->real_escape_string($data['text']);

    $query = "INSERT INTO tasks (text, completed) VALUES ('$text', 0)";
    if ($conn->query($query)) {
        $id = $conn->insert_id;
        echo json_encode(["id" => $id, "text" => $text, "completed" => 0]);
    } else {
        echo json_encode(["error" => "Failed to add task."]);
    }
}

function updateTask($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data['id']);
    $completed = $data['completed'] ? 1 : 0;

    $query = "UPDATE tasks SET completed=$completed WHERE id=$id";
    if ($conn->query($query)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Failed to update task."]);
    }
}

function deleteTask($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data['id']);

    $query = "DELETE FROM tasks WHERE id=$id";
    if ($conn->query($query)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Failed to delete task."]);
    }
}
?>
