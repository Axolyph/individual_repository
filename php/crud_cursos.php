<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'MATRICULA';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recibir qué acción queremos hacer (1: Crear, 2: Editar, 3: Eliminar, 4: Listar)
    $opcion = $_POST['opcion'] ?? '';

    switch ($opcion) {

        case '1': // CREAR CURSO
            $sql  = "INSERT INTO CURSO (NOMBRE_CURSO, DESCRIPCION, NIVEL, GRADO, HORAS_SEMANALES, ESTADO)
                    VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['nombre_curso'],
                $_POST['descripcion'],
                $_POST['nivel'],
                $_POST['grado'],
                $_POST['horas_semanales'],
                $_POST['estado']
            ]);
            echo json_encode(["exito" => true, "mensaje" => "Curso registrado correctamente."]);
            break;

        case '2': // EDITAR CURSO
            $sql  = "UPDATE CURSO SET NOMBRE_CURSO=?, DESCRIPCION=?, NIVEL=?,
                    GRADO=?, HORAS_SEMANALES=?, ESTADO=?
                    WHERE ID_CURSO=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['nombre_curso'],
                $_POST['descripcion'],
                $_POST['nivel'],
                $_POST['grado'],
                $_POST['horas_semanales'],
                $_POST['estado'],
                $_POST['id_curso']
            ]);
            echo json_encode(["exito" => true, "mensaje" => "Curso actualizado correctamente."]);
            break;

        case '3': // ELIMINAR CURSO
            $sql  = "DELETE FROM CURSO WHERE ID_CURSO = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_POST['id_curso']]);
            echo json_encode(["exito" => true, "mensaje" => "Curso eliminado correctamente."]);
            break;

        case '4': // LISTAR CURSOS
            // Seleccionamos todos los campos y los ordenamos del más reciente al más antiguo
            $sql  = "SELECT ID_CURSO, NOMBRE_CURSO, DESCRIPCION, NIVEL, GRADO, HORAS_SEMANALES, ESTADO
                    FROM CURSO ORDER BY ID_CURSO DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            // fetchAll(PDO::FETCH_ASSOC) convierte los resultados en un formato que JSON entiende perfectamente
            $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($cursos);
            break;

        default:
            echo json_encode(["exito" => false, "mensaje" => "Opción no válida."]);
    }

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error BD: " . $e->getMessage()]);
}
?>