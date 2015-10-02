$("#editarModulo").click(function() {
    var moduloActualizado = {
        nombre: $("#nombre").val(),
        numero: $("#numero").val(),
        admin: $("#admin").val()
    };

    $.post($(location).attr("href") + "/editar", moduloActualizado, function(estatus){
		//if (estatus == 200) {
            $("#nombreModulo").html(moduloActualizado.nombre);
            $("#numeroModulo").html(moduloActualizado.numero);
            $("#administradorModulo").html($("#admin").find("option:selected").text());
		//} else {
            // Ponle error.
		//}
    });
});
