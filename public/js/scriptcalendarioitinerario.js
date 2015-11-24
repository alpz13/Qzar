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

function cambiarActividades(div) {
  var categoria = parseInt($(div).val());
  var primerElemento = true;
  $(div).parent().parent().parent().find('.opcionActividad').each(function(){
    console.log($(this));
    if(primerElemento && $(this).attr('categoria') == categoria){
      $(this).attr('selected', true);
      $(this).attr('hidden', false);
      primerElemento = false;
    } else if ( $(this).attr('categoria') == categoria ) {
      $(this).attr('hidden', false);
    } else {
      $(this).attr('hidden', true);
    }
  });
}

function asignarActividad() {
  var url = window.location.href;
  url = url.split('/');
  url = url[url.length - 1].split('#');
  url = url[0];
  var idSector = $('#sectorPosible').val();
  var idActividadesRaw = $('.actividades');
  var idActividades = [];
  //console.log(idActividadesRaw);
  $(idActividadesRaw).each(function(){
    idActividades.push($(this).val());
  });
  var fechaIni = $('#initDate').val();
  var fechaFin = $('#endDate').val();
  console.log(url);
  console.log(idSector);
  console.log(fechaIni);
  console.log(fechaFin);
  console.log(JSON.stringify(idActividades));
  $.post("/asignacion/asignaractividad",
  {
    'idModulo': url,
    'idSector': idSector,
    'idActividades': JSON.stringify(idActividades),
    'fechaIni': fechaIni,
    'fechaFin': fechaFin
  },
  function (data) {
    console.log(data);
    //$("#full-clnd").load("modulos/2 " + "#full-clnd");
    location.reload();
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
    var div = $('#categoriasPosibles');
    cambiarActividades($(div));
    cargarActividadesHoy();
  }
);

function quitarActividad(){
  if($(".actividadesDiv").length > 1){
    $(".categoriaActividad").first().remove();
  }
}

function agregarActividad(){
  var divActividades = $(".categoriaActividad").first();
  var newDiv = $('<div class="categoriaActividad">' + divActividades.html() + '</div>').insertAfter("#agregarActividad");
  cambiarActividades($(newDiv.find('select')));
}

function habilitarCamposModalAgregar(){
  $('#actividadPosible').prop('disabled', false);
  $('#categoriasPosibles').prop('disabled', false);
  $('#sectorPosible').prop('disabled', false);
  $('#initDate').prop('disabled', false);
  $('#endDate').prop('disabled', false);
  $("#boton-modal-asignar").prop('value', 'Agregar');
  $("#boton-modal-asignar").html('Asignar');
  $("#actividadPosible").val("");
  $("#categoriasPosibles").val("");
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
  $('#categoriasPosibles').prop('disabled', false);
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

function eliminarActividadesAsignadas(idAsignada, asignar){
  console.log(idAsignada);
  $.post("/asignacion/borrarasignacion",
  {
    'idAsignada': idAsignada,
  },
  function (data) {
    console.log(data);
    if (asignar === 1){
      asignarActividad();
      location.reload();
    } 
  });
}

function editarActividadesAsignadas(idAsignada){
  eliminarActividadesAsignadas(idAsignada, 1);
  console.log("antes");
  //asignarActividad();
  console.log("Despues");
}

function cargarActividadesHoy(){
  var url = window.location.href;
  url = url.split('/');
  url = url[url.length - 1].split('#');
  url = url[0];
  $.post("/asignacion/verActividadesHoy",
  {
    'idModulo': url,
  },
  function(data){
    data = JSON.parse( data );
    console.log(data);
    var flag = false;
    html = "<thead><tr><th>Actividades del dia</th><th>Sector</th></tr></thead><tbody>";
    data.forEach(function(element, index){
      if(data[index].numeroSector!=null){
        flag = true;
      }
      html += "<tr id='actividadesHoy"+index+"'><td>"+data[index].nombre+"</td><td>"+data[index].numeroSector+"</td></tr>"
    });
    if(flag){
    html += "</tbody></table>";
    $("#actividadesHoy").replaceWith("<table id='actividadesHoy' class='table table-striped table-bordered'>"+html+"</table>");
    }
    else{
      $("#actividadesHoy").replaceWith("<p class='noActividades' >No hay actividades asignadas para el día de hoy </p>");
    }
    
  });

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
    $("#categoriasPosibles").prop('disabled', true);
    $("#sectorPosible").prop('disabled', true);
    $("#initDate").prop('disabled', true);
    $("#endDate").prop('disabled', true);
    $("#boton-modal-asignar").css("display", "none");
    $("#titulo-modal-actividades").html("Detalles de actividad");
    $("#boton-habilitar-campos").css("display", "inline-block");
    $("#boton-edicion-asignaciones").css("display", "none");
    $("#boton-borrar-asignaciones").css("display", "none");
    $("#boton-edicion-asignaciones").attr("onclick", "editarActividadesAsignadas("+idAsignada+")");
    $("#boton-borrar-asignaciones").attr("onclick", "eliminarActividadesAsignadas("+idAsignada+", 0)");
    $("#categoriasPosibles").find("option").each(function(){
      if(parseInt($(this).attr("value")) == parseInt(data.idCategoria)){
        $(this).attr("selected", true);
      }
    });
    var div = $('#categoriasPosibles');
    cambiarActividades($(div));
    $(".opcionActividad").each(function(){
      if(parseInt($(this).attr("value")) == parseInt(data.idActividad)){
        $(this).attr("selected", true);
      }
    });
  });
}

function llenaPanel(eventos, date) {
  var url = window.location.href;
  url = url.split('/');
  var htmlALlenar = "";
  $(eventos).each(function () {
    if(this.numeroSector < 0)
      this.numeroSector = "Sin sector";
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
