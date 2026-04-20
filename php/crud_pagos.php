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

        case '1': // CREAR PAGO
            $sql  = "INSERT INTO PAGO (ID_MATRICULA, CONCEPTO, MONTO, FECHA_PAGO, METODO_PAGO, ESTADO, OBSERVACIONES)
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['id_matricula'],
                $_POST['concepto'],
                $_POST['monto'],
                $_POST['fecha_pago'],
                $_POST['metodo_pago'],
                $_POST['estado'],
                $_POST['observaciones']
            ]);
            echo json_encode(["exito" => true, "mensaje" => "Pago registrado correctamente."]);
            break;

        case '2': // EDITAR PAGO
            $sql  = "UPDATE PAGO SET ID_MATRICULA=?, CONCEPTO=?, MONTO=?,
                    FECHA_PAGO=?, METODO_PAGO=?, ESTADO=?, OBSERVACIONES=?
                    WHERE ID_PAGO=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['id_matricula'],
                $_POST['concepto'],
                $_POST['monto'],
                $_POST['fecha_pago'],
                $_POST['metodo_pago'],
                $_POST['estado'],
                $_POST['observaciones'],
                $_POST['id_pago']
            ]);
            echo json_encode(["exito" => true, "mensaje" => "Pago actualizado correctamente."]);
            break;

        case '3': // ELIMINAR PAGO
            $sql  = "DELETE FROM PAGO WHERE ID_PAGO = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_POST['id_pago']]);
            echo json_encode(["exito" => true, "mensaje" => "Pago eliminado correctamente."]);
            break;

        case '4': // LISTAR PAGOS
            $sql  = "SELECT 
                        p.ID_PAGO,
                        p.ID_MATRICULA,
                        CONCAT(a.NOMBRES, ' ', a.APELLIDOS) AS NOMBRE_ALUMNO,
                        c.NOMBRE_CURSO,
                        p.CONCEPTO,
                        p.MONTO,
                        p.FECHA_PAGO,
                        p.METODO_PAGO,
                        p.ESTADO,
                        p.OBSERVACIONES
                    FROM PAGO p
                    INNER JOIN MATRICULA m ON p.ID_MATRICULA = m.ID_MATRICULA
                    INNER JOIN ALUMNO    a ON m.ID_ALUMNO    = a.ID_ALUMNO
                    INNER JOIN CURSO     c ON m.ID_CURSO     = c.ID_CURSO
                    ORDER BY p.ID_PAGO DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $pagos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($pagos);
            break;

        case '5': // CARGAR MATRÍCULAS PARA EL SELECT DEL MODAL
            $sql = "SELECT 
                        m.ID_MATRICULA,
                        CONCAT(a.NOMBRES, ' ', a.APELLIDOS, ' - ', c.NOMBRE_CURSO) AS DESCRIPCION
                    FROM MATRICULA m
                    INNER JOIN ALUMNO a ON m.ID_ALUMNO = a.ID_ALUMNO
                    INNER JOIN CURSO  c ON m.ID_CURSO  = c.ID_CURSO
                    WHERE m.ESTADO IN ('Activo', 'Pendiente')
                    ORDER BY a.NOMBRES";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $matriculas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["matriculas" => $matriculas]);
            break;

        default:
            echo json_encode(["exito" => false, "mensaje" => "Opción no válida."]);
    }

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error BD: " . $e->getMessage()]);
}
?>