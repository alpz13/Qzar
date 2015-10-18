$("#crearModulo").click(function() {

    var moduloNuevo = {
        nombre: $("#nombre").val(),
        numero: $("#numero").val(),
        admin: $("#admin").val()
    };

    $.post("/modulos/nuevo", moduloNuevo, function(respuesta){
        if (respuesta.match(/^\d+$/)) {
            window.location.assign("/modulos/" + respuesta);
        } else {
            $("#mensajeAgregaModulo").html(respuesta);
        }
    });
});
