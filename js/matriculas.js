$(document).ready(function () {

    /* ========================================================
       FUNCIÓN AUXILIAR: Cargar alumnos y cursos en los selects
    ======================================================== */
    function cargarSelects() {
        $.ajax({
            url: "php/crud_matriculas.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 5 },
            success: function (data) {
                // Limpiar selects conservando la opción vacía inicial
                $('#id_alumno').find('option:not(:first)').remove();
                $('#id_curso').find('option:not(:first)').remove();

                // Llenar select de alumnos
                $.each(data.alumnos, function (i, alumno) {
                    $('#id_alumno').append(
                        `<option value="${alumno.ID_ALUMNO}">${alumno.NOMBRE_COMPLETO}</option>`
                    );
                });

                // Llenar select de cursos
                $.each(data.cursos, function (i, curso) {
                    $('#id_curso').append(
                        `<option value="${curso.ID_CURSO}">${curso.NOMBRE_CURSO} (${curso.NIVEL} ${curso.GRADO})</option>`
                    );
                });
            }
        });
    }

    /* ========================================================
       1. ABRIR MODAL PARA NUEVA MATRÍCULA
    ======================================================== */
    $('.btn-nueva-matricula').on('click', function () {
        $('#formMatricula')[0].reset();
        $('#opcion').val('1');
        $('#modalTitulo').text('Registrar Nueva Matrícula');
        cargarSelects(); // Cargamos los alumnos y cursos frescos de la BD
        $('#modalMatricula').fadeIn();
    });

    /* ========================================================
       2. CERRAR MODAL
    ======================================================== */
    $('.btn-cerrar-modal').on('click', function () {
        $('#modalMatricula').fadeOut();
    });

    /* ========================================================
       3. ENVIAR FORMULARIO (CREAR O EDITAR)
    ======================================================== */
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

    /* ========================================================
       4. ELIMINAR MATRÍCULA (Click en el basurero)
    ======================================================== */
    $(document).on('click', '.fa-trash', function () {
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
                                $('#totalRegistros').text($('#tablaMatriculas tr').length);
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

    /* ========================================================
       5. EDITAR MATRÍCULA (Botón de Lápiz)
    ======================================================== */
    $(document).on('click', '.fa-pen-to-square', function () {
        let fila = $(this).closest('tr');

        let idMatricula    = fila.data('id');
        let idAlumno       = fila.data('id-alumno');
        let idCurso        = fila.data('id-curso');
        let fechaMatricula = fila.data('fecha');
        let anioEscolar    = fila.data('anio');
        let turno          = fila.data('turno');
        let estado         = fila.data('estado');
        let observaciones  = fila.data('observaciones');

        // Primero cargamos los selects y luego seteamos los valores
        cargarSelects();

        // Usamos un pequeño delay para que los selects estén listos antes de asignar valores
        setTimeout(function () {
            $('#id_matricula').val(idMatricula);
            $('#opcion').val('2');
            $('#modalTitulo').text('Editar Matrícula');
            $('#id_alumno').val(idAlumno);
            $('#id_curso').val(idCurso);
            $('#fecha_matricula').val(fechaMatricula);
            $('#anio_escolar').val(anioEscolar);
            $('#turno').val(turno);
            $('#estado').val(estado);
            $('#observaciones').val(observaciones);
        }, 300);

        $('#modalMatricula').fadeIn();
    });

    /* ========================================================
       FUNCIÓN PARA CARGAR LA TABLA DESDE MYSQL
    ======================================================== */
    function cargarMatriculas() {
        $.ajax({
            url: "php/crud_matriculas.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (data) {
                let tbody = $('#tablaMatriculas');
                tbody.empty();
                $('#totalRegistros').text(data.length);

                $.each(data, function (index, m) {
                    // BADGE DE ESTADO
                    let badgeClass = '';
                    if (m.ESTADO === 'Activo')        badgeClass = 'status-active';
                    else if (m.ESTADO === 'Inactivo') badgeClass = 'status-inactive';
                    else if (m.ESTADO === 'Pendiente') badgeClass = 'status-process';

                    let fila = `
                    <tr
                        data-id="${m.ID_MATRICULA}"
                        data-id-alumno="${m.ID_ALUMNO}"
                        data-id-curso="${m.ID_CURSO}"
                        data-fecha="${m.FECHA_MATRICULA}"
                        data-anio="${m.ANIO_ESCOLAR}"
                        data-turno="${m.TURNO}"
                        data-estado="${m.ESTADO}"
                        data-observaciones="${m.OBSERVACIONES ?? ''}"
                    >
                        <td>${m.ID_MATRICULA}</td>
                        <td>${m.NOMBRE_ALUMNO}</td>
                        <td>${m.NOMBRE_CURSO}</td>
                        <td>${m.FECHA_MATRICULA}</td>
                        <td>${m.ANIO_ESCOLAR}</td>
                        <td>${m.TURNO}</td>
                        <td><span class="status-badge ${badgeClass}">${m.ESTADO}</span></td>
                        <td class="action-icons">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-eye"></i>
                            <i class="fa-solid fa-trash"></i>
                        </td>
                    </tr>
                    `;
                    tbody.append(fila);
                });
            },
            error: function () {
                console.log("Error al cargar los datos de la tabla.");
            }
        });
    }

    // Ejecutar al cargar la página
    cargarMatriculas();
});