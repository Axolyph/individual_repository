/* ========================================================================
    SISTEMA DE MATRICULA - ARCHIVO CONSOLIDADO DE JAVASCRIPT
    ======================================================================== 
    Contiene toda la lógica de los módulos:
    - Navegación entre módulos
    - Estudiantes
    - Cursos
    - Aulas
    - Matrículas
    - Pagos
    - Configuración
   ======================================================================== */
// =====================================================================
// MÓDULO DE NAVEGACIÓN - CAMBIO ENTRE SECCIONES
// =====================================================================
$(document).ready(function() {
    
    function cambiarModulo(nombreModulo) {
        $('.modulo').fadeOut(300, function() {
            $(this).hide();
        });
        setTimeout(function() {
            $('#modulo-' + nombreModulo).fadeIn(300).show();
        }, 300);
        $('.sidebar-nav li').removeClass('active');
        $('[data-module="' + nombreModulo + '"]').closest('li').addClass('active');
        localStorage.setItem('moduloActivo', nombreModulo);
    }
    
    $(document).on('click', '[data-module]', function(e) {
        const href = $(this).attr('href');
        const module = $(this).data('module');
        if (href && href !== '#' && !href.startsWith('#')) {
            if (module) localStorage.setItem('moduloActivo', module);
            return;
        }
        e.preventDefault();
        cambiarModulo(module);
    });
    
    const paginaActual = window.location.pathname.split('/').pop().toLowerCase();
    let moduloGuardado = localStorage.getItem('moduloActivo') || 'estudiantes';

    if (paginaActual === 'dashboard.php') {
        moduloGuardado = 'dashboard';
    } else if (paginaActual === 'modulos.php' && moduloGuardado === 'dashboard') {
        moduloGuardado = 'estudiantes';
    }

    if (paginaActual !== 'modulos.php' || moduloGuardado !== 'estudiantes') {
        cambiarModulo(moduloGuardado);
    }
});

// =====================================================================
// MÓDULO ESTUDIANTES
// =====================================================================
$(document).ready(function () {
    
    // 1. ABRIR MODAL PARA NUEVO REGISTRO
    $(document).on('click', '#modulo-estudiantes .btn-primary', function () {
        $('#formAlumno')[0].reset();
        $('#modalAlumno #opcion').val('1');
        $('#modalTitulo').text('Registrar Nuevo Alumno');
        $('#password').attr('required', true);
        $('#modalAlumno').fadeIn();
    });

    // 2. CERRAR MODAL
    $(document).on('click', '#modalAlumno .btn-cerrar-modal', function () {
        $('#modalAlumno').fadeOut();
    });

    // 3. ENVIAR FORMULARIO (CREAR O EDITAR)
    $('#formAlumno').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_estudiantes.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(),
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalAlumno').fadeOut();
                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success').then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    // 4. ELIMINAR REGISTRO
    $(document).on('click', '#modulo-estudiantes .fa-trash', function () {
        let fila = $(this).closest('tr');
        let idAlumno = fila.find('td:eq(0)').text();

        Swal.fire({
            title: '¿Eliminar Alumno?',
            text: "Se borrará permanentemente de la Base de Datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/crud_estudiantes.php",
                    type: "POST",
                    dataType: "json",
                    data: { opcion: 3, id_alumno: idAlumno },
                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.fadeOut(400, function() {
                                $(this).remove(); 
                                $('#totalRegistros').text($('#tablaAlumnos tr').length);
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

    // 5. EDITAR REGISTRO
    $(document).on('click', '#modulo-estudiantes .fa-pen-to-square', function () {
        let fila = $(this).closest('tr');
        let idAlumno     = fila.data('id');
        let nombres      = fila.data('nombres');
        let apellidos    = fila.data('apellidos');
        let dni          = fila.data('dni');
        let fechaNac     = fila.data('fecha-nac');
        let edad         = fila.data('edad');
        let genero       = fila.data('genero');
        let direccion    = fila.data('direccion');
        let celular      = fila.data('celular');
        let correo       = fila.data('correo');
        let apoderado    = fila.data('apoderado');
        let celApoderado = fila.data('cel-apoderado');
        let username     = fila.data('username');
        let estado       = fila.data('estado');

        $('#modalAlumno #hidden_id_matricula').val(idAlumno);
        $('#modalAlumno #opcion').val('2');
        $('#modalTitulo').text('Editar Alumno');
        $('#password').removeAttr('required');
        $('#dni').val(dni);
        $('#nombres').val(nombres);
        $('#apellidos').val(apellidos);
        $('#fecha_nac').val(fechaNac);
        $('#edad').val(edad);
        $('#genero').val(genero);
        $('#direccion').val(direccion);
        $('#celular').val(celular);
        $('#correo').val(correo);
        $('#apoderado').val(apoderado);
        $('#cel_apoderado').val(celApoderado);
        $('#username').val(username);
        $('#modalAlumno #estado').val(estado);

        $('#modalAlumno').fadeIn();
    });

    // CARGAR TABLA DE ESTUDIANTES
    function cargarAlumnos() {
        $.ajax({
            url: "php/crud_estudiantes.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (data) {
                let tbody = $('#tablaAlumnos');
                tbody.empty();
                $('#totalRegistros').text(data.length);
                $.each(data, function (index, alumno) {
                    let badgeClass = '';
                    let badgeTexto = alumno.ESTADO;
                    if (alumno.ESTADO === 'Activo') badgeClass = 'status-active';
                    else if (alumno.ESTADO === 'Inactivo') badgeClass = 'status-inactive';
                    else if (alumno.ESTADO === 'Proceso') badgeClass = 'status-process';
                    
                    let fila = `
                    <tr data-id="${alumno.ID_ALUMNO}" data-nombres="${alumno.NOMBRES}" data-apellidos="${alumno.APELLIDOS}" data-dni="${alumno.DNI_ALUMNO}" data-fecha-nac="${alumno.FECHA_NACIMIENTO}" data-edad="${alumno.EDAD}" data-genero="${alumno.GENERO}" data-direccion="${alumno.DIRECCION}" data-celular="${alumno.CELULAR}" data-correo="${alumno.CORREO}" data-apoderado="${alumno.NOMBRE_APODERADO}" data-cel-apoderado="${alumno.CELULAR_APODERADO}" data-username="${alumno.USERNAME}" data-estado="${alumno.ESTADO}">
                    <td>${alumno.ID_ALUMNO}</td>
                    <td>${alumno.NOMBRES}</td>
                    <td>${alumno.APELLIDOS}</td>
                    <td>${alumno.DNI_ALUMNO}</td>
                    <td>${alumno.FECHA_NACIMIENTO}</td>
                    <td>${alumno.CELULAR}</td>
                    <td>${alumno.CORREO}</td>
                    <td><span class="status-badge ${badgeClass}">${badgeTexto}</span></td>
                    <td class="action-icons"><i class="fa-solid fa-pen-to-square"></i><i class="fa-solid fa-eye"></i><i class="fa-solid fa-trash"></i></td>
                    </tr>`;
                    tbody.append(fila);
                });
            }
        });
    }
    cargarAlumnos();
});

// =====================================================================
// MÓDULO CURSOS
// =====================================================================
$(document).ready(function () {

    // 1. ABRIR MODAL PARA NUEVO CURSO
    $(document).on('click', '#modulo-cursos .btn-nuevo-curso', function () {
        $('#formCurso')[0].reset();
        $('#modalCurso #opcion').val('1');
        $('#modalTituloCurso').text('Registrar Nuevo Curso');
        $('#modalCurso').fadeIn();
    });

    // 2. CERRAR MODAL
    $(document).on('click', '#modalCurso .btn-cerrar-modal', function () {
        $('#modalCurso').fadeOut();
    });

    // 3. ENVIAR FORMULARIO (CREAR O EDITAR)
    $('#formCurso').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_cursos.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(),
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalCurso').fadeOut();
                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success').then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    // 4. ELIMINAR CURSO
    $(document).on('click', '#modulo-cursos .fa-trash', function () {
        let fila = $(this).closest('tr');
        let idCurso = fila.find('td:eq(0)').text();

        Swal.fire({
            title: '¿Eliminar Curso?',
            text: "Se borrará permanentemente de la Base de Datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/crud_cursos.php",
                    type: "POST",
                    dataType: "json",
                    data: { opcion: 3, id_curso: idCurso },
                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.fadeOut(400, function () {
                                $(this).remove();
                                $('#totalRegistrosCursos').text($('#tablaCursos tr').length);
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

    // 5. EDITAR CURSO
    $(document).on('click', '#modulo-cursos .fa-pen-to-square', function () {
        let fila = $(this).closest('tr');
        let idCurso        = fila.data('id');
        let nombreCurso    = fila.data('nombre');
        let descripcion    = fila.data('descripcion');
        let nivel          = fila.data('nivel');
        let grado          = fila.data('grado');
        let horasSemanales = fila.data('horas');
        let estado         = fila.data('estado');

        $('#modalCurso #id_curso').val(idCurso);
        $('#modalCurso #opcion').val('2');
        $('#modalTituloCurso').text('Editar Curso');
        $('#nombre_curso').val(nombreCurso);
        $('#descripcion').val(descripcion);
        $('#modalCurso #nivel').val(nivel);
        $('#modalCurso #grado').val(grado);
        $('#horas_semanales').val(horasSemanales);
        $('#modalCurso #estado').val(estado);

        $('#modalCurso').fadeIn();
    });

    // CARGAR TABLA DE CURSOS
    function cargarCursos() {
        $.ajax({
            url: "php/crud_cursos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (data) {
                let tbody = $('#tablaCursos');
                tbody.empty();
                $('#totalRegistrosCursos').text(data.length);
                $.each(data, function (index, curso) {
                    let badgeClass = '';
                    let badgeTexto = curso.ESTADO;
                    if (curso.ESTADO === 'Activo') badgeClass = 'status-active';
                    else if (curso.ESTADO === 'Inactivo') badgeClass = 'status-inactive';

                    let fila = `
                    <tr data-id="${curso.ID_CURSO}" data-nombre="${curso.NOMBRE_CURSO}" data-descripcion="${curso.DESCRIPCION}" data-nivel="${curso.NIVEL}" data-grado="${curso.GRADO}" data-horas="${curso.HORAS_SEMANALES}" data-estado="${curso.ESTADO}">
                        <td>${curso.ID_CURSO}</td>
                        <td>${curso.NOMBRE_CURSO}</td>
                        <td>${curso.DESCRIPCION ?? '-'}</td>
                        <td>${curso.NIVEL}</td>
                        <td>${curso.GRADO}</td>
                        <td>${curso.HORAS_SEMANALES}</td>
                        <td><span class="status-badge ${badgeClass}">${badgeTexto}</span></td>
                        <td class="action-icons"><i class="fa-solid fa-pen-to-square"></i><i class="fa-solid fa-eye"></i><i class="fa-solid fa-trash"></i></td>
                    </tr>`;
                    tbody.append(fila);
                });
            }
        });
    }
    cargarCursos();
});

// =====================================================================
// MÓDULO AULAS
// =====================================================================
$(document).ready(function () {

    // 1. ABRIR MODAL PARA NUEVA AULA
    $(document).on('click', '#modulo-aulas .btn-nueva-aula', function () {
        $('#formAula')[0].reset();
        $('#modalAula #opcion').val('1');
        $('#modalTituloAula').text('Registrar Nueva Aula');
        $('#modalAula').fadeIn();
    });

    // 2. CERRAR MODAL
    $(document).on('click', '#modalAula .btn-cerrar-modal', function () {
        $('#modalAula').fadeOut();
    });

    // 3. ENVIAR FORMULARIO (CREAR O EDITAR)
    $('#formAula').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_aulas.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(),
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalAula').fadeOut();
                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success').then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    // 4. ELIMINAR AULA
    $(document).on('click', '#modulo-aulas .fa-trash', function () {
        let fila = $(this).closest('tr');
        let idAula = fila.find('td:eq(0)').text();

        Swal.fire({
            title: '¿Eliminar Aula?',
            text: "Se borrará permanentemente de la Base de Datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/crud_aulas.php",
                    type: "POST",
                    dataType: "json",
                    data: { opcion: 3, id_aula: idAula },
                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.fadeOut(400, function () {
                                $(this).remove();
                                $('#totalRegistrosAulas').text($('#tablaAulas tr').length);
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

    // 5. EDITAR AULA
    $(document).on('click', '#modulo-aulas .fa-pen-to-square', function () {
        let fila = $(this).closest('tr');
        let idAula              = fila.data('id');
        let nivel               = fila.data('nivel');
        let grado               = fila.data('grado');
        let seccion             = fila.data('seccion');
        let vacantesTotales     = fila.data('vacantes-totales');
        let vacantesDisponibles = fila.data('vacantes-disponibles');

        $('#modalAula #id_aula').val(idAula);
        $('#modalAula #opcion').val('2');
        $('#modalTituloAula').text('Editar Aula');
        $('#modalAula #nivel').val(nivel);
        $('#modalAula #grado').val(grado);
        $('#modalAula #seccion').val(seccion);
        $('#vacantes_totales').val(vacantesTotales);
        $('#vacantes_disponibles').val(vacantesDisponibles);

        $('#modalAula').fadeIn();
    });

    // CARGAR TABLA DE AULAS
    function cargarAulas() {
        $.ajax({
            url: "php/crud_aulas.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (data) {
                let tbody = $('#tablaAulas');
                tbody.empty();
                $('#totalRegistrosAulas').text(data.length);
                $.each(data, function (index, aula) {
                    let badgeClass = aula.VACANTES_DISPONIBLES > 0 ? 'status-active' : 'status-inactive';
                    let badgeTexto = aula.VACANTES_DISPONIBLES > 0 ? aula.VACANTES_DISPONIBLES + ' disponibles' : 'Sin vacantes';

                    let fila = `
                    <tr data-id="${aula.ID_AULA}" data-nivel="${aula.NIVEL}" data-grado="${aula.GRADO}" data-seccion="${aula.SECCION}" data-vacantes-totales="${aula.VACANTES_TOTALES}" data-vacantes-disponibles="${aula.VACANTES_DISPONIBLES}">
                        <td>${aula.ID_AULA}</td>
                        <td>${aula.NIVEL}</td>
                        <td>${aula.GRADO}</td>
                        <td>${aula.SECCION}</td>
                        <td>${aula.VACANTES_TOTALES}</td>
                        <td><span class="status-badge ${badgeClass}">${badgeTexto}</span></td>
                        <td class="action-icons"><i class="fa-solid fa-pen-to-square"></i><i class="fa-solid fa-eye"></i><i class="fa-solid fa-trash"></i></td>
                    </tr>`;
                    tbody.append(fila);
                });
            }
        });
    }
    cargarAulas();
});

// =====================================================================
// MÓDULO MATRÍCULAS
// =====================================================================
$(document).ready(function () {

    function cargarSelects() {
        $.ajax({
            url: "php/crud_matriculas.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 5 },
            success: function (data) {
                let selectAlumno = $('#modalMatricula #id_alumno');
                let selectCurso  = $('#modalMatricula #id_curso');

                selectAlumno.find('option:not(:first)').remove();
                selectCurso.find('option:not(:first)').remove();

                $.each(data.alumnos, function (i, alumno) {
                    selectAlumno.append(`<option value="${alumno.ID_ALUMNO}">${alumno.NOMBRE_COMPLETO}</option>`);
                });
                $.each(data.cursos, function (i, curso) {
                    selectCurso.append(`<option value="${curso.ID_CURSO}">${curso.NOMBRE_CURSO} (${curso.NIVEL} - Grado ${curso.GRADO})</option>`);
                });
            }
        });
    }

    // 1. ABRIR MODAL
    $(document).on('click', '#modulo-matriculas .btn-nueva-matricula', function () {
        $('#formMatricula')[0].reset();
        $('#modalMatricula #opcion').val('1');
        $('#modalTituloMatricula').text('Registrar Nueva Matrícula');
        cargarSelects();
        $('#modalMatricula').fadeIn();
    });

    // 2. CERRAR MODAL
    $(document).on('click', '#modalMatricula .btn-cerrar-modal', function () {
        $('#modalMatricula').fadeOut();
    });

    // 3. ENVIAR FORMULARIO
    $('#formMatricula').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_matriculas.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(),
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalMatricula').fadeOut();
                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success').then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    // 4. ELIMINAR
    $(document).on('click', '#modulo-matriculas .fa-trash', function () {
        let fila = $(this).closest('tr');
        let idMatricula = fila.find('td:eq(0)').text();

        Swal.fire({
            title: '¿Eliminar Matrícula?',
            text: "Se borrará permanentemente de la Base de Datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/crud_matriculas.php",
                    type: "POST",
                    dataType: "json",
                    data: { opcion: 3, id_matricula: idMatricula },
                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.fadeOut(400, function () {
                                $(this).remove();
                                $('#totalRegistrosMatriculas').text($('#tablaMatriculas tr').length);
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

    // 5. EDITAR
    $(document).on('click', '#modulo-matriculas .fa-pen-to-square', function () {
        let fila = $(this).closest('tr');
        let idMatricula    = fila.data('id');
        let idAlumno       = fila.data('id-alumno');
        let idCurso        = fila.data('id-curso');
        let fechaMatricula = fila.data('fecha');
        let fechaEscolar   = fila.data('fecha_escolar');
        let turno          = fila.data('turno');
        let estado         = fila.data('estado');
        let observaciones  = fila.data('observaciones');

        cargarSelects();
        setTimeout(function () {
            $('#modalMatricula #hidden_id_matricula').val(idMatricula);
            $('#modalMatricula #opcion').val('2');
            $('#modalTituloMatricula').text('Editar Matrícula');
            $('#modalMatricula #id_alumno').val(idAlumno);
            $('#modalMatricula #id_curso').val(idCurso);
            $('#fecha_matricula').val(fechaMatricula);
            $('#fecha_escolar').val(fechaEscolar);
            $('#modalMatricula #turno').val(turno);
            $('#modalMatricula #estado').val(estado);
            $('#modalMatricula #observaciones').val(observaciones);
        }, 300);
        $('#modalMatricula').fadeIn();
    });

    // CARGAR TABLA
    function cargarMatriculas() {
        $.ajax({
            url: "php/crud_matriculas.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (data) {
                let tbody = $('#tablaMatriculas');
                tbody.empty();
                $('#totalRegistrosMatriculas').text(data.length);
                $.each(data, function (index, m) {
                    let badgeClass = '';
                    if (m.ESTADO === 'Activo')         badgeClass = 'status-active';
                    else if (m.ESTADO === 'Inactivo')  badgeClass = 'status-inactive';
                    else if (m.ESTADO === 'Pendiente') badgeClass = 'status-process';

                    let fila = `
                    <tr data-id="${m.ID_MATRICULA}" data-id-alumno="${m.ID_ALUMNO}" data-id-curso="${m.ID_CURSO}" data-fecha="${m.FECHA_MATRICULA}" data-fecha_escolar="${m.FECHA_ESCOLAR}" data-turno="${m.TURNO}" data-estado="${m.ESTADO}" data-observaciones="${m.OBSERVACIONES ?? ''}">
                        <td>${m.ID_MATRICULA}</td>
                        <td>${m.NOMBRE_ALUMNO}</td>
                        <td>${m.NOMBRE_CURSO}</td>
                        <td>${m.FECHA_MATRICULA}</td>
                        <td>${m.FECHA_ESCOLAR}</td>
                        <td>${m.TURNO}</td>
                        <td><span class="status-badge ${badgeClass}">${m.ESTADO}</span></td>
                        <td class="action-icons"><i class="fa-solid fa-pen-to-square"></i><i class="fa-solid fa-eye"></i><i class="fa-solid fa-trash"></i></td>
                    </tr>`;
                    tbody.append(fila);
                });
            }
        });
    }
    cargarMatriculas();
});

// =====================================================================
// MÓDULO PAGOS
// =====================================================================
$(document).ready(function () {

    function cargarSelects() {
        $.ajax({
            url: "php/crud_pagos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 5 },
            success: function (data) {
                let selectMatricula = $('#modalPago #id_matricula');
                selectMatricula.find('option:not(:first)').remove();
                $.each(data.matriculas, function (i, m) {
                    selectMatricula.append(`<option value="${m.ID_MATRICULA}">${m.DESCRIPCION}</option>`);
                });
            }
        });
    }

    // 1. ABRIR MODAL
    $(document).on('click', '#modulo-pagos .btn-nuevo-pago', function () {
        $('#formPago')[0].reset();
        $('#modalPago #opcion').val('1');
        $('#modalTituloPago').text('Registrar Nuevo Pago');
        cargarSelects();
        $('#resumenMatricula').hide();
        $('#modalPago').fadeIn();
    });

    // MOSTRAR INFO DE MATRÍCULA
    $(document).on('change', '#modalPago #id_matricula', function () {
        let selectedText = $(this).find('option:selected').text();
        if ($(this).val() !== '') {
            let partes = selectedText.split(' - ');
            $('#nombreAlumno').text(partes[0]);
            $('#nombreCurso').text(partes[1]);
            $('#resumenMatricula').slideDown(300);
        } else {
            $('#resumenMatricula').slideUp(300);
        }
    });

    // 2. CERRAR MODAL
    $(document).on('click', '#modalPago .btn-cerrar-modal', function () {
        $('#modalPago').fadeOut();
    });

    // 3. ENVIAR FORMULARIO
    $('#formPago').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_pagos.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(),
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalPago').fadeOut();
                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success').then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    // 4. ELIMINAR
    $(document).on('click', '#modulo-pagos .fa-trash', function () {
        let fila = $(this).closest('tr');
        let idPago = fila.find('td:eq(0)').text();

        Swal.fire({
            title: '¿Eliminar Pago?',
            text: "Se borrará permanentemente de la Base de Datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/crud_pagos.php",
                    type: "POST",
                    dataType: "json",
                    data: { opcion: 3, id_pago: idPago },
                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.fadeOut(400, function () {
                                $(this).remove();
                                $('#totalRegistrosPagos').text($('#tablaPagos tr').length);
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

    // 5. EDITAR
    $(document).on('click', '#modulo-pagos .fa-pen-to-square', function () {
        let fila = $(this).closest('tr');
        let idPago        = fila.data('id');
        let idMatricula   = fila.data('id-matricula');
        let concepto      = fila.data('concepto');
        let monto         = fila.data('monto');
        let fechaPago     = fila.data('fecha');
        let metodoPago    = fila.data('metodo');
        let estado        = fila.data('estado');
        let observaciones = fila.data('observaciones');

        cargarSelects();
        setTimeout(function () {
            $('#modalPago #id_pago').val(idPago);
            $('#modalPago #opcion').val('2');
            $('#modalTituloPago').text('Editar Pago');
            $('#modalPago #id_matricula').val(idMatricula);
            $('#concepto').val(concepto);
            $('#monto').val(monto);
            $('#fecha_pago').val(fechaPago);
            $('#modalPago #metodo_pago').val(metodoPago);
            $('#modalPago #estado').val(estado);
            $('#modalPago #observaciones').val(observaciones);
        }, 300);
        $('#modalPago').fadeIn();
    });

    // CARGAR TABLA
    function cargarPagos() {
        $.ajax({
            url: "php/crud_pagos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (data) {
                let tbody = $('#tablaPagos');
                tbody.empty();
                $('#totalRegistrosPagos').text(data.length);
                $.each(data, function (index, p) {
                    let badgeClass = '';
                    if (p.ESTADO === 'Pagado')         badgeClass = 'status-active';
                    else if (p.ESTADO === 'Pendiente') badgeClass = 'status-process';
                    else if (p.ESTADO === 'Anulado')   badgeClass = 'status-inactive';
                    let montoFormateado = 'S/. ' + parseFloat(p.MONTO).toFixed(2);

                    let fila = `
                    <tr data-id="${p.ID_PAGO}" data-id-matricula="${p.ID_MATRICULA}" data-concepto="${p.CONCEPTO}" data-monto="${p.MONTO}" data-fecha="${p.FECHA_PAGO}" data-metodo="${p.METODO_PAGO}" data-estado="${p.ESTADO}" data-observaciones="${p.OBSERVACIONES ?? ''}">
                        <td>${p.ID_PAGO}</td>
                        <td>${p.NOMBRE_ALUMNO}</td>
                        <td>${p.CONCEPTO}</td>
                        <td>${montoFormateado}</td>
                        <td>${p.FECHA_PAGO}</td>
                        <td>${p.METODO_PAGO}</td>
                        <td><span class="status-badge ${badgeClass}">${p.ESTADO}</span></td>
                        <td class="action-icons"><i class="fa-solid fa-pen-to-square"></i><i class="fa-solid fa-eye"></i><i class="fa-solid fa-trash"></i></td>
                    </tr>`;
                    tbody.append(fila);
                });
            }
        });
    }
    cargarPagos();
});

// =====================================================================
// MÓDULO CONFIGURACIÓN
// =====================================================================
$(document).ready(function () {

    function cargarConfiguracion() {
        $.ajax({
            url: "php/crud_configuracion.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (config) {
                if (config.nombre_colegio) $('#nombre_colegio').val(config.nombre_colegio);
                if (config.correo)         $('#correo').val(config.correo);
                if (config.direccion)      $('#direccion').val(config.direccion);
                if (config.telefono)       $('#telefono').val(config.telefono);
                if (config.fecha_escolar)  $('#fecha_escolar').val(config.fecha_escolar);
            }
        });
    }
    cargarConfiguracion();

    $('#formColegio').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_configuracion.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize() + '&opcion=1',
            success: function (respuesta) {
                if (respuesta.exito) {
                    Swal.fire({icon: 'success', title: '¡Guardado!', text: respuesta.mensaje, timer: 2000, showConfirmButton: false});
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    $('#formFecha').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_configuracion.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize() + '&opcion=2',
            success: function (respuesta) {
                if (respuesta.exito) {
                    Swal.fire({icon: 'success', title: '¡Guardado!', text: respuesta.mensaje, timer: 2000, showConfirmButton: false});
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    $('#formPassword').submit(function (e) {
        e.preventDefault();
        let passwordNueva     = $('#password_nueva').val();
        let passwordConfirmar = $('#password_confirmar').val();

        if (passwordNueva !== passwordConfirmar) {
            $('#alertPassword').show();
            return;
        }
        $('#alertPassword').hide();

        $.ajax({
            url: "php/crud_configuracion.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize() + '&opcion=3',
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#formPassword')[0].reset();
                    Swal.fire({icon: 'success', title: '¡Actualizado!', text: respuesta.mensaje, timer: 2000, showConfirmButton: false});
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    $(document).on('click', '.toggle-pass', function () {
        let targetId = $(this).data('target');
        let input    = $('#' + targetId);
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            $(this).removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            $(this).removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    $('#password_confirmar').on('input', function () {
        if ($('#password_nueva').val() === $(this).val()) {
            $('#alertPassword').hide();
        }
    });
});

// =====================================================================
// DASHBOARD DE KPIS Y GRÁFICOS
// =====================================================================
let chartGenero = null;
let chartNiveles = null;

$(document).ready(function () {
    if ($('#kpiTotalAlumnos').length === 0) return;

    function nombreGenero(valor) {
        if (valor === 'M') return 'Masculino';
        if (valor === 'F') return 'Femenino';
        return valor ? valor : 'Sin definir';
    }

    function dibujarGraficoGenero(etiquetas, datos) {
        const ctx = document.getElementById('graficoGenero').getContext('2d');
        if (chartGenero) chartGenero.destroy();
        chartGenero = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'Alumnos',
                    data: datos,
                    backgroundColor: ['#3498DB', '#E74C3C', '#F1C40F', '#2ECC71'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    function dibujarGraficoNiveles(etiquetas, totales, disponibles) {
        const ctx = document.getElementById('graficoNiveles').getContext('2d');
        if (chartNiveles) chartNiveles.destroy();
        chartNiveles = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: etiquetas,
                datasets: [
                    { label: 'Vacantes Totales',     data: totales,     backgroundColor: '#5A9BDC', borderRadius: 8 },
                    { label: 'Vacantes Disponibles', data: disponibles, backgroundColor: '#2ECC71', borderRadius: 8 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    function cargarDashboard() {
        $.ajax({
            url: 'php/dashboard_datos.php',
            type: 'GET',
            dataType: 'json',
            success: function (respuesta) {
                if (!respuesta.exito) { console.error('Error dashboard:', respuesta.mensaje); return; }
                const kpis = respuesta.datos.kpis;
                $('#kpiTotalAlumnos').text(kpis.totalAlumnos);
                $('#kpiTotalAulas').text(kpis.totalAulas);
                $('#kpiVacantesDisp').text(kpis.vacantesDisp);

                const generos = respuesta.datos.graficos.genero.map(item => ({ label: nombreGenero(item.GENERO), value: item.cantidad }));
                dibujarGraficoGenero(generos.map(g => g.label), generos.map(g => g.value));

                const niveles = respuesta.datos.graficos.niveles;
                dibujarGraficoNiveles(
                    niveles.map(n => n.NIVEL),
                    niveles.map(n => Number(n.totales)),
                    niveles.map(n => Number(n.disponibles))
                );
            },
            error: function (err) { console.error('Error AJAX dashboard:', err); }
        });
    }
    cargarDashboard();
});

// =====================================================================
// FUNCIONES GLOBALES
// =====================================================================
function toggleDropdown() {
    document.getElementById('dropdownMenu').classList.toggle('show');
    document.getElementById('dropdownBtn').classList.toggle('open');
}
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-dropdown-wrap')) {
        document.getElementById('dropdownMenu')?.classList.remove('show');
        document.getElementById('dropdownBtn')?.classList.remove('open');
    }
});

function cerrarSesion() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Se cerrará tu sesión actual.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('php/logout.php')
                .then(() => window.location.replace('login.php'))
                .catch(() => window.location.replace('login.php'));
        }
    });
}

function irA(url) { window.location.replace(url); }

function irAModulo(m) {
    localStorage.setItem('moduloActivo', m);
    window.location.replace('modulos.php');
}

// ── BÚSQUEDA GLOBAL ──────────────────────────────
let searchTimer = null;

const iconos    = { alumno: 'fa-user-graduate', matricula: 'fa-file-contract', pago: 'fa-money-bill-wave' };
const labels    = { alumno: 'Alumnos',          matricula: 'Matrículas',        pago: 'Pagos' };
const modulos   = { alumno: 'estudiantes',       matricula: 'matriculas',        pago: 'pagos' };
const grupoAKey = { alumnos: 'alumno', matriculas: 'matricula', pagos: 'pago' };

const modulosDirectos = {
    'dashboard': 'dashboard',    'inicio': 'dashboard',
    'estudiante': 'estudiantes', 'estudiantes': 'estudiantes',
    'alumno': 'estudiantes',     'alumnos': 'estudiantes',
    'curso': 'cursos',           'cursos': 'cursos',
    'grado': 'cursos',           'grados': 'cursos',
    'aula': 'aulas',             'aulas': 'aulas',
    'matricula': 'matriculas',   'matriculas': 'matriculas',
    'matrícula': 'matriculas',   'matrículas': 'matriculas',
    'pago': 'pagos',             'pagos': 'pagos',
    'config': 'configuracion',   'configuracion': 'configuracion',
    'configuración': 'configuracion',
};

const iconosModulo = {
    'dashboard': 'fa-house',      'estudiantes': 'fa-user-graduate',
    'cursos': 'fa-book',          'aulas': 'fa-chalkboard',
    'matriculas': 'fa-file-contract', 'pagos': 'fa-money-bill-wave',
    'configuracion': 'fa-gear',
};

$('#inputBusqueda').on('input', function () {
    clearTimeout(searchTimer);
    const q = $(this).val().trim();

    if (q.length < 2) { $('#searchResults').hide(); return; }

    const qLower = q.toLowerCase().trim();
    if (modulosDirectos[qLower]) {
        const destino = modulosDirectos[qLower];
        const icono   = iconosModulo[destino] || 'fa-arrow-right';
        $('#searchResults').empty().append(`
            <div class="search-group-title">Módulos</div>
            <div class="search-item" onclick="irAModulo('${destino}'); $('#searchResults').hide();">
                <div class="search-item-icon alumno">
                    <i class="fa-solid ${icono}"></i>
                </div>
                <div class="search-item-text">
                    <strong>Ir a ${destino.charAt(0).toUpperCase() + destino.slice(1)}</strong>
                    <span>Navegar al módulo</span>
                </div>
            </div>
        `).show();
        return;
    }

    searchTimer = setTimeout(function () {
        $.get('php/dashboard_busqueda.php', { opcion: 'buscar', q: q }, function (data) {
            const $res = $('#searchResults');
            $res.empty();
            let total = 0;

            ['alumnos', 'matriculas', 'pagos'].forEach(function (grupo) {
                const key   = grupoAKey[grupo];
                const items = data[grupo] || [];
                if (!items.length) return;
                total += items.length;

                $res.append(`<div class="search-group-title">${labels[key]}</div>`);
                items.forEach(function (item) {
                    $res.append(`
                        <div class="search-item" onclick="irAModulo('${modulos[key]}')">
                            <div class="search-item-icon ${key}">
                                <i class="fa-solid ${iconos[key]}"></i>
                            </div>
                            <div class="search-item-text">
                                <strong>${item.texto}</strong>
                                <span>${item.detalle}</span>
                            </div>
                        </div>
                    `);
                });
            });

            if (!total) $res.append('<div class="search-empty">Sin resultados para "<em>' + q + '</em>"</div>');
            $res.show();

        }, 'json').fail(function () {
            $('#searchResults').html('<div class="search-empty">Error al conectar con el servidor.</div>').show();
        });
    }, 300);
});

$(document).on('click', function (e) {
    if (!$(e.target).closest('#searchWrap').length) $('#searchResults').hide();
});