$(document).on("click", ".modificar", function () {
	console.log((this).closest("tr"));	
	var obj = (this).closest("tr");	
	var id = $(obj).find(".id").html();
	var nombre = $(obj).find(".nombre").html();
	var descripcion = $(obj).find(".descripcion").html();
	//var img = $(obj).find(".img").html();
	document.getElementById('MIDA').value = id;
	document.getElementById('MNA').value = nombre;
	document.getElementById('MDA').value = descripcion;
	//document.getElementById('MIA').value = img;
});