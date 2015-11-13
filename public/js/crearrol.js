$(document).ready( function() {
    $("#crearRol").click(function() {
        var rolNuevo = {
            'nombre': $("#nombre").val(),
            'permisos': $("#checkboxes input:checkbox:checked").map(function(){return $(this).val();}).get(),
        };

        $.post("/roles/crear", rolNuevo, function(respuesta) {
            if(respuesta == '1') {
                alert('Rol creado exitosamente!');
            } else {
                alert(respuesta);
            }
            window.location.assign("/roles/");
        });
    });
});