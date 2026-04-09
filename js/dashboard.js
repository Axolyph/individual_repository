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
        url: "php/crud_alumnos.php",
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
                url: "php/crud_alumnos.php",
                type: "POST",
                dataType: "json",
                data: { opcion: 3, id_alumno: idAlumno }, // Enviamos opción 3 (Eliminar) y el ID
            success: function (respuesta) {
                if (respuesta.exito) {
                    fila.fadeOut(400, function() {
                $(this).remove(); });
                
                Swal.fire('Eliminado', respuesta.mensaje,'success');
                }
                }
            });
            }
        });
    });
// 5. EDITAR REGISTRO (Botón de Lápiz - Solo lógica inicial)
    $(document).on('click', '.fa-pen-to-square', function () {
        let fila = $(this).closest('tr');
        let idAlumno  = fila.find('td:eq(0)').text();
        let nombres   = fila.find('td:eq(1)').text();
        let apellidos = fila.find('td:eq(2)').text();
        let dni       = fila.find('td:eq(3)').text();
        let fechaNac  = fila.find('td:eq(4)').text();
        let celular   = fila.find('td:eq(5)').text();
        let correo    = fila.find('td:eq(6)').text();
        let estado    = fila.find('td:eq(7) span').text().trim();
    // Cargar datos al formulario
        $('#id_alumno').val(idAlumno);
        $('#opcion').val('2'); // Configurar acción: EDITAR
        $('#modalTitulo').text('Editar Alumno');
        $('#password').removeAttr('required'); // Contraseña opcional al editar
    // PISTA: Para un proyecto completo, aquí debes llenar el resto de los $('#campo').val()
        $('#dni').val(dni);
        $('#nombres').val(nombres);
        $('#apellidos').val(apellidos);
        $('#fecha_nac').val(fechaNac);
        $('#celular').val(celular);
        $('#correo').val(correo);
        $('#estado').val(estado);

    $('#modalAlumno').fadeIn();
        });
/* ========================================================
FUNCIÓN PARA CARGAR LA TABLA DESDE MYSQL
======================================================== */
    function cargarAlumnos() {
        $.ajax({
            url: "php/crud_alumnos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 }, // Le pedimos a PHP que ejecute el case 4
        success: function (data) {
            let tbody = $('#tablaAlumnos');
            tbody.empty(); // Limpiamos la tabla por si había algo antes
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
            let fila = `
            <tr>
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