$(document).ready(function () {
// 1. ABRIR MODAL PARA NUEVO CURSO
    $('.btn-nuevo-curso').on('click', function () {
        $('#formCurso')[0].reset(); // Limpiar formulario
        $('#opcion').val('1'); // Configurar acción: CREAR
        $('#modalTitulo').text('Registrar Nuevo Curso');
        $('#modalCurso').fadeIn();
    });

// 2. CERRAR MODAL
    $('.btn-cerrar-modal').on('click', function () {
        $('#modalCurso').fadeOut();
    });

// 3. ENVIAR FORMULARIO (CREAR O EDITAR)
    $('#formCurso').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: "php/crud_cursos.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(), // Empaqueta todos los campos automáticamente
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalCurso').fadeOut();
                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success').then(() => {
                        location.reload(); // Recargar para ver los cambios en la tabla
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

// 4. ELIMINAR CURSO (Click en el basurero)
    $(document).on('click', '.fa-trash', function () {
        // Obtenemos la fila y buscamos el ID del curso (que está en la primera columna <td>)
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
                    data: { opcion: 3, id_curso: idCurso }, // Enviamos opción 3 (Eliminar) y el ID
                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.fadeOut(400, function () {
                                $(this).remove();
                                // Actualizar el contador después de eliminar la fila
                                $('#totalRegistros').text($('#tablaCursos tr').length);
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

// 5. EDITAR CURSO (Botón de Lápiz)
    $(document).on('click', '.fa-pen-to-square', function () {
        let fila = $(this).closest('tr');

        // Leemos todos los datos desde los atributos data-* de la fila
        // Así recuperamos campos que NO están visibles en las columnas de la tabla
        let idCurso        = fila.data('id');
        let nombreCurso    = fila.data('nombre');
        let descripcion    = fila.data('descripcion');
        let nivel          = fila.data('nivel');
        let grado          = fila.data('grado');
        let horasSemanales = fila.data('horas');
        let estado         = fila.data('estado');

        // Cargar TODOS los datos al formulario
        $('#id_curso').val(idCurso);
        $('#opcion').val('2'); // Configurar acción: EDITAR
        $('#modalTitulo').text('Editar Curso');
        $('#nombre_curso').val(nombreCurso);
        $('#descripcion').val(descripcion);
        $('#nivel').val(nivel);
        $('#grado').val(grado);
        $('#horas_semanales').val(horasSemanales);
        $('#estado').val(estado);

        $('#modalCurso').fadeIn();
    });

/* ========================================================
FUNCIÓN PARA CARGAR LA TABLA DESDE MYSQL
======================================================== */
    function cargarCursos() {
        $.ajax({
            url: "php/crud_cursos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 }, // Le pedimos a PHP que ejecute el case 4
            success: function (data) {
                let tbody = $('#tablaCursos');
                tbody.empty(); // Limpiamos la tabla por si había algo antes

                // Actualizar el contador con el total real de la base de datos
                $('#totalRegistros').text(data.length);

                // Usamos un bucle para recorrer cada curso que llegó desde la Base de Datos
                $.each(data, function (index, curso) {

                    // BADGE DE ESTADO
                    let badgeClass = '';
                    let badgeTexto = curso.ESTADO;
                    if (curso.ESTADO === 'Activo') {
                        badgeClass = 'status-active';
                    } else if (curso.ESTADO === 'Inactivo') {
                        badgeClass = 'status-inactive';
                    }

                    // Construimos la fila (tr) inyectando las variables de la base de datos
                    // IMPORTANTE: guardamos todos los campos en atributos data-* para poder
                    // recuperarlos completos al momento de editar
                    let fila = `
                    <tr
                        data-id="${curso.ID_CURSO}"
                        data-nombre="${curso.NOMBRE_CURSO}"
                        data-descripcion="${curso.DESCRIPCION}"
                        data-nivel="${curso.NIVEL}"
                        data-grado="${curso.GRADO}"
                        data-horas="${curso.HORAS_SEMANALES}"
                        data-estado="${curso.ESTADO}"
                    >
                        <td>${curso.ID_CURSO}</td>
                        <td>${curso.NOMBRE_CURSO}</td>
                        <td>${curso.DESCRIPCION ?? '-'}</td>
                        <td>${curso.NIVEL}</td>
                        <td>${curso.GRADO}</td>
                        <td>${curso.HORAS_SEMANALES}</td>
                        <td><span class="status-badge ${badgeClass}">${badgeTexto}</span></td>
                        <td class="action-icons">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-eye"></i>
                            <i class="fa-solid fa-trash"></i>
                        </td>
                    </tr>
                    `;
                    // Agregamos la fila recién creada a nuestra tabla
                    tbody.append(fila);
                });
            },
            error: function () {
                console.log("Error al cargar los datos de la tabla.");
            }
        });
    }
    // ¡MUY IMPORTANTE! Ejecutar la función apenas cargue la página
    cargarCursos();
});