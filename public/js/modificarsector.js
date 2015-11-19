$(document).on("click", ".modificar", function () { 
	var obj = (this).closest("tr");

	var nombre = $(obj).find(".nombre").html();
    var id = $(obj).find(".id").html();
    var color = $(obj).find(".colores").html();

    document.getElementById('MIDU').value = id;
    document.getElementById('nombreIdentificador').value = nombre;
    document.getElementById('colorIdentificador').value = color;
    $('.modal-content span.input-group-addon i').css("background-color" , color);

});
