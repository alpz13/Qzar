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

function eliminarSector(idContenidoCuadritos, callback){
	console.log("oli");
	$.post("/sector/eliminar",
	{
		'idContenido' : idContenidoCuadritos
	},
	function (data, status){
		console.log("Hola");
		console.log(data);
		console.log(status);
		if(data===0){
      		$("#sectorNoEliminado").modal('show');
      	}
	    else
	    	location.reload();
		}
	);
};


//Ninja para pasar el id
$(document).on("click", ".eliminarModal", function (){
    var obj = (this).closest("tr"); 
    var id = $(obj).find(".id").html();
    $("input.ninja").attr("value", id);
    console.log($("input.ninja"));
});



$(document).on("click", ".eliminarSec", function () {
    var id = $("input.ninja").attr("value");
    eliminarSector(id, function (data){
      console.log(data);
      
  });
});
