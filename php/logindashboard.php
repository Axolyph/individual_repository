<?php
session_start();

// Evita entrar sin login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login2.html");
    exit();
}

// Evita volver con botón atrás
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- LIBRERIA DE ICONOS -->
    <script src="https://kit.fontawesome.com/812c8ee19a.js" crossorigin="anonymous"></script>
    <!-- FAVICON DE LA APLICACION DE MATRICULA -->
    <link rel="shortcut icon" href="img/Imagen1-removebg-preview.ico" type="image/x-icon">
    <!-- HOJA DE ESTILOS -->
    <link rel="stylesheet" href="../css/styles-login.css">
    <!-- LIBRERIA JQUERY -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <!-- FUENTES -->
    <link href="https://fonts.googleapis.com/css2?family=Poppin
    s:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0
    ,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<body>
    <h1 style="color: red;">Hola Mundo</h1>
    <a href="logoutdashboard.php" class="logout">
    <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
    </a>

    <!-- LOGIN JS -->
    <script src="js/login.js"></script>
    <!-- SWIT ALERT -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- BOOSTRAP -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    
</body>
</html>