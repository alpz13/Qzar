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

function asignarActividad() {
  var url = window.location.href;
  url = url.split('/');
  var idSector = $('#sectorPosible').val();
  var idActividadesRaw = $('.actividades');
  var idActividades = [];
  $(idActividadesRaw).each(function(){
    idActividades.push($(this).val());
  });
  var fechaIni = $('#initDate').val();
  var fechaFin = $('#endDate').val();
  $.post("/asignacion/asignaractividad",
  {
    'idModulo': url[url.length - 1],
    'idSector': idSector,
    'idActividades': JSON.stringify(idActividades),
    'fechaIni': fechaIni,
    'fechaFin': fechaFin
  },
  function (data) {
    console.log("despues");
    console.log(data);
    //$("#full-clnd").load("modulos/2 " + "#full-clnd");
    //location.reload();
  });
}

$(document).ready(
  function () {
    $('.initDate').datepicker({
      format: 'dd/mm/yyyy',
      startDate: '-0d'
    });
    $('.endDate').datepicker({
      format: 'dd/mm/yyyy',
      startDate: '-0d'
    });
  //AJAX
    obtenerEventos();
  }
);

function quitarActividad(){
  if($(".actividadesDiv").length > 1)
    $(".actividadesDiv").first().remove();
}

function agregarActividad(){
  var div = $(".actividadesDiv");
  $('<div class="actividadesDiv">' + div.html() + "</div>").insertAfter("#agregarActividad");
}

function habilitarCamposModalAgregar(){
  $('#actividadPosible').prop('disabled', false);
  $('#sectorPosible').prop('disabled', false);
  $('#initDate').prop('disabled', false);
  $('#endDate').prop('disabled', false);
  $("#boton-modal-asignar").prop('value', 'Agregar');
  $("#boton-modal-asignar").html('Asignar');
  $("#actividadPosible").val("");
  $("#sectorPosible").val("");
  $("#initDate").val("");
  $("#endDate").val("");
  $("#boton-modal-asignar").css('display', 'inline-block');
  $("#boton-habilitar-campos").css("display", "none");
  $("#boton-edicion-asignaciones").css("display", "none");
  $("#boton-borrar-asignaciones").css("display", "none");
  $("#titulo-modal-actividades").html("Asignar actividades");
  $("#boton-borrar-asignaciones").attr("onclick", "");
}

function habilitarCamposModal(){
  $('#actividadPosible').prop('disabled', false);
  $('#sectorPosible').prop('disabled', false);
  $('#initDate').prop('disabled', false);
  $('#endDate').prop('disabled', false);
  $("#boton-modal-asignar").prop('value', 'Editar');
  $("#boton-modal-asignar").css('display', 'none');
  $("#boton-habilitar-campos").css("display", "none");
  $("#boton-edicion-asignaciones").css("display", "inline-block");
  $("#boton-borrar-asignaciones").css("display", "inline-block");
}
function cargarModalAsignar(){
  $('#AAM').modal();
  habilitarCamposModalAgregar();
}

function eliminarActividadesAsignadas(idAsignada){
  console.log(idAsignada);
  $.post("/asignacion/borrarasignacion",
  {
    'idAsignada': idAsignada,
  },
  function (data) {
    console.log(data);
  });
}

function editarActividadesAsignadas(idAsignada){
  eliminarActividadesAsignadas(idAsignada);
  console.log("antes");
  asignarActividad();
}

function cargarModalEditar(idAsignada){
    $('#AAM').modal();
    console.log (this.idSectores);
    $.post("/asignacion/verdetalles",
    {
      'idAsignada': idAsignada,
    },
    function (data) {
      //$('.selDiv option:eq(1)')
      data = JSON.parse( data );
      //$("#country").val("China");
      $("#actividadPosible").val(data.idActividad);
      $("#sectorPosible").val(data.idSector);
      $("#initDate").val(data.fechaInicio);
      $("#endDate").val(data.fechaFin);
      $("#actividadPosible").prop('disabled', true);
      $("#sectorPosible").prop('disabled', true);
      $("#initDate").prop('disabled', true);
      $("#endDate").prop('disabled', true);
      $("#boton-modal-asignar").css("display", "none");
      $("#titulo-modal-actividades").html("Detalles de actividad");
      $("#boton-habilitar-campos").css("display", "inline-block");
      $("#boton-edicion-asignaciones").css("display", "none");
      $("#boton-borrar-asignaciones").css("display", "none");
      $("#boton-edicion-asignaciones").attr("onclick", "editarActividadesAsignadas("+idAsignada+")")
      $("#boton-borrar-asignaciones").attr("onclick", "eliminarActividadesAsignadas("+idAsignada+")")
      console.log(data.idActividad);
    });
}

function llenaPanel(eventos, date) {
  var url = window.location.href;
  url = url.split('/');
  var htmlALlenar = "";
  $(eventos).each(function () {
    htmlALlenar += "<div class='event-item'>";
    htmlALlenar += "<div class='event-item-name'>Actividad: " + this.title + "</div>";
    htmlALlenar += "<div class='event-item-location'>Sector: " + this.numeroSector + "</div>";
    htmlALlenar += "<a class='event-item-details' onclick=cargarModalEditar("+ this.idAsignada +") href=#>Ver detalles</a>";
    htmlALlenar += "</div>";
  });
  //$(htmlALlenar).appendTo('#eventos-del-dia');
  $('#eventos-del-dia').html(htmlALlenar);
  //var today = new Date(); var dd = today.getDate(); var mm = today.getMonth()+1; //January is 0! var yyyy = today.getFullYear(); if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = dd+'/'+mm+'/'+yyyy; document.getElementById("DATE").value = today;
  var today = estandarizarFecha(date);
  $('#titulo-eventos-del-dia').html('Eventos del día - ' + today);
}