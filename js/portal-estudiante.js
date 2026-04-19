/* ── Navegación ── */
const titulos = {
    'inicio':         'Portal Estudiantil',
    'mis-matriculas': 'Mis Matrículas',
    'mis-pagos':      'Mis Pagos',
    'mi-perfil':      'Mi Perfil'
};

function cambiarModulo(mod) {
    $('.modulo').hide().removeClass('active');
    $('#modulo-' + mod).fadeIn(220).addClass('active');
    $('.sidebar-nav li').removeClass('active');
    $('[data-module="' + mod + '"]').closest('li').addClass('active');
    $('#headerTitulo').text(titulos[mod] || 'Portal Estudiantil');
    cerrarDropdown();
}

$(document).on('click', '[data-module]', function(e) {
    e.preventDefault();
    cambiarModulo($(this).data('module'));
});

/* ── Dropdown ── */
function toggleDropdown() {
    $('#dropdownMenu').toggleClass('show');
    $('#dropdownBtn').toggleClass('open');
}
function cerrarDropdown() {
    $('#dropdownMenu').removeClass('show');
    $('#dropdownBtn').removeClass('open');
}
$(document).on('click', function(e) {
    if (!$(e.target).closest('.user-dropdown-wrap').length) cerrarDropdown();
});

/* ── Iniciales para avatar ── */
function iniciales(nombre) {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
    return partes[0][0].toUpperCase();
}

/* ── Cargar datos desde PHP ── */
$(document).ready(function() {
    $.ajax({
        url: 'php/portal-estudiante.php',
        type: 'POST',
        dataType: 'json',
        data: { opcion: 1 },
        success: function(r) {
            if (!r.exito) {
                Swal.fire({ icon:'warning', title:'Sesión expirada', text:'Por favor inicia sesión nuevamente.', confirmButtonColor:'#119a67' })
                    .then(() => window.location.replace('login.php'));
                return;
            }

            const a = r.alumno;
            const nombreCompleto = a.NOMBRES + ' ' + a.APELLIDOS;
            const ini = iniciales(nombreCompleto);

            // Sidebar
            $('#sidebarNombre').text(a.NOMBRES);
            $('#sidebarAvatar').text(ini);

            // Header dropdown
            $('#headerNombre').html(a.NOMBRES + ' <i class="fa-solid fa-chevron-down"></i>');
            $('#headerAvatar').text(ini);
            $('#dropdownNombreCompleto').text(nombreCompleto);

            // Banner
            $('#bannerNombre').text(a.NOMBRES);

            // Perfil
            $('#perfilAvatar').text(ini);
            $('#perfilNombreCompleto').text(nombreCompleto);
            $('#perfilUsername').text('@' + a.USERNAME);
            $('#perfilNombres').text(a.NOMBRES);
            $('#perfilApellidos').text(a.APELLIDOS);
            $('#perfilDni').text(a.DNI_ALUMNO);
            $('#perfilFecha').text(a.FECHA_NACIMIENTO);
            $('#perfilGenero').text(a.GENERO === 'M' ? 'Masculino' : 'Femenino');
            $('#perfilEdad').text(a.EDAD + ' años');
            $('#perfilCelular').text(a.CELULAR);
            $('#perfilCorreo').text(a.CORREO);
            $('#perfilDireccion').text(a.DIRECCION);
            $('#perfilEstado').text(a.ESTADO);
            $('#perfilApoderado').text(a.NOMBRE_APODERADO || '—');
            $('#perfilCelApoderado').text(a.CELULAR_APODERADO || '—');

            // Matrículas
            const mats = r.matriculas || [];
            $('#kpiMatriculas').text(mats.length);
            $('#totalMatriculas').text(mats.length);
            const tbM = $('#tablaMatriculas');
            const tbR = $('#tablaResumenMatriculas');
            tbM.empty(); tbR.empty();

            if (mats.length === 0) {
                const vacio = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No tienes matrículas registradas.</p></div></td></tr>`;
                tbM.append(vacio);
                tbR.append(`<tr><td colspan="5"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>Sin matrículas.</p></div></td></tr>`);
            } else {
                mats.forEach(function(m, i) {
                    const bc = m.ESTADO === 'Activo' ? 'status-active' : m.ESTADO === 'Inactivo' ? 'status-inactive' : 'status-process';
                    tbM.append(`<tr>
                        <td>${m.ID_MATRICULA}</td><td>${m.NOMBRE_CURSO}</td>
                        <td>${m.FECHA_MATRICULA}</td><td>${m.FECHA_ESCOLAR}</td>
                        <td>${m.TURNO}</td>
                        <td><span class="status-badge ${bc}">${m.ESTADO}</span></td>
                    </tr>`);
                    if (i < 3) tbR.append(`<tr>
                        <td>${m.ID_MATRICULA}</td><td>${m.NOMBRE_CURSO}</td>
                        <td>${m.TURNO}</td><td>${m.FECHA_ESCOLAR}</td>
                        <td><span class="status-badge ${bc}">${m.ESTADO}</span></td>
                    </tr>`);
                });
            }

            // Pagos
            const pagos = r.pagos || [];
            const pendientes = pagos.filter(p => p.ESTADO === 'Pendiente').length;
            $('#kpiPagos').text(pagos.length);
            $('#kpiPendientes').text(pendientes);
            $('#totalPagos').text(pagos.length);
            const tbP = $('#tablaPagos');
            tbP.empty();

            if (pagos.length === 0) {
                tbP.append(`<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No tienes pagos registrados.</p></div></td></tr>`);
            } else {
                pagos.forEach(function(p) {
                    const bc = p.ESTADO === 'Pagado' ? 'status-paid' : p.ESTADO === 'Pendiente' ? 'status-process' : 'status-inactive';
                    tbP.append(`<tr>
                        <td>${p.ID_PAGO}</td><td>${p.CONCEPTO}</td>
                        <td><strong>S/. ${parseFloat(p.MONTO).toFixed(2)}</strong></td>
                        <td>${p.FECHA_PAGO}</td><td>${p.METODO_PAGO}</td>
                        <td><span class="status-badge ${bc}">${p.ESTADO}</span></td>
                    </tr>`);
                });
            }
        },
        error: function() {
            Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
        }
    });
});

/* ── Cerrar sesión ── */
function cerrarSesion() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Se cerrará tu sesión actual.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#119a67',
        cancelButtonColor: '#7f8c9a',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            fetch('php/logout.php')
                .then(() => {
                    window.location.replace('login.php');
                })
                .catch(() => {
                    window.location.replace('login.php');
                });
        }
    });
}