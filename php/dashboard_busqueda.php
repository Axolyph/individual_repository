<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'MATRICULA';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    $opcion = $_GET['opcion'] ?? $_POST['opcion'] ?? '';

    // ── BÚSQUEDA GLOBAL ──────────────────────────────────
    if ($opcion === 'buscar') {
        $q = '%' . trim($_GET['q'] ?? '') . '%';

        $alumnos = $pdo->prepare("
            SELECT ID_ALUMNO as id, CONCAT(NOMBRES,' ',APELLIDOS) as texto,
                   DNI_ALUMNO as detalle, 'alumno' as tipo
            FROM ALUMNO
            WHERE NOMBRES LIKE ? OR APELLIDOS LIKE ? OR DNI_ALUMNO LIKE ?
            LIMIT 5");
        $alumnos->execute([$q, $q, $q]);

        $matriculas = $pdo->prepare("
            SELECT m.ID_MATRICULA as id,
                   CONCAT(a.NOMBRES,' ',a.APELLIDOS) as texto,
                   CONCAT(c.NOMBRE_CURSO,' — ',m.ESTADO) as detalle,
                   'matricula' as tipo
            FROM MATRICULA m
            JOIN ALUMNO a ON a.ID_ALUMNO = m.ID_ALUMNO
            JOIN CURSO  c ON c.ID_CURSO  = m.ID_CURSO
            WHERE a.NOMBRES LIKE ? OR a.APELLIDOS LIKE ? OR c.NOMBRE_CURSO LIKE ?
            LIMIT 5");
        $matriculas->execute([$q, $q, $q]);

        $pagos = $pdo->prepare("
            SELECT p.ID_PAGO as id,
                   CONCAT(a.NOMBRES,' ',a.APELLIDOS) as texto,
                   CONCAT(p.CONCEPTO,' — S/. ',p.MONTO) as detalle,
                   'pago' as tipo
            FROM PAGO p
            JOIN MATRICULA m ON m.ID_MATRICULA = p.ID_MATRICULA
            JOIN ALUMNO    a ON a.ID_ALUMNO    = m.ID_ALUMNO
            WHERE a.NOMBRES LIKE ? OR a.APELLIDOS LIKE ? OR p.CONCEPTO LIKE ?
            LIMIT 5");
        $pagos->execute([$q, $q, $q]);

        echo json_encode([
            'alumnos'    => $alumnos->fetchAll(PDO::FETCH_ASSOC),
            'matriculas' => $matriculas->fetchAll(PDO::FETCH_ASSOC),
            'pagos'      => $pagos->fetchAll(PDO::FETCH_ASSOC),
        ]);
    }

    // ── NOTIFICACIONES ───────────────────────────────────
    elseif ($opcion === 'notificaciones') {
        $matriculasPendientes = $pdo->query("
            SELECT COUNT(*) as total FROM MATRICULA WHERE ESTADO = 'Pendiente'"
        )->fetch(PDO::FETCH_ASSOC)['total'];

        $pagosPendientes = $pdo->query("
            SELECT COUNT(*) as total FROM PAGO WHERE ESTADO = 'Pendiente'"
        )->fetch(PDO::FETCH_ASSOC)['total'];

        $ultimas = $pdo->query("
            SELECT CONCAT(a.NOMBRES,' ',a.APELLIDOS) as alumno,
                   m.ESTADO, m.FECHA_MATRICULA
            FROM MATRICULA m
            JOIN ALUMNO a ON a.ID_ALUMNO = m.ID_ALUMNO
            ORDER BY m.ID_MATRICULA DESC LIMIT 5"
        )->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'matriculasPendientes' => $matriculasPendientes,
            'pagosPendientes'      => $pagosPendientes,
            'ultimas'              => $ultimas,
            'total'                => $matriculasPendientes + $pagosPendientes
        ]);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>