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

function llenarCalendario(data) {
  // alert("Data: " + data);
  console.log("info: " + data);
  $('#full-clndr').clndr(
    {
      template: $('.todo').html(),
      events: data,
      daysOfTheWeek: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      clickEvents: {
        click: function (target) {
          console.log(target);
          llenaPanel(target.events, target.date);
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
