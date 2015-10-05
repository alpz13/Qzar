
$(document).ready(
  function(){
  $('#full-clndr').clndr(
    {
      template: $('.todo').html(),
      events: [
        { date: '2015-10-10', name: 'evento 1', location: 'http://github.com/kylestetz/CLNDR' },
        { date: '2015-10-10', name: 'evento 1', location: 'http://github.com/kylestetz/CLNDR' },
        { date: '2015-10-10', name: 'evento 1', location: 'http://github.com/kylestetz/CLNDR' },
        { date: '2015-10-10', name: 'evento 1', location: 'http://github.com/kylestetz/CLNDR' },
        { date: '2015-10-11', name: 'evento 2', location: 'http://github.com/kylestetz/CLNDR' },
        { date: '2015-10-11', name: 'evento 3', location: 'http://github.com/kylestetz/CLNDR' },
        { date: '2015-12-10', name: 'CLNDR GitHub Page Finished', location: 'http://github.com/kylestetz/CLNDR' }
      ],
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
});
function llenaPanelEventos(eventos){
  var htmlALlenar = "";
  $(eventos).each(function(){
      htmlALlenar+="<div class='event-item'>";
      htmlALlenar+="<div class='event-item-date'>"+this.date+"</div>";
      htmlALlenar+="<div class='event-item-name'>"+this.name+"</div>";
      htmlALlenar+="<div class='event-item-location'>"+this.location+"</div>";
      htmlALlenar+="</div>";
    });
  //$(htmlALlenar).appendTo('#eventos-del-dia');
  $('#eventos-del-dia').html(htmlALlenar);
}
