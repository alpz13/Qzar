function rellenaCuadritos(cuadritos){
	var huerta = $(".renglon");
	$(cuadritos).each(function(){
		var target = $(huerta[$(this)[0].y]).find(".cuadrito")[$(this)[0].x];
		$(target).html($(this)[0].numeroSector);
		$(target).attr('bgcolor', $(this)[0].color);
	});
}

$(document).ready(
  function () {
    rellenaCuadritos(cuadritos);
  }
);

//Jquery
script(src='/bootstrap/js/jquery.js')