/* globals require: true, console: true, module: true */
'use strict';

var mysql = require('mysql');
var moment = require('moment-timezone');

var credenciales = require('../database/credencialesbd.json');

// Lista todas las actividades asignadas.
var listarActividadesAsignadas = function (idModulo, res) {
    var connection = mysql.createConnection(credenciales);
    var sql = "select ac.idActividadesAsignadas as idAsignada, ac.fecha as date, a.nombre as title, ac.idSectores as idSectores, s.numeroSector, a.idActividad as idActividad FROM Actividades as a, ActividadesAsignadas as ac, Sectores as s WHERE ac.idModulos = ? AND a.idActividad = ac.idActividades AND s.idSector = ac.idSectores";
    var params = [idModulo];

    sql = mysql.format(sql, params);

    connection.query(sql, function (err, rows) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(rows));
        } else {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify([]));
        }
    });
    
    connection.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
};

var listarSectoresPosibles = function (idModulo, callback) {
    var connection = mysql.createConnection(credenciales);
    var sql = "SELECT DISTINCT S.idSector, S.numeroSector FROM qzardb.Sectores  as S, Cuadritos as C WHERE C.idSectores = S.idSector AND S.idModulos = ? ORDER BY S.numeroSector";
    var params = [idModulo];

    sql = mysql.format(sql, idModulo);
  
    connection.query(sql, function (err, rows) {
        if (!err) {
            callback(null, rows);
        } else {
            console.log(err);
            callback(err, []);
        }
    });

    connection.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
};

var asignarActividad = function (idModulo, idSector, idActividad, fecha, res) {
  var connection = mysql.createConnection(credenciales);
  var sql = "INSERT INTO ActividadesAsignadas (idModulos,idActividades,idSectores,fecha) VALUES (?, ?, ?, ?);";
  var params = [idModulo, idActividad, idSector, fecha];

  sql = mysql.format(sql, params);

  connection.query(sql, function (err, rows) {
    if (!err) {
      console.log(rows);
    } else {
      console.log(err);
    }
  });

  connection.end(function(err) {
    if (err) {
        console.log(err);
    }
  });
};

var obtenerFecha = function (caracter, idModulo, idActividad, idSector, fecha, callback){
  var connection = mysql.createConnection(credenciales);
  var query = "SELECT distinct DATE_FORMAT(AA.fecha, '%m-%d-%Y') as fecha FROM qzardb.ActividadesAsignadas AA WHERE AA.fecha ? STR_TO_DATE(?, '%m-%d-%Y') AND AA.idModulos = ? AND AA.idActividades = ? AND AA.idSectores = ? AND (exists (select 1 from qzardb.ActividadesAsignadas AA2 where AA2.fecha = AA.fecha + interval 1 day) or exists (select 1 from qzardb.ActividadesAsignadas AA2 where AA2.fecha = AA.fecha - interval 1 day) ) ORDER BY AA.fecha ";
  var params = [caracter, fecha, idModulo, idSector];

  if(caracter==">=") query+= "desc";
    else query += "asc";

  connection.query(query, function (err, rows){
      if(!err){
        console.log(rows);
        if(!rows[0] || typeof rows[0]==='undefined'){
          callback(null, undefined);
        }
        else{
          callback(null, rows[0].fecha);
        }
      } else{
        console.log(err);
      }
  });

  connection.end(function(err) {
    if (err) {
        console.log(err);
    }
  });
}

var verDetallesActividadAsignada = function (idActividadesAsignadas, res) {
  var connection = mysql.createConnection(credenciales);
  var sql = "SELECT idActividadesAsignadas, idModulos, idActividades, idSectores, DATE_FORMAT(fecha, '%m-%d-%Y') as fecha FROM qzardb.ActividadesAsignadas where idActividadesAsignadas= ?";
  var params = [idActividadesAsignadas];

  sql = mysql.format(sql, params);

  connection.query (sql, function (err, rowsActividadesAsignadas){
        if(!err){
          rowsActividadesAsignadas.forEach(function(row, index){
            var idActividadAsignada = row.idActividadesAsignadas;
            var idModulo = row.idModulos;
            var idActividad = row.idActividades;
            var idSector = row.idSectores;
            var fecha = row.fecha;
            var fechaInicio;
            var fechaFin;
            obtenerFecha("<=", idModulo, idActividad, idSector, fecha, function(err, fec){
              if(typeof fec === 'undefined'){
                fechaInicio = undefined;
              }
              else{
                fechaInicio = fec;
              }
              obtenerFecha(">=", idModulo, idActividad, idSector, fecha, function(err, fec){
                if(typeof fec === 'undefined'){
                  fechaFin = fechaInicio;
                }
                else{
                  fechaFin = fec;
                }
                if (typeof fechaInicio==='undefined'){
                  fechaInicio = fechaFin;
                }
                console.log(idActividad, idSector, idModulo, fechaInicio, fechaFin);
                var respuesta = {
                  "idActividad" : idActividad,
                  "idSector" : idSector,
                  "idModulo" : idModulo,
                  "fechaInicio" : fechaInicio,
                  "fechaFin" : fechaFin,
                };
                res.send(JSON.stringify(respuesta));
              });
            });
          });
        } else{
          console.log(err);
        }
  });

  connection.end(function(err) {
    if (err) {
        console.log(err);
    }
  });
};

function listarAsignacionesPorDia(idModulo, fecha, callback) {
    var connection = mysql.createConnection(credenciales);
    var sql = "SELECT * FROM ActividadesAsignadas AS AA INNER JOIN Actividades AS A INNER JOIN Sectores AS S ON AA.idActividades = A.idActividad AND AA.idSectores = S.idSector WHERE fecha = ? AND AA.idModulos = ?";
    var params = [fecha, idModulo];

    sql = mysql.format(sql, params);
    connection.query(sql, function (err, actividades) {
        if (!err) {
            callback(null, actividades);
        } else {
            console.log(err);
            callback(err);
        }
    });

    connection.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function cancelarConfirmacionesHoy(idModulo, callback) {
    var connection = mysql.createConnection(credenciales);
    var sql = "UPDATE ActividadesAsignadas SET cumplido = 0 WHERE idModulos = ? AND fecha = ?";
    var params = [idModulo, moment().tz('America/Mexico_City').format('YYYY-MM-DD')];

    sql = mysql.format(sql, params);
    connection.query(sql, function (err) {
        if (err) {
            callback(err);
        }
    });

    connection.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function confirmarActividadAsignada(idActividadesAsignadas, callback) {
    var connection = mysql.createConnection(credenciales);
    var sql = "UPDATE ActividadesAsignadas SET cumplido = 1 WHERE idActividadesAsignadas = ?";
    var params = [idActividadesAsignadas];

    sql = mysql.format(sql, params);
    connection.query(sql, function (err) {
        if (err) {
            callback(err);
        }
    });

    connection.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
    'listarActividadesAsignadas': listarActividadesAsignadas,
    'listarPorDia': listarAsignacionesPorDia,
    'sectoresPosibles': listarSectoresPosibles,
    'asignar': asignarActividad,
    'detalles': verDetallesActividadAsignada,
    'cancelarConfirmacionesHoy': cancelarConfirmacionesHoy,
    'confirmar': confirmarActividadAsignada
};
