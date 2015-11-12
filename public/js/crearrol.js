$(document).ready( function() {
    $("#crearRol").click(function() {
        var rolNuevo = {
            nombre: $("#nombre").val(),
            permisos: $("#checkboxes input:checkbox:checked").map(function(){return $(this).val();}).get(),
        };

        $.post("/roles/crear", rolNuevo, function(respuesta){
            alert(respuesta);
            window.location.assign("/roles/");
            /*
            if (respuesta.match(/^\d+$/)) {
                window.location.assign("/modulos/" + respuesta);
            } else {
                $("#mensajeAgregaModulo").html(respuesta);
            }
            */
        });
    });
});

/*
$.post("/roles/crear", rolNuevo, function(respuesta){
    if (respuesta.match(/^\d+$/)) {
        window.location.assign("/modulos/" + respuesta);
    } else {
        $("#mensajeAgregaModulo").html(respuesta);
    }
});
*/
