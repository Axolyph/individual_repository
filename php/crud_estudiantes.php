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

        case '1': // CREAR REGISTRO
            $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $sql  = "INSERT INTO ALUMNO (DNI_ALUMNO, NOMBRES, APELLIDOS,
                    FECHA_NACIMIENTO, EDAD, GENERO, DIRECCION, CELULAR, CORREO,
                    NOMBRE_APODERADO, CELULAR_APODERADO, USERNAME, PASSWORD_HASH, ESTADO)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['dni'],         $_POST['nombres'],      $_POST['apellidos'],
                $_POST['fecha_nac'],   $_POST['edad'],         $_POST['genero'],
                $_POST['direccion'],   $_POST['celular'],      $_POST['correo'],
                $_POST['apoderado'],   $_POST['cel_apoderado'],$_POST['username'],
                $hash,                 $_POST['estado']
            ]);
            echo json_encode(["exito" => true, "mensaje" => "Alumno registrado correctamente."]);
            break;

        case '2': // EDITAR REGISTRO
            // Si escribió una nueva contraseña, la actualizamos. Si está vacía, la dejamos igual.
            if (!empty($_POST['password'])) {
                $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
                $sql  = "UPDATE ALUMNO SET DNI_ALUMNO=?, NOMBRES=?, APELLIDOS=?,
                        FECHA_NACIMIENTO=?, EDAD=?, GENERO=?, DIRECCION=?,
                        CELULAR=?, CORREO=?, NOMBRE_APODERADO=?, CELULAR_APODERADO=?,
                        USERNAME=?, PASSWORD_HASH=?, ESTADO=?
                        WHERE ID_ALUMNO=?";
                $params = [
                    $_POST['dni'],          $_POST['nombres'],       $_POST['apellidos'],
                    $_POST['fecha_nac'],    $_POST['edad'],          $_POST['genero'],
                    $_POST['direccion'],    $_POST['celular'],       $_POST['correo'],
                    $_POST['apoderado'],    $_POST['cel_apoderado'], $_POST['username'],
                    $hash,                  $_POST['estado'],        $_POST['id_matricula']  // ← CORREGIDO
                ];
            } else {
                $sql  = "UPDATE ALUMNO SET DNI_ALUMNO=?, NOMBRES=?, APELLIDOS=?,
                        FECHA_NACIMIENTO=?, EDAD=?, GENERO=?, DIRECCION=?,
                        CELULAR=?, CORREO=?, NOMBRE_APODERADO=?, CELULAR_APODERADO=?,
                        USERNAME=?, ESTADO=?
                        WHERE ID_ALUMNO=?";
                $params = [
                    $_POST['dni'],          $_POST['nombres'],       $_POST['apellidos'],
                    $_POST['fecha_nac'],    $_POST['edad'],          $_POST['genero'],
                    $_POST['direccion'],    $_POST['celular'],       $_POST['correo'],
                    $_POST['apoderado'],    $_POST['cel_apoderado'], $_POST['username'],
                    $_POST['estado'],       $_POST['id_matricula']   // ← CORREGIDO
                ];
            }
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode(["exito" => true, "mensaje" => "Datos actualizados correctamente."]);
            break;

        case '3': // ELIMINAR REGISTRO
            $sql  = "DELETE FROM ALUMNO WHERE ID_ALUMNO = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_POST['id_alumno']]);
            echo json_encode(["exito" => true, "mensaje" => "Registro eliminado."]);
            break;

        case '4': // LISTAR REGISTROS
            // Seleccionamos los campos principales y los ordenamos del más reciente al más antiguo
            $sql  = "SELECT ID_ALUMNO, NOMBRES, APELLIDOS, DNI_ALUMNO, FECHA_NACIMIENTO,
                    EDAD, GENERO, DIRECCION, CELULAR, CORREO,
                    NOMBRE_APODERADO, CELULAR_APODERADO, USERNAME, ESTADO
                    FROM ALUMNO ORDER BY ID_ALUMNO DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            // fetchAll(PDO::FETCH_ASSOC) convierte los resultados en un formato que JSON entiende perfectamente
            $alumnos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($alumnos);
            break;

        default:
            echo json_encode(["exito" => false, "mensaje" => "Opción no válida."]);
    }

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error BD: " . $e->getMessage()]);
}
?>