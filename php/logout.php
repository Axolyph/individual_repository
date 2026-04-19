<?php
// =========================================================
//  logout.php — Cierra la sesión y redirige al login
// =========================================================
session_start();
session_destroy();
 
header('Content-Type: application/json');
echo json_encode(['exito' => true]);
?>