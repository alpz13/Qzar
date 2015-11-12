$("#editarModulo").click(function() {

    var moduloActualizado = {
        nombre: $("#nombre").val(),
        numero: $("#numero").val()
    };

    $.post($(location).attr("href") + "/actualizar", moduloActualizado, function(respuesta){
		respuesta = JSON.parse(respuesta);
		if (!respuesta.error) {
            $("#nombreModulo").html("<h1 id='h1VerModulos'>Módulo " + moduloActualizado.nombre + "</h1>");
            $("#numeroModulo").html(moduloActualizado.numero);

			// Sí, deben ser dos clicks, si no, no se cierra la sombra del modal.
			$("#cerrarModal").click();
			$("#cerrarModal").click();
		} else {
            $("#mensajeActualizacion").html(respuesta.error);
		}
    });
});
