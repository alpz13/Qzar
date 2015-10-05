
function obtenerEventos(){
  $.post("/modulos/itinerario",
  {
      'modulo': 2
  },
  function(data, status){
      //alert("Data: " + data + "\nStatus: " + status);
      llenarCalendario(data);
  });
}

$(document).ready(
  function(){
  //AJAX
  obtenerEventos();
  
});

function llenaPanelEventos(eventos){
  var htmlALlenar = "";
  $(eventos).each(function(){
      htmlALlenar+="<div class='event-item'>";
      htmlALlenar+="<div class='event-item-date'>"+this.fechaInicio+"</div>";
      htmlALlenar+="<div class='event-item-name'>"+this.nombre+"</div>";
      htmlALlenar+="<div class='event-item-location'>"+this.numeroSector+"</div>";
      htmlALlenar+="</div>";
    });
  //$(htmlALlenar).appendTo('#eventos-del-dia');
  $('#eventos-del-dia').html(htmlALlenar);
}

function llenarCalendario(data){
  $('#full-clndr').clndr(
    {
      template: $('.todo').html(),
      events: data,
      daysOfTheWeek: ['L', 'M', 'M', 'J', 'V', 'S','D'],
      clickEvents: {
        click: function(target) {
          console.log(target);
          //Target :Object {element: div.day.event.calendar-day-2015-10-10.calendar-dow-5, events: Array[1], date: n}
          llenaPanelEventos(target.events);

        },
        onMonthChange: function(month) {
          console.log('you just went to ' + month.format('MMMM, YYYY'));
        }
      },
      doneRendering: function() {
        console.log('this would be a fine place to attach custom event handlers.');
      }
    }
    );
}
