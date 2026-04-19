/* =====================================================
   LOGIN DASHBOARD — login-dashboard.js
   ===================================================== */

let rolActual = 'admin';

function switchRole(rol) {
    rolActual = rol;
    document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + rol).classList.add('active');

    document.getElementById('btnAdmin').classList.remove('active', 'admin-active', 'user-active');
    document.getElementById('btnUser').classList.remove('active', 'admin-active', 'user-active');

    if (rol === 'admin') {
        document.getElementById('btnAdmin').classList.add('active', 'admin-active');
    } else {
        document.getElementById('btnUser').classList.add('active', 'user-active');
    }

    const accent = document.getElementById('cardAccent');
    accent.classList.remove('admin', 'user');
    accent.classList.add(rol === 'admin' ? 'admin' : 'user');

    const root = document.documentElement;
    if (rol === 'admin') {
        root.style.setProperty('--active-color', 'var(--admin-accent)');
        root.style.setProperty('--active-glow',  'var(--admin-glow)');
    } else {
        root.style.setProperty('--active-color', 'var(--user-accent)');
        root.style.setProperty('--active-glow',  'var(--user-glow)');
    }
}

function togglePass(inputId, iconEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        iconEl.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        iconEl.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function handleLogin(event, rol) {
    event.preventDefault();

    const username = rol === 'admin'
        ? document.getElementById('adminUser').value.trim()
        : document.getElementById('userUser').value.trim();

    const password = rol === 'admin'
        ? document.getElementById('adminPass').value
        : document.getElementById('userPass').value;

    const spinner = document.getElementById('spinner' + (rol === 'admin' ? 'Admin' : 'User'));
    const icon    = document.getElementById('icon'    + (rol === 'admin' ? 'Admin' : 'User'));
    const text    = document.getElementById('text'    + (rol === 'admin' ? 'Admin' : 'User'));
    const btn     = document.getElementById('btnSubmit' + (rol === 'admin' ? 'Admin' : 'User'));

    spinner.style.display = 'block';
    if (icon) icon.style.display = 'none';
    if (text) text.textContent   = 'Verificando...';
    if (btn)  btn.disabled       = true;

    const formData = new FormData();
    formData.append('rol',      rol);
    formData.append('username', username);
    formData.append('password', password);

    fetch('php/login-dashboard.php', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.exito) {
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: data.mensaje,
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.replace(data.redirigir);
            });
        } else {
            Swal.fire({ icon: 'error', title: 'Acceso denegado', text: data.mensaje });
        }
    })
    .catch(() => {
        Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servidor.' });
    })
    .finally(() => {
        spinner.style.display = 'none';
        if (icon) icon.style.display = '';
        if (text) text.textContent   = rol === 'admin' ? 'Ingresar al sistema' : 'Ingresar al portal';
        if (btn)  btn.disabled       = false;
    });
}
// ── REDIRECCIÓN SI YA HAY SESIÓN ACTIVA ──────────────────
fetch('php/auth_check.php')
    .then(r => r.json())
    .then(data => {
        if (data.autenticado && data.rol === 'admin') {
            window.location.replace('dashboard.php');
        }
    })
    .catch(() => {}); // Si falla, simplemente muestra el login normal