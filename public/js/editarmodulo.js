$("#editarModulo").click(function() {

    var moduloActualizado = {
        nombre: $("#nombre").val(),
        numero: $("#numero").val(),
        admin: $("#admin").val()
    };

    $.post($(location).attr("href") + "/actualizar", moduloActualizado, function(respuesta){
		if (respuesta == "Correcto") {
            $("#nombreModulo").html(moduloActualizado.nombre);
            $("#numeroModulo").html(moduloActualizado.numero);
            $("#administradorModulo").html($("#admin").find("option:selected").text());
			// Sí, deben ser dos clicks, si no, no se cierra la sombra del modal.
			$("#cerrarModalEditar").click();
			$("#cerrarModalEditar").click();
		} else {
            $("#mensajeActualizacion").html(respuesta);
		}
    });
});
