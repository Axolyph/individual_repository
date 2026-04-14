$(document).ready(function () {
// 1. ABRIR MODAL PARA NUEVA AULA
    $('.btn-nueva-aula').on('click', function () {
        $('#formAula')[0].reset(); // Limpiar formulario
        $('#opcion').val('1'); // Configurar acción: CREAR
        $('#modalTitulo').text('Registrar Nueva Aula');
        $('#modalAula').fadeIn();
    });

// 2. CERRAR MODAL
    $('.btn-cerrar-modal').on('click', function () {
        $('#modalAula').fadeOut();
    });

// 3. ENVIAR FORMULARIO (CREAR O EDITAR)
    $('#formAula').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: "php/crud_aulas.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(), // Empaqueta todos los campos automáticamente
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalAula').fadeOut();
                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success').then(() => {
                        location.reload(); // Recargar para ver los cambios en la tabla
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

// 4. ELIMINAR AULA (Click en el basurero)
    $(document).on('click', '.fa-trash', function () {
        // Obtenemos la fila y buscamos el ID del aula (que está en la primera columna <td>)
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
                    data: { opcion: 3, id_aula: idAula }, // Enviamos opción 3 (Eliminar) y el ID
                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.fadeOut(400, function () {
                                $(this).remove();
                                // Actualizar el contador después de eliminar la fila
                                $('#totalRegistros').text($('#tablaAulas tr').length);
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

// 5. EDITAR AULA (Botón de Lápiz)
    $(document).on('click', '.fa-pen-to-square', function () {
        let fila = $(this).closest('tr');

        // Leemos todos los datos desde los atributos data-* de la fila
        // Así recuperamos campos que NO están visibles en las columnas de la tabla
        let idAula              = fila.data('id');
        let nivel               = fila.data('nivel');
        let grado               = fila.data('grado');
        let seccion             = fila.data('seccion');
        let vacantesTotales     = fila.data('vacantes-totales');
        let vacantesDisponibles = fila.data('vacantes-disponibles');

        // Cargar TODOS los datos al formulario
        $('#id_aula').val(idAula);
        $('#opcion').val('2'); // Configurar acción: EDITAR
        $('#modalTitulo').text('Editar Aula');
        $('#nivel').val(nivel);
        $('#grado').val(grado);
        $('#seccion').val(seccion);
        $('#vacantes_totales').val(vacantesTotales);
        $('#vacantes_disponibles').val(vacantesDisponibles);

        $('#modalAula').fadeIn();
    });

/* ========================================================
FUNCIÓN PARA CARGAR LA TABLA DESDE MYSQL
======================================================== */
    function cargarAulas() {
        $.ajax({
            url: "php/crud_aulas.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 }, // Le pedimos a PHP que ejecute el case 4
            success: function (data) {
                let tbody = $('#tablaAulas');
                tbody.empty(); // Limpiamos la tabla por si había algo antes

                // Actualizar el contador con el total real de la base de datos
                $('#totalRegistros').text(data.length);

                // Usamos un bucle para recorrer cada aula que llegó desde la Base de Datos
                $.each(data, function (index, aula) {

                    // BADGE DE VACANTES — verde si hay vacantes, rojo si está llena
                    let badgeClass = aula.VACANTES_DISPONIBLES > 0 ? 'status-active' : 'status-inactive';
                    let badgeTexto = aula.VACANTES_DISPONIBLES > 0 ? aula.VACANTES_DISPONIBLES + ' disponibles' : 'Sin vacantes';

                    // Construimos la fila (tr) inyectando las variables de la base de datos
                    // IMPORTANTE: guardamos todos los campos en atributos data-* para poder
                    // recuperarlos completos al momento de editar
                    let fila = `
                    <tr
                        data-id="${aula.ID_AULA}"
                        data-nivel="${aula.NIVEL}"
                        data-grado="${aula.GRADO}"
                        data-seccion="${aula.SECCION}"
                        data-vacantes-totales="${aula.VACANTES_TOTALES}"
                        data-vacantes-disponibles="${aula.VACANTES_DISPONIBLES}"
                    >
                        <td>${aula.ID_AULA}</td>
                        <td>${aula.NIVEL}</td>
                        <td>${aula.GRADO}</td>
                        <td>${aula.SECCION}</td>
                        <td>${aula.VACANTES_TOTALES}</td>
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
    cargarAulas();
});