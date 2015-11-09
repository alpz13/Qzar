$("#crearModulo").click(function() {

    var moduloNuevo = {
        nombre: $("#nombre").val(),
        numero: $("#numero").val(),
        //admin: $("#admin").val()
		admin: null
    };

    $.post("/modulos/nuevo", moduloNuevo, function(respuesta){
		respuesta = JSON.parse(respuesta);
        if (!respuesta.error) {
            window.location.assign("/modulos/" + respuesta.idModulo);
        } else {
            $("#mensajeAgregaModulo").html(respuesta.error);
        }
    });
});
