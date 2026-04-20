<?php
// =========================================================
//  login.php — Autenticación dual: Administrador / Alumno
// =========================================================
header('Content-Type: application/json');
session_start();

$host = 'sql100.infinityfree.com';
$db   = 'if0_41711637_xyz';
$user = 'if0_41711637';
$pass = 'xOAWNxbCu1';

// Recibir datos del formulario
$rol      = trim($_POST['rol']      ?? '');
$username = trim($_POST['username'] ?? '');
$password =      $_POST['password'] ?? '';

// Validación básica
if (empty($rol) || empty($username) || empty($password)) {
    echo json_encode([
        'exito'   => false,
        'mensaje' => 'Por favor, completa todos los campos.'
    ]);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8",
        $user, $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // -------------------------------------------------------
    // CASO 1: LOGIN ADMINISTRADOR  →  tabla USUARIO
    // -------------------------------------------------------
    if ($rol === 'admin') {

        $stmt = $pdo->prepare(
            "SELECT ID, USERNAME, PASSWORD_HASH, ESTADO
             FROM USUARIO
             WHERE USERNAME = :username
             LIMIT 1"
        );
        $stmt->execute([':username' => $username]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$admin) {
            echo json_encode(['exito' => false, 'mensaje' => 'Usuario o contraseña incorrectos.']);
            exit;
        }

        if (!$admin['ESTADO']) {
            echo json_encode(['exito' => false, 'mensaje' => 'Esta cuenta de administrador está desactivada.']);
            exit;
        }

        if (!password_verify($password, $admin['PASSWORD_HASH'])) {
            echo json_encode(['exito' => false, 'mensaje' => 'Usuario o contraseña incorrectos.']);
            exit;
        }

        // Sesión de administrador
        $_SESSION['id']       = $admin['ID'];
        $_SESSION['username'] = $admin['USERNAME'];
        $_SESSION['rol']      = 'admin';

        echo json_encode([
            'exito'     => true,
            'mensaje'   => '¡Bienvenido, ' . $admin['USERNAME'] . '!',
            'redirigir' => 'dashboard.php'
        ]);
        exit;
    }

    // -------------------------------------------------------
    // CASO 2: LOGIN ESTUDIANTE  →  tabla ALUMNO
    // -------------------------------------------------------
    if ($rol === 'usuario') {

        $stmt = $pdo->prepare(
            "SELECT ID_ALUMNO, NOMBRES, APELLIDOS, USERNAME, PASSWORD_HASH, ESTADO
             FROM ALUMNO
             WHERE USERNAME = :username
             LIMIT 1"
        );
        $stmt->execute([':username' => $username]);
        $alumno = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$alumno) {
            echo json_encode(['exito' => false, 'mensaje' => 'Usuario o contraseña incorrectos.']);
            exit;
        }

        if ($alumno['ESTADO'] === 'Inactivo') {
            echo json_encode(['exito' => false, 'mensaje' => 'Tu cuenta aún no ha sido activada. Consulta a administración.']);
            exit;
        }

        if (!password_verify($password, $alumno['PASSWORD_HASH'])) {
            echo json_encode(['exito' => false, 'mensaje' => 'Usuario o contraseña incorrectos.']);
            exit;
        }

        // Sesión de estudiante
        $_SESSION['id']       = $alumno['ID_ALUMNO'];
        $_SESSION['username'] = $alumno['USERNAME'];
        $_SESSION['nombre']   = $alumno['NOMBRES'] . ' ' . $alumno['APELLIDOS'];
        $_SESSION['rol']      = 'usuario';

        echo json_encode([
            'exito'     => true,
            'mensaje'   => '¡Bienvenido, ' . $alumno['NOMBRES'] . '!',
            'redirigir' => 'portal.php'   // ajusta esta ruta si tu portal tiene otro nombre
        ]);
        exit;
    }

    // Rol desconocido
    echo json_encode(['exito' => false, 'mensaje' => 'Rol no reconocido.']);

} catch (PDOException $e) {
    echo json_encode(['exito' => false, 'mensaje' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>