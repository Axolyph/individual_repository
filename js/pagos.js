$(document).ready(function () {

    /* ========================================================
       FUNCIÓN AUXILIAR: Cargar matrículas en el select
    ======================================================== */
    function cargarSelects() {
        $.ajax({
            url: "php/crud_pagos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 5 },
            success: function (data) {
                // Limpiar select conservando la opción vacía inicial
                $('#id_matricula').find('option:not(:first)').remove();

                // Llenar select de matrículas
                $.each(data.matriculas, function (i, m) {
                    $('#id_matricula').append(
                        `<option value="${m.ID_MATRICULA}">${m.DESCRIPCION}</option>`
                    );
                });
            }
        });
    }

    /* ========================================================
       1. ABRIR MODAL PARA NUEVO PAGO
    ======================================================== */
    $('.btn-nuevo-pago').on('click', function () {
        $('#formPago')[0].reset();
        $('#opcion').val('1');
        $('#modalTitulo').text('Registrar Nuevo Pago');
        cargarSelects();
        $('#resumenMatricula').hide();
        $('#modalPago').fadeIn();
    });

    /* ========================================================
       1.5 MOSTRAR INFO CUANDO SE SELECCIONA UNA MATRÍCULA
    ======================================================== */
    $(document).on('change', '#id_matricula', function () {
        let selectedText = $(this).find('option:selected').text();
        
        if ($(this).val() !== '') {
            // Parsear el texto: "Juan Pérez - 6to Primaria (2026)"
            let partes = selectedText.split(' - ');
            let nombreAlumno = partes[0];
            let nombreCurso = partes[1];
            
            $('#nombreAlumno').text(nombreAlumno);
            $('#nombreCurso').text(nombreCurso);
            $('#resumenMatricula').slideDown(300);
        } else {
            $('#resumenMatricula').slideUp(300);
        }
    });

    /* ========================================================
       2. CERRAR MODAL
    ======================================================== */
    $('.btn-cerrar-modal').on('click', function () {
        $('#modalPago').fadeOut();
    });

    /* ========================================================
       3. ENVIAR FORMULARIO (CREAR O EDITAR)
    ======================================================== */
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

    /* ========================================================
       4. ELIMINAR PAGO (Click en el basurero)
    ======================================================== */
    $(document).on('click', '.fa-trash', function () {
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
                                $('#totalRegistros').text($('#tablaPagos tr').length);
                            });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

    /* ========================================================
       5. EDITAR PAGO (Botón de Lápiz)
    ======================================================== */
    $(document).on('click', '.fa-pen-to-square', function () {
        let fila = $(this).closest('tr');

        let idPago        = fila.data('id');
        let idMatricula   = fila.data('id-matricula');
        let concepto      = fila.data('concepto');
        let monto         = fila.data('monto');
        let fechaPago     = fila.data('fecha');
        let metodoPago    = fila.data('metodo');
        let estado        = fila.data('estado');
        let observaciones = fila.data('observaciones');

        // Cargar selects y luego asignar valores
        cargarSelects();

        setTimeout(function () {
            $('#id_pago').val(idPago);
            $('#opcion').val('2');
            $('#modalTitulo').text('Editar Pago');
            $('#id_matricula').val(idMatricula);
            $('#concepto').val(concepto);
            $('#monto').val(monto);
            $('#fecha_pago').val(fechaPago);
            $('#metodo_pago').val(metodoPago);
            $('#estado').val(estado);
            $('#observaciones').val(observaciones);
        }, 300);

        $('#modalPago').fadeIn();
    });

    /* ========================================================
       FUNCIÓN PARA CARGAR LA TABLA DESDE MYSQL
    ======================================================== */
    function cargarPagos() {
        $.ajax({
            url: "php/crud_pagos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (data) {
                let tbody = $('#tablaPagos');
                tbody.empty();
                $('#totalRegistros').text(data.length);

                $.each(data, function (index, p) {
                    // BADGE DE ESTADO
                    let badgeClass = '';
                    if (p.ESTADO === 'Pagado')        badgeClass = 'status-active';
                    else if (p.ESTADO === 'Pendiente') badgeClass = 'status-process';
                    else if (p.ESTADO === 'Anulado')   badgeClass = 'status-inactive';

                    // Formatear monto con símbolo de sol
                    let montoFormateado = 'S/. ' + parseFloat(p.MONTO).toFixed(2);

                    let fila = `
                    <tr
                        data-id="${p.ID_PAGO}"
                        data-id-matricula="${p.ID_MATRICULA}"
                        data-concepto="${p.CONCEPTO}"
                        data-monto="${p.MONTO}"
                        data-fecha="${p.FECHA_PAGO}"
                        data-metodo="${p.METODO_PAGO}"
                        data-estado="${p.ESTADO}"
                        data-observaciones="${p.OBSERVACIONES ?? ''}"
                    >
                        <td>${p.ID_PAGO}</td>
                        <td>${p.NOMBRE_ALUMNO}</td>
                        <td>${p.CONCEPTO}</td>
                        <td>${montoFormateado}</td>
                        <td>${p.FECHA_PAGO}</td>
                        <td>${p.METODO_PAGO}</td>
                        <td><span class="status-badge ${badgeClass}">${p.ESTADO}</span></td>
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
    cargarPagos();
});
