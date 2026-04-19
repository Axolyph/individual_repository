<?php
session_start();


if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'usuario') {
    header('Location: login.php');
    exit;
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
    <title>Portal Estudiantil — Sistema de Matrícula</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://kit.fontawesome.com/812c8ee19a.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <link rel="stylesheet" href="css/portal-estudiante.css">
</head>
<body>

<!-- SIDEBAR -->
<aside class="sidebar">
    <div class="sidebar-header">
        <i class="fa-solid fa-graduation-cap"></i>
        <h2>SISTEMA DE MATRÍCULA</h2>
    </div>
    <nav class="sidebar-nav">
        <ul>
            <li class="active"><a href="#" data-module="inicio"><i class="fa-solid fa-house"></i>Inicio</a></li>
            <li><a href="#" data-module="mis-matriculas"><i class="fa-solid fa-file-contract"></i>Mis Matrículas</a></li>
            <li><a href="#" data-module="mis-pagos"><i class="fa-solid fa-money-bill-wave"></i>Mis Pagos</a></li>
            <li><a href="#" data-module="mi-perfil"><i class="fa-solid fa-user"></i>Mi Perfil</a></li>
        </ul>
    </nav>
    <div class="sidebar-footer">
        <div class="user-profile" onclick="cambiarModulo('mi-perfil')">
            <div class="avatar-circle" id="sidebarAvatar">E</div>
            <div class="user-info">
                <h3 id="sidebarNombre">Estudiante</h3>
                <span>Ver perfil</span>
            </div>
        </div>
        <button class="btn-logout" onclick="cerrarSesion()">
            <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
        </button>
    </div>
</aside>

<!-- MAIN -->
<main class="main-content">

    <!-- Header -->
    <header class="top-header">
        <h2 id="headerTitulo">Portal Estudiantil</h2>
        <div class="header-right">
            <i class="fa-solid fa-bell bell"></i>

            <!-- Dropdown usuario -->
            <div class="user-dropdown-wrap">
                <div class="user-dropdown-btn" id="dropdownBtn" onclick="toggleDropdown()">
                    <div class="avatar-hdr" id="headerAvatar">E</div>
                    <h3 id="headerNombre">Estudiante <i class="fa-solid fa-chevron-down"></i></h3>
                </div>
                <div class="dropdown-menu-custom" id="dropdownMenu">
                    <div class="dropdown-header-info">
                        <p>Sesión activa como</p>
                        <strong id="dropdownNombreCompleto">Estudiante</strong>
                    </div>
                    <a class="dropdown-item-custom" onclick="cambiarModulo('mi-perfil'); cerrarDropdown()">
                        <i class="fa-solid fa-user"></i> Ver perfil
                    </a>
                    <a class="dropdown-item-custom" onclick="cambiarModulo('mis-matriculas'); cerrarDropdown()">
                        <i class="fa-solid fa-file-contract"></i> Mis matrículas
                    </a>
                    <a class="dropdown-item-custom" onclick="cambiarModulo('mis-pagos'); cerrarDropdown()">
                        <i class="fa-solid fa-money-bill-wave"></i> Mis pagos
                    </a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item-custom danger" onclick="cerrarSesion()">
                        <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- INICIO -->
    <div id="modulo-inicio" class="modulo active">
        <div class="content-body">
            <div class="welcome-banner">
                <div>
                    <h2>¡Bienvenido, <span id="bannerNombre">Estudiante</span>!</h2>
                    <p>Aquí puedes consultar tus matrículas, pagos y datos personales.</p>
                </div>
                <i class="fa-solid fa-user-graduate banner-icon"></i>
            </div>

            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon" style="background:#119a67;"><i class="fa-solid fa-file-contract"></i></div>
                    <div class="kpi-info"><h3>Matrículas</h3><h2 id="kpiMatriculas">—</h2></div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon" style="background:#3498db;"><i class="fa-solid fa-money-bill-wave"></i></div>
                    <div class="kpi-info"><h3>Pagos Registrados</h3><h2 id="kpiPagos">—</h2></div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon" style="background:#f39c12;"><i class="fa-solid fa-hourglass-half"></i></div>
                    <div class="kpi-info"><h3>Pagos Pendientes</h3><h2 id="kpiPendientes">—</h2></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2><i class="fa-solid fa-file-contract" style="color:var(--accent);margin-right:7px;"></i>Últimas Matrículas</h2>
                </div>
                <table class="data-table">
                    <thead>
                        <tr><th>#</th><th>Curso / Grado</th><th>Turno</th><th>Año Escolar</th><th>Estado</th></tr>
                    </thead>
                    <tbody id="tablaResumenMatriculas">
                        <tr><td colspan="5"><div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Cargando...</p></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- MIS MATRÍCULAS -->
    <div id="modulo-mis-matriculas" class="modulo">
        <div class="content-body">
            <div class="card">
                <div class="card-header"><h2>Mis Matrículas</h2></div>
                <table class="data-table">
                    <thead>
                        <tr><th>ID</th><th>Curso / Grado</th><th>Fecha Matrícula</th><th>Año Escolar</th><th>Turno</th><th>Estado</th></tr>
                    </thead>
                    <tbody id="tablaMatriculas">
                        <tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Cargando...</p></div></td></tr>
                    </tbody>
                </table>
                <div class="card-footer">Mostrando <span id="totalMatriculas">0</span> matrícula(s)</div>
            </div>
        </div>
    </div>

    <!-- MIS PAGOS -->
    <div id="modulo-mis-pagos" class="modulo">
        <div class="content-body">
            <div class="card">
                <div class="card-header"><h2>Mis Pagos</h2></div>
                <table class="data-table">
                    <thead>
                        <tr><th>ID</th><th>Concepto</th><th>Monto</th><th>Fecha</th><th>Método</th><th>Estado</th></tr>
                    </thead>
                    <tbody id="tablaPagos">
                        <tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Cargando...</p></div></td></tr>
                    </tbody>
                </table>
                <div class="card-footer">Mostrando <span id="totalPagos">0</span> pago(s)</div>
            </div>
        </div>
    </div>

    <!-- MI PERFIL -->
    <div id="modulo-mi-perfil" class="modulo">
        <div class="content-body">
            <div class="card">
                <div class="card-header"><h2>Mi Perfil</h2></div>
                <div class="perfil-header">
                    <div class="perfil-avatar" id="perfilAvatar">E</div>
                    <div class="perfil-header-info">
                        <h3 id="perfilNombreCompleto">—</h3>
                        <p id="perfilUsername">@usuario</p>
                    </div>
                </div>
                <div class="info-grid">
                    <div class="info-item"><label>Nombres</label><span id="perfilNombres">—</span></div>
                    <div class="info-item"><label>Apellidos</label><span id="perfilApellidos">—</span></div>
                    <div class="info-item"><label>DNI</label><span id="perfilDni">—</span></div>
                    <div class="info-item"><label>Fecha de Nacimiento</label><span id="perfilFecha">—</span></div>
                    <div class="info-item"><label>Género</label><span id="perfilGenero">—</span></div>
                    <div class="info-item"><label>Edad</label><span id="perfilEdad">—</span></div>
                    <div class="info-item"><label>Celular</label><span id="perfilCelular">—</span></div>
                    <div class="info-item"><label>Correo</label><span id="perfilCorreo">—</span></div>
                    <div class="info-item"><label>Dirección</label><span id="perfilDireccion">—</span></div>
                    <div class="info-item"><label>Estado</label><span id="perfilEstado">—</span></div>
                    <div class="info-item"><label>Apoderado</label><span id="perfilApoderado">—</span></div>
                    <div class="info-item"><label>Cel. Apoderado</label><span id="perfilCelApoderado">—</span></div>
                </div>
            </div>
        </div>
    </div>

</main>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="js/portal-estudiante.js"></script>
</body>
</html>