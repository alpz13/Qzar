function rellenaCuadritos(cuadritos){
	var huerta = $(".renglon");
	$(cuadritos).each(function(){
		var target = $(huerta[$(this)[0].y]).find(".cuadrito")[$(this)[0].x];
		$(target).html($(this)[0].numeroSector);
		$(target).attr('bgcolor', $(this)[0].color);
		$(target).attr('title', $(this)[0].nombre);
		$(target).attr('data-toggle', "tooltip");
		$(target).attr('data-placement', "top");
		$(target).attr('data-container', "body");
	});
}

$(document).ready(
  function () {
    rellenaCuadritos(cuadritos);
    $('[data-toggle="tooltip"]').tooltip(); 
  }
);