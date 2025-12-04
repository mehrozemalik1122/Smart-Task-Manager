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

$sql = "SELECT id, text, datetime, completed, deleted, reminded FROM tasks WHERE user_id=$user_id ORDER BY id DESC";

$result = $conn->query($sql);



$allTasks = [];
$completedTasks = [];
$deletedTasks = [];

while ($row = $result->fetch_assoc()) {
    if ($row['deleted'] == 1) {
        $deletedTasks[] = $row;
    } elseif ($row['completed'] == 1) {
        $completedTasks[] = $row;
    } else {
        $allTasks[] = $row;
    }
}

echo json_encode([
    'all' => $allTasks,
    'completed' => $completedTasks,
    'deleted' => $deletedTasks
]);

?>
