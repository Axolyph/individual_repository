<?php
header('Content-Type: application/json');

$host = 'sql100.infinityfree.com';
$db   = 'if0_41711637_xyz';
$user = 'if0_41711637';
$pass = 'xOAWNxbCu1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $opcion = $_POST['opcion'] ?? '';

    switch ($opcion) {

        case '1': // GUARDAR DATOS DEL COLEGIO
            // Usamos INSERT ... ON DUPLICATE KEY UPDATE para insertar si no existe o actualizar si ya existe
            $claves = ['nombre_colegio', 'direccion', 'telefono', 'correo'];
            foreach ($claves as $clave) {
                if (isset($_POST[$clave])) {
                    $sql  = "INSERT INTO CONFIGURACION (CLAVE, VALOR) VALUES (?, ?)
                             ON DUPLICATE KEY UPDATE VALOR = VALUES(VALOR)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$clave, $_POST[$clave]]);
                }
            }
            echo json_encode(["exito" => true, "mensaje" => "Datos del colegio actualizados correctamente."]);
            break;

        case '2': // GUARDAR AÑO ESCOLAR
            $sql  = "INSERT INTO CONFIGURACION (CLAVE, VALOR) VALUES ('anio_escolar', ?)
                     ON DUPLICATE KEY UPDATE VALOR = VALUES(VALOR)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_POST['anio_escolar']]);
            echo json_encode(["exito" => true, "mensaje" => "Año escolar actualizado correctamente."]);
            break;

        case '3': // CAMBIAR CONTRASEÑA DEL ADMINISTRADOR
            // Buscar al usuario administrador en la tabla USUARIO
            $sql  = "SELECT ID_USUARIO, PASSWORD_HASH FROM USUARIO WHERE USERNAME = 'admin' LIMIT 1";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$usuario) {
                echo json_encode(["exito" => false, "mensaje" => "Usuario administrador no encontrado."]);
                break;
            }

            // Verificar contraseña actual
            if (!password_verify($_POST['password_actual'], $usuario['PASSWORD_HASH'])) {
                echo json_encode(["exito" => false, "mensaje" => "La contraseña actual es incorrecta."]);
                break;
            }

            // Actualizar con la nueva contraseña hasheada
            $nuevoHash = password_hash($_POST['password_nueva'], PASSWORD_DEFAULT);
            $sql       = "UPDATE USUARIO SET PASSWORD_HASH = ? WHERE ID_USUARIO = ?";
            $stmt      = $pdo->prepare($sql);
            $stmt->execute([$nuevoHash, $usuario['ID_USUARIO']]);
            echo json_encode(["exito" => true, "mensaje" => "Contraseña actualizada correctamente."]);
            break;

        case '4': // CARGAR CONFIGURACIÓN ACTUAL (para pre-llenar el formulario)
            $sql  = "SELECT CLAVE, VALOR FROM CONFIGURACION";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Convertir array de filas a un objeto clave => valor
            $config = [];
            foreach ($rows as $row) {
                $config[$row['CLAVE']] = $row['VALOR'];
            }
            echo json_encode($config);
            break;

        default:
            echo json_encode(["exito" => false, "mensaje" => "Opción no válida."]);
    }

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error BD: " . $e->getMessage()]);
}
?>