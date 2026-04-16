<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'MATRICULA';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $datos = [];
    $stmt = $pdo->query("SELECT COUNT(*) AS total FROM ALUMNO");
    $datos['kpis']['totalAlumnos'] = (int)$stmt->fetchColumn();
    $stmt = $pdo->query("SELECT COUNT(*) AS total FROM AULA");
    $datos['kpis']['totalAulas'] = (int)$stmt->fetchColumn();
    $stmt = $pdo->query("SELECT COALESCE(SUM(VACANTES_DISPONIBLES), 0) AS vacantesDisp FROM AULA");
    $datos['kpis']['vacantesDisp'] = (int)$stmt->fetchColumn();
    $stmt = $pdo->query("SELECT GENERO, COUNT(*) AS cantidad FROM ALUMNO GROUP BY GENERO ORDER BY GENERO");
    $datos['graficos']['generos'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt = $pdo->query("SELECT CONCAT(NIVEL, ' ', GRADO) AS nivel, SUM(VACANTES_TOTALES) AS totales, SUM(VACANTES_DISPONIBLES) AS disponibles FROM AULA GROUP BY NIVEL, GRADO ORDER BY FIELD(NIVEL, 'Inicial', 'Primaria', 'Secundaria'), GRADO");
    $datos['graficos']['niveles'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['exito' => true, 'datos' => $datos]);
} catch (PDOException $e) {
    echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
}
