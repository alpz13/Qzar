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
  $(eventos).each(function () {
    htmlALlenar += "<div class='event-item'>";
    htmlALlenar += "<div class='event-item-location'>" + this.descripcion + "</div>";
    htmlALlenar += "</div>";
  });
  //$(htmlALlenar).appendTo('#eventos-del-dia');
  $('#eventos-del-dia').html(htmlALlenar);
  //var today = new Date(); var dd = today.getDate(); var mm = today.getMonth()+1; //January is 0! var yyyy = today.getFullYear(); if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = dd+'/'+mm+'/'+yyyy; document.getElementById("DATE").value = today;
  var today = estandarizarFecha(date);
  $('#titulo-eventos-del-dia').html('Retroalimentación del día - ' + today);
}
