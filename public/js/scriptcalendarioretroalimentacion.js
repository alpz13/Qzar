function obtenerRetro() {
  var url = window.location.href;
  url = url.split('/');

  $.post("/retroalimentacion/verRetroalimentacion",
    {
      'modulo': url[url.length - 1]
    },
    function (data) {
      llenarCalendario(data);
    });
}

$(document).ready(
  function () {
  //AJAX
    obtenerRetro();
  }
);

function llenaPanel(eventos, date) {
  var htmlALlenar = "";
  var imagen = 'none';
  $(eventos).each(function () {
    htmlALlenar += "<div class='retro-item'>";
	var htmlActCompletadas = "<p>Actividades completadas:</p><ul>";
	var htmlActNoCompletadas = "<p>Actividades NO completadas:</p><ul>";
	for (var i in this.actividades) {
		if (this.actividades[i].cumplido) {
			htmlActCompletadas += "<li>" + this.actividades[i].nombre + " en sector " + this.actividades[i].numeroSector + "</li>";
		} else {
			htmlActNoCompletadas += "<li>" + this.actividades[i].nombre + " en sector " + this.actividades[i].numeroSector + "</li>";
		}
	}
	htmlALlenar += htmlActCompletadas + "</ul>" + htmlActNoCompletadas + "</ul>";
    htmlALlenar += "<div class='retro-item-location'>Comentario: " + this.descripcion + "</div>";
    htmlALlenar += "<div id='retro-item-image'></div>";
    imagen = this.ruta;
    if(imagen != null){
      htmlALlenar += "<a href=/images/retros/"+imagen+" target='_blank'>Ver en grande</a>";
    }
    htmlALlenar += "</div>";
  });
  console.log(imagen);
  $('#eventos-del-dia').html(htmlALlenar);
  $('#retro-item-image').css("background-image", "url(/images/retros/"+imagen+")");
  var today = estandarizarFecha(date);
  $('#titulo-eventos-del-dia').html('Retroalimentación del día - ' + today);
}
