<?php
// =========================================================
//  portal_estudiante.php — Datos del alumno autenticado
// =========================================================
session_start(); // ← asegúrate que sea la primera línea
header('Content-Type: application/json');

if (!isset($_SESSION['id']) || ($_SESSION['rol'] ?? '') !== 'usuario') {
    echo json_encode(['exito' => false, 'mensaje' => 'No autenticado.']);
    exit;
}

$host = 'sql100.infinityfree.com';
$db   = 'if0_41711637_xyz';
$user = 'if0_41711637';
$pass = 'xOAWNxbCu1';

$opcion = intval($_POST['opcion'] ?? 1);
$idAlumno = intval($_SESSION['id']);

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8",
        $user, $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // ── Datos del alumno ──────────────────────────────
    $stmtA = $pdo->prepare(
        "SELECT ID_ALUMNO, DNI_ALUMNO, NOMBRES, APELLIDOS,
                FECHA_NACIMIENTO, EDAD, GENERO, DIRECCION,
                CELULAR, CORREO, NOMBRE_APODERADO,
                CELULAR_APODERADO, USERNAME, ESTADO
         FROM ALUMNO WHERE ID_ALUMNO = :id LIMIT 1"
    );
    $stmtA->execute([':id' => $idAlumno]);
    $alumno = $stmtA->fetch(PDO::FETCH_ASSOC);

    if (!$alumno) {
        echo json_encode(['exito' => false, 'mensaje' => 'Alumno no encontrado.']);
        exit;
    }

    // ── Matrículas del alumno ─────────────────────────
    $stmtM = $pdo->prepare(
        "SELECT m.ID_MATRICULA, c.NOMBRE_CURSO,
                m.FECHA_MATRICULA, m.FECHA_ESCOLAR,
                m.TURNO, m.ESTADO, m.OBSERVACIONES
         FROM MATRICULA m
         JOIN CURSO c ON c.ID_CURSO = m.ID_CURSO
         WHERE m.ID_ALUMNO = :id
         ORDER BY m.FECHA_MATRICULA DESC"
    );
    $stmtM->execute([':id' => $idAlumno]);
    $matriculas = $stmtM->fetchAll(PDO::FETCH_ASSOC);

    // ── Pagos del alumno (vía sus matrículas) ─────────
    $stmtP = $pdo->prepare(
        "SELECT p.ID_PAGO, p.CONCEPTO, p.MONTO,
                p.FECHA_PAGO, p.METODO_PAGO,
                p.ESTADO, p.OBSERVACIONES
         FROM PAGO p
         JOIN MATRICULA m ON m.ID_MATRICULA = p.ID_MATRICULA
         WHERE m.ID_ALUMNO = :id
         ORDER BY p.FECHA_PAGO DESC"
    );
    $stmtP->execute([':id' => $idAlumno]);
    $pagos = $stmtP->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'exito'      => true,
        'alumno'     => $alumno,
        'matriculas' => $matriculas,
        'pagos'      => $pagos
    ]);

} catch (PDOException $e) {
    echo json_encode(['exito' => false, 'mensaje' => 'Error DB: ' . $e->getMessage()]);
}
?>