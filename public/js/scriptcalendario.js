function estandarizarFecha(date) {
  date = new Date(date);
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var today = dd + '/' + mm + '/' + yyyy;
  return today;
}
function obtenerEventos() {
  var url = window.location.href;
  url = url.split('/');

  $.post("/modulos/itinerario",
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
    obtenerEventos();
  }
);

function llenaPanelEventos(eventos, date) {
  var htmlALlenar = "";
  $(eventos).each(function () {
    htmlALlenar += "<div class='event-item'>";
    htmlALlenar += "<div class='event-item-name'>Actividad: " + this.title + "</div>";
    htmlALlenar += "<div class='event-item-location'>Sector: " + this.numeroSector + "</div>";
    htmlALlenar += "</div>";
  });
  //$(htmlALlenar).appendTo('#eventos-del-dia');
  $('#eventos-del-dia').html(htmlALlenar);
  //var today = new Date(); var dd = today.getDate(); var mm = today.getMonth()+1; //January is 0! var yyyy = today.getFullYear(); if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = dd+'/'+mm+'/'+yyyy; document.getElementById("DATE").value = today;
  var today = estandarizarFecha(date);
  $('#titulo-eventos-del-dia').html('Eventos del día - ' + today);
}

function llenarCalendario(data) {
  // alert("Data: " + data);
  console.log("info: " + data);
  $('#full-clndr').clndr(
    {
      template: $('.todo').html(),
      events: data,
      multiDayEvents: {
        startDate: 'startDate',
        endDate: 'endDate',
        singleDay: 'date'
      },
      daysOfTheWeek: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      clickEvents: {
        click: function (target) {
          console.log(target);
          llenaPanelEventos(target.events, target.date);
        },
        onMonthChange: function (month) {
          console.log('you just went to ' + month.format('MMMM, YYYY'));
        }
      },
      doneRendering: function () {
        console.log('this would be a fine place to attach custom event handlers.');
      }
    }
  );
}
