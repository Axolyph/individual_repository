<?php
session_start();

if (isset($_SESSION['rol'])) {
    if ($_SESSION['rol'] === 'admin') {
        header('Location: dashboard.php');
        exit;
    } else if ($_SESSION['rol'] === 'usuario') {
        header('Location: portal.php');
        exit;
    }
}

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Sat, 01 Jan 2000 00:00:00 GMT');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Matrícula — Iniciar Sesión</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="css/login-dashboard.css">
</head>
<body>

<div class="bg-orbs">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
</div>
<div class="grid-bg"></div>

<div class="login-wrapper">
    <!-- Brand -->
    <div class="brand">
        <div class="brand-icon"><i class="fa-solid fa-graduation-cap"></i></div>
        <h1>SISTEMA DE MATRÍCULA</h1>
        <p>Panel de administración escolar</p>
    </div>

    <!-- Card -->
    <div class="login-card">
        <div class="card-accent admin" id="cardAccent"></div>

        <!-- Role switcher -->
        <div class="role-switcher">
            <button class="role-btn active admin-active" id="btnAdmin" onclick="switchRole('admin')">
                <i class="fa-solid fa-user-shield"></i> Administrador
            </button>
            <button class="role-btn" id="btnUser" onclick="switchRole('usuario')">
                <i class="fa-solid fa-user-graduate"></i> Estudiante
            </button>
        </div>

        <!-- Admin Form -->
        <div class="form-panel active" id="panel-admin">
            <div class="form-title">
                <h2>Bienvenido de vuelta</h2>
                <p>Accede al panel de administración</p>
                <span class="role-indicator admin"><i class="fa-solid fa-shield-halved"></i> Acceso Administrador</span>
            </div>
            <form id="formAdmin" onsubmit="handleLogin(event, 'admin')">
                <div class="input-group">
                    <label>Usuario</label>
                    <div class="input-wrap">
                        <i class="fa-solid fa-user input-icon"></i>
                        <input type="text" id="adminUser" placeholder="Nombre de usuario" required autocomplete="username">
                    </div>
                </div>
                <div class="input-group">
                    <label>Contraseña</label>
                    <div class="input-wrap">
                        <i class="fa-solid fa-lock input-icon"></i>
                        <input type="password" id="adminPass" placeholder="Tu contraseña" required autocomplete="current-password">
                        <i class="fa-solid fa-eye toggle-pass" onclick="togglePass('adminPass', this)"></i>
                    </div>
                </div>
                <button type="submit" class="btn-login admin-btn" id="btnSubmitAdmin">
                    <div class="spinner" id="spinnerAdmin"></div>
                    <i class="fa-solid fa-arrow-right-to-bracket" id="iconAdmin"></i>
                    <span id="textAdmin">Ingresar al sistema</span>
                </button>
            </form>
        </div>

        <!-- User Form -->
        <div class="form-panel" id="panel-usuario">
            <div class="form-title">
                <h2>Hola, estudiante</h2>
                <p>Accede a tu portal estudiantil</p>
                <span class="role-indicator user"><i class="fa-solid fa-user-graduate"></i> Acceso Estudiante</span>
            </div>
            <form id="formUser" onsubmit="handleLogin(event, 'usuario')">
                <div class="input-group">
                    <label>Usuario</label>
                    <div class="input-wrap">
                        <i class="fa-solid fa-user input-icon"></i>
                        <input type="text" id="userUser" placeholder="Tu nombre de usuario" required autocomplete="username">
                    </div>
                </div>
                <div class="input-group">
                    <label>Contraseña</label>
                    <div class="input-wrap">
                        <i class="fa-solid fa-lock input-icon"></i>
                        <input type="password" id="userPass" placeholder="Tu contraseña" required autocomplete="current-password">
                        <i class="fa-solid fa-eye toggle-pass" onclick="togglePass('userPass', this)"></i>
                    </div>
                </div>
                <button type="submit" class="btn-login user-btn" id="btnSubmitUser">
                    <div class="spinner" id="spinnerUser"></div>
                    <i class="fa-solid fa-arrow-right-to-bracket" id="iconUser"></i>
                    <span id="textUser">Ingresar al portal</span>
                </button>
            </form>
        </div>

        <p class="card-footer-text">
            ¿Problemas para acceder? <span>Contacta al administrador</span>
        </p>
    </div>

    <p class="system-info">© 2025 SISTEMA DE MATRÍCULA · Todos los derechos reservados</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="js/login-dashboard.js"></script>

</body>
</html>