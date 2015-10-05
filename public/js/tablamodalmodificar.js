$(document).on("click", ".modificar", function () {	
	var obj = (this).closest("tr");	
	var id = $(obj).find(".id").html();
	var nombre = $(obj).find(".nombre").html();
	var descripcion = $(obj).find(".descripcion").html();
	var img = $(obj).find(".img").html();
	document.getElementById('MIDA').value = id;
	document.getElementById('MNA').value = nombre;
	document.getElementById('MDA').value = descripcion;
	document.getElementById('MIA').value = img;
});

$(document).on("click", ".eliminar", function () {
	var obj = (this).closest("tr");	
	var id = $(obj).find(".id").html();
	$.post("/actividades/eliminaactividad",
          {
              'id': id
          },
          function(data, status){
              location.reload();
          });
});
