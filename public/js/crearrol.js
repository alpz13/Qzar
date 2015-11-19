$(document).ready( function() {
	$.ajaxSetup({ cache: false });

    $('#crearRol').click(function () {
        var rolNuevo = {
            'nombre': $('#nombre').val(),
            'permisos': $('#checkboxes input:checkbox:checked').map(function(){return $(this).val();}).get(),
        };

        $.post('/roles/crear', rolNuevo, function (respuesta) {
            if(respuesta == '1') {
                //alert('Rol creado exitosamente!');
            } else {
                $('#mensajeModal').html = respuesta;
            }
            window.location.assign('/roles/');
        });
    });

    $('#modificarRol').click(function () {
        var rolModificado = {
            'idRol': $('#idRol').val(),
            'nombre': $('#nombre').val(),
            'permisos': $('#checkboxes input:checkbox:checked').map(function(){return $(this).val();}).get(),
        };

        $.post('/roles/modificar/'+rolModificado.idRol, rolModificado, function (respuesta) {
            if(respuesta == '1') {
                //alert('Rol modificado exitosamente!');
            } else {
                $('#mensajeModal').html = respuesta;
            }
            window.location.assign('/roles/');
        });
    });

	$('#cerrarModal').click(function () {
		limpiarModalRoles();
	});
});

// Resetea modal.
function limpiarModalRoles() {
	$('#tituloModal').html('Agregar rol');
	$('#crearRol').show();
	$('#modificarRol').hide();
    $('#mensajeModal').html('');
	$('#nombre').val('');
    $('#checkboxes input:checkbox:checked').click();
    $('#idRol').val('');
}

function rellenaModalModificarRol(idRol) {
	// Cambia el html del modal.
	limpiarModalRoles();
	$('#tituloModal').html('Modificar rol');
	$('#crearRol').hide();
	$('#modificarRol').show();
    $('#idRol').val(idRol);

	// Rellena formulario con datos del rol.
    $.get('/roles/' + idRol, function (respuesta) {
		respuesta = JSON.parse(respuesta);
        if(respuesta.error) {
			console.log(respuesta);
            $('#mensajeModal').html(respuesta.error);
        } else {
			$('#nombre').val(respuesta.nombre);
			for (var i in respuesta.permisos) {
				$('#permiso'+respuesta.permisos[i]).click();
			}
        }
    });
}


$(document).on("click", ".eliminarModal", function(){
    var obj = (this).closest("tr");
    var id = $(obj).find(".id").html();
    console.log(id);
    $("input.ninja").attr("value", id);

});

$(document).on("click", ".eliminar", function(){
    var id = $("input.ninja").attr("value");
    //html = "<a href='/roles/eliminar/"+id+">"+"</a>";
    window.location.href='/roles/eliminar/'+id;
    //console.log(html);
    //$("#eliminarRoles").replaceWith(html);
});


