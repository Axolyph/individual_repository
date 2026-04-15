$(document).ready(function () {

    /* ========================================================
       CARGAR CONFIGURACIÓN ACTUAL AL INICIAR LA PÁGINA
    ======================================================== */
    function cargarConfiguracion() {
        $.ajax({
            url: "php/crud_configuracion.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (config) {
                // Pre-llenar todos los campos con los valores guardados en la BD
                if (config.nombre_colegio) $('#nombre_colegio').val(config.nombre_colegio);
                if (config.correo)         $('#correo').val(config.correo);
                if (config.direccion)      $('#direccion').val(config.direccion);
                if (config.telefono)       $('#telefono').val(config.telefono);
                if (config.anio_escolar)   $('#anio_escolar').val(config.anio_escolar);
            }
        });
    }

    // Ejecutar al cargar la página
    cargarConfiguracion();

    /* ========================================================
       1. GUARDAR DATOS DEL COLEGIO
    ======================================================== */
    $('#formColegio').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: "php/crud_configuracion.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize() + '&opcion=1',
            success: function (respuesta) {
                if (respuesta.exito) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Guardado!',
                        text: respuesta.mensaje,
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    /* ========================================================
       2. GUARDAR AÑO ESCOLAR
    ======================================================== */
    $('#formAnio').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: "php/crud_configuracion.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize() + '&opcion=2',
            success: function (respuesta) {
                if (respuesta.exito) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Guardado!',
                        text: respuesta.mensaje,
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    /* ========================================================
       3. CAMBIAR CONTRASEÑA
    ======================================================== */
    $('#formPassword').submit(function (e) {
        e.preventDefault();

        let passwordNueva     = $('#password_nueva').val();
        let passwordConfirmar = $('#password_confirmar').val();

        // Validar que las contraseñas coincidan antes de enviar
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
                    Swal.fire({
                        icon: 'success',
                        title: '¡Actualizado!',
                        text: respuesta.mensaje,
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    /* ========================================================
       MOSTRAR / OCULTAR CONTRASEÑA (ojito)
    ======================================================== */
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

    /* ========================================================
       OCULTAR ALERTA DE CONTRASEÑA AL ESCRIBIR
    ======================================================== */
    $('#password_confirmar').on('input', function () {
        if ($('#password_nueva').val() === $(this).val()) {
            $('#alertPassword').hide();
        }
    });

});