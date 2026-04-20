<?php
header('Content-Type: application/json');

$host = 'sql100.infinityfree.com';
$db   = 'if0_41711637_xyz';
$user = 'if0_41711637';
$pass = 'xOAWNxbCu1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recibir qué acción queremos hacer (1: Crear, 2: Editar, 3: Eliminar, 4: Listar)
    $opcion = $_POST['opcion'] ?? '';

    switch ($opcion) {

        case '1': // CREAR AULA
            $sql  = "INSERT INTO AULA (NIVEL, GRADO, SECCION, VACANTES_TOTALES, VACANTES_DISPONIBLES)
                    VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['nivel'],
                $_POST['grado'],
                $_POST['seccion'],
                $_POST['vacantes_totales'],
                $_POST['vacantes_disponibles']
            ]);
            echo json_encode(["exito" => true, "mensaje" => "Aula registrada correctamente."]);
            break;

        case '2': // EDITAR AULA
            $sql  = "UPDATE AULA SET NIVEL=?, GRADO=?, SECCION=?,
                    VACANTES_TOTALES=?, VACANTES_DISPONIBLES=?
                    WHERE ID_AULA=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['nivel'],
                $_POST['grado'],
                $_POST['seccion'],
                $_POST['vacantes_totales'],
                $_POST['vacantes_disponibles'],
                $_POST['id_aula']
            ]);
            echo json_encode(["exito" => true, "mensaje" => "Aula actualizada correctamente."]);
            break;

        case '3': // ELIMINAR AULA
            $sql  = "DELETE FROM AULA WHERE ID_AULA = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_POST['id_aula']]);
            echo json_encode(["exito" => true, "mensaje" => "Aula eliminada correctamente."]);
            break;

        case '4': // LISTAR AULAS
            // Seleccionamos todos los campos y los ordenamos del más reciente al más antiguo
            $sql  = "SELECT ID_AULA, NIVEL, GRADO, SECCION, VACANTES_TOTALES, VACANTES_DISPONIBLES
                    FROM AULA ORDER BY ID_AULA DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            // fetchAll(PDO::FETCH_ASSOC) convierte los resultados en un formato que JSON entiende perfectamente
            $aulas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($aulas);
            break;

        default:
            echo json_encode(["exito" => false, "mensaje" => "Opción no válida."]);
    }

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error BD: " . $e->getMessage()]);
}
?>