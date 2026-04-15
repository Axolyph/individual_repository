<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'MATRICULA';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recibir qué acción queremos hacer (1: Crear, 2: Editar, 3: Eliminar, 4: Listar, 5: Cargar selects)
    $opcion = $_POST['opcion'] ?? '';

    switch ($opcion) {

        case '1': // CREAR MATRÍCULA
            $sql  = "INSERT INTO MATRICULA (ID_ALUMNO, ID_CURSO, FECHA_MATRICULA, ANIO_ESCOLAR, TURNO, ESTADO, OBSERVACIONES)
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['id_alumno'],
                $_POST['id_curso'],
                $_POST['fecha_matricula'],
                $_POST['anio_escolar'],
                $_POST['turno'],
                $_POST['estado'],
                $_POST['observaciones']
            ]);
            echo json_encode(["exito" => true, "mensaje" => "Matrícula registrada correctamente."]);
            break;

        case '2': // EDITAR MATRÍCULA
            $sql  = "UPDATE MATRICULA SET ID_ALUMNO=?, ID_CURSO=?, FECHA_MATRICULA=?,
                    ANIO_ESCOLAR=?, TURNO=?, ESTADO=?, OBSERVACIONES=?
                    WHERE ID_MATRICULA=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['id_alumno'],
                $_POST['id_curso'],
                $_POST['fecha_matricula'],
                $_POST['anio_escolar'],
                $_POST['turno'],
                $_POST['estado'],
                $_POST['observaciones'],
                $_POST['id_matricula']
            ]);
            echo json_encode(["exito" => true, "mensaje" => "Matrícula actualizada correctamente."]);
            break;

        case '3': // ELIMINAR MATRÍCULA
            $sql  = "DELETE FROM MATRICULA WHERE ID_MATRICULA = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_POST['id_matricula']]);
            echo json_encode(["exito" => true, "mensaje" => "Matrícula eliminada correctamente."]);
            break;

        case '4': // LISTAR MATRÍCULAS (con JOIN para mostrar nombres en lugar de IDs)
            $sql  = "SELECT 
                        m.ID_MATRICULA,
                        m.ID_ALUMNO,
                        m.ID_CURSO,
                        CONCAT(a.NOMBRES, ' ', a.APELLIDOS) AS NOMBRE_ALUMNO,
                        c.NOMBRE_CURSO,
                        m.FECHA_MATRICULA,
                        m.ANIO_ESCOLAR,
                        m.TURNO,
                        m.ESTADO,
                        m.OBSERVACIONES
                    FROM MATRICULA m
                    INNER JOIN ALUMNO a ON m.ID_ALUMNO = a.ID_ALUMNO
                    INNER JOIN CURSO  c ON m.ID_CURSO  = c.ID_CURSO
                    ORDER BY m.ID_MATRICULA DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $matriculas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($matriculas);
            break;

        case '5': // CARGAR ALUMNOS Y CURSOS PARA LOS SELECTS DEL MODAL
            $alumnos = $pdo->query("SELECT ID_ALUMNO, CONCAT(NOMBRES,' ',APELLIDOS) AS NOMBRE_COMPLETO FROM ALUMNO WHERE ESTADO='Activo' ORDER BY NOMBRES")->fetchAll(PDO::FETCH_ASSOC);
            $cursos  = $pdo->query("SELECT ID_CURSO, NOMBRE_CURSO, NIVEL, GRADO FROM CURSO ORDER BY NOMBRE_CURSO")->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["alumnos" => $alumnos, "cursos" => $cursos]);
            break;

        default:
            echo json_encode(["exito" => false, "mensaje" => "Opción no válida."]);
    }

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error BD: " . $e->getMessage()]);
}
?>