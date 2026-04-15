$(document).ready(function () {
// 1. ABRIR MODAL PARA NUEVO REGISTRO
    $('.btn-primary').on('click', function () {
    $('#formAlumno')[0].reset(); // Limpiar formulario
    $('#opcion').val('1'); // Configurar acción: CREAR
    $('#modalTitulo').text('Registrar Nuevo Alumno');
    $('#password').attr('required', true); // Contraseña obligatoria al crear
    $('#modalAlumno').fadeIn();
    });
// 2. CERRAR MODAL
    $('.btn-cerrar-modal').on('click', function () {
    $('#modalAlumno').fadeOut();
    });
// 3. ENVIAR FORMULARIO (CREAR O EDITAR)
    $('#formAlumno').submit(function (e) {
        e.preventDefault();

    $.ajax({
        url: "php/crud_estudiantes.php",
        type: "POST",
        dataType: "json",
        data: $(this).serialize(), // Empaqueta todos los 14 campos automáticamente
    success: function (respuesta) {
        if (respuesta.exito) {
            $('#modalAlumno').fadeOut();
            Swal.fire('¡Éxito!', respuesta.mensaje,'success').then(() => {
            location.reload(); // Recargar para ver los cambios en la tabla
            });
        } else {
            Swal.fire('Error', respuesta.mensaje, 'error');
    }
    }
    });
    });
// 4. ELIMINAR REGISTRO (Click en el basurero)
    $(document).on('click', '.fa-trash', function () {
    // Obtenemos la fila y buscamos el ID del alumno (que está en la primera columna <td>)
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
                data: { opcion: 3, id_alumno: idAlumno }, // Enviamos opción 3 (Eliminar) y el ID
            success: function (respuesta) {
                if (respuesta.exito) {
                    fila.fadeOut(400, function() {
                        $(this).remove(); 
                        $('#totalRegistros').text($('#tablaAlumnos tr').length);});
                Swal.fire('Eliminado', respuesta.mensaje,'success');
                }
                }
            });
            }
        });
    });
// 5. EDITAR REGISTRO (Botón de Lápiz)
    $(document).on('click', '.fa-pen-to-square', function () {
        let fila = $(this).closest('tr');

        // Leemos todos los datos desde los atributos data-* de la fila
        // Así recuperamos campos que NO están visibles en las columnas de la tabla
        let idAlumno    = fila.data('id');
        let nombres     = fila.data('nombres');
        let apellidos   = fila.data('apellidos');
        let dni         = fila.data('dni');
        let fechaNac    = fila.data('fecha-nac');
        let edad        = fila.data('edad');
        let genero      = fila.data('genero');
        let direccion   = fila.data('direccion');
        let celular     = fila.data('celular');
        let correo      = fila.data('correo');
        let apoderado   = fila.data('apoderado');
        let celApoderado = fila.data('cel-apoderado');
        let username    = fila.data('username');
        let estado      = fila.data('estado');

    // Cargar TODOS los datos al formulario
        $('#id_alumno').val(idAlumno);
        $('#opcion').val('2'); // Configurar acción: EDITAR
        $('#modalTitulo').text('Editar Alumno');
        $('#password').removeAttr('required'); // Contraseña opcional al editar
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
        $('#estado').val(estado);

    $('#modalAlumno').fadeIn();
        });
/* ========================================================
FUNCIÓN PARA CARGAR LA TABLA DESDE MYSQL
======================================================== */
    function cargarAlumnos() {
        $.ajax({
            url: "php/crud_estudiantes.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 }, // Le pedimos a PHP que ejecute el case 4
        success: function (data) {
            let tbody = $('#tablaAlumnos');
            tbody.empty(); // Limpiamos la tabla por si había algo antes
            // Actualizar el contador con el total real de la base de datos
            $('#totalRegistros').text(data.length);
            // Usamos un bucle para recorrer cada alumno que llegó desde la Base de Datos
        $.each(data, function (index, alumno) {
            // BADGE DE ESTADO
                    let badgeClass = '';
                    let badgeTexto = alumno.ESTADO;
                    if (alumno.ESTADO === 'Activo') {
                        badgeClass = 'status-active';
                    } else if (alumno.ESTADO === 'Inactivo') {
                        badgeClass = 'status-inactive';
                    } else if (alumno.ESTADO === 'Proceso') {
                        badgeClass = 'status-process';
                    }
            // Construimos la fila (tr) inyectando las variables de la base de datos
            // IMPORTANTE: guardamos todos los campos en atributos data-* para poder
            // recuperarlos completos al momento de editar, incluso los que no se ven en la tabla
            let fila = `
            <tr
                data-id="${alumno.ID_ALUMNO}"
                data-nombres="${alumno.NOMBRES}"
                data-apellidos="${alumno.APELLIDOS}"
                data-dni="${alumno.DNI_ALUMNO}"
                data-fecha-nac="${alumno.FECHA_NACIMIENTO}"
                data-edad="${alumno.EDAD}"
                data-genero="${alumno.GENERO}"
                data-direccion="${alumno.DIRECCION}"
                data-celular="${alumno.CELULAR}"
                data-correo="${alumno.CORREO}"
                data-apoderado="${alumno.NOMBRE_APODERADO}"
                data-cel-apoderado="${alumno.CELULAR_APODERADO}"
                data-username="${alumno.USERNAME}"
                data-estado="${alumno.ESTADO}"
            >
            <td>${alumno.ID_ALUMNO}</td>
            <td>${alumno.NOMBRES}</td>
            <td>${alumno.APELLIDOS}</td>
            <td>${alumno.DNI_ALUMNO}</td>
            <td>${alumno.FECHA_NACIMIENTO}</td>
            <td>${alumno.CELULAR}</td>
            <td>${alumno.CORREO}</td>
            
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
    cargarAlumnos();
});