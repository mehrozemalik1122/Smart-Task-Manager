<?php

session_start();
header("Content-Type: application/json");

include __DIR__ . '/../db/db.php';
include __DIR__ . '/../helpers/response.php';

// Clear the session
session_destroy();

jsonResponse(["success" => true]);
