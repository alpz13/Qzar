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
    htmlALlenar += "<div class='retro-item-location'>Retroalimentación: " + this.descripcion + "</div>";
    htmlALlenar += "<div id='retro-item-image'></div>";
    imagen = this.ruta;
    if(imagen != 'none'){
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
