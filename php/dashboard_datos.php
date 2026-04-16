<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'MATRICULA';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $respuesta = [];

    // 1. OBTENER KPIs BÁSICOS
    // Total de Alumnos
    $stmt = $pdo->query("SELECT COUNT(*) AS total FROM ALUMNO");
    $respuesta['kpis']['totalAlumnos'] = $stmt->fetchColumn();

    // Total de Aulas y Vacantes Disponibles
    $stmt = $pdo->query("SELECT COUNT(*) AS totalAulas, SUM(VACANTES_DISPONIBLES) AS vacantesDisp FROM AULA");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $respuesta['kpis']['totalAulas'] = $row['totalAulas'] ?? 0;
    $respuesta['kpis']['vacantesDisp'] = $row['vacantesDisp'] ?? 0;

    // 2. DATOS PARA EL GRÁFICO 1: Alumnos por Género (Gráfico Circular/Pie)
    $stmt = $pdo->query("SELECT GENERO, COUNT(*) AS cantidad FROM ALUMNO GROUP BY GENERO");
    $generos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $respuesta['graficos']['genero'] = $generos;

    // 3. DATOS PARA EL GRÁFICO 2: Vacantes Totales vs Disponibles por Nivel (Gráfico de Barras)
    $stmt = $pdo->query("SELECT NIVEL, SUM(VACANTES_TOTALES) AS totales, SUM(VACANTES_DISPONIBLES) AS disponibles FROM AULA GROUP BY NIVEL");
    $niveles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $respuesta['graficos']['niveles'] = $niveles;

    echo json_encode(["exito" => true, "datos" => $respuesta]);

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error BD: " . $e->getMessage()]);
}
?>