$(document).on("click", ".modificar", function () { 
	var obj = (this).closest("tr");

	var nombre = $(obj).find(".nombre").html();
	var sector = $(obj).find(".sector").html();
    var fecha = $(obj).find(".fecha").html();
    var modulo = $(obj).find(".modulo").html();
    var contenido = $(obj).find(".contenido").html();
    
    var id = $(obj).find(".id").html();

    document.getElementById('MIDU').value = id;
    document.getElementById('cosechador').value = nombre;
    document.getElementById('sector').value = sector;
    document.getElementById('fecha').value = fecha;
    document.getElementById('modulo').value = modulo;
    document.getElementById('contenido').value = contenido;

    console.log(fecha);
});


