'use strict';
/*jslint
    indent: 4, unparam: true
*/

var moment = require('moment-timezone');

var listarActividadesAsignadas = function (idModulo, res) {
    var credenciales = require('../database/credencialesbd.json');
    //Carga el modulo de mySQL
    var mysql = require('mysql');
    //Crea la coneccion
    var connection = mysql.createConnection(credenciales);
    //Prueba si se conecto correctamente a la base de datos
    connection.connect(function (err) {
        if (!err) {
            console.log("Database is connected ... \n");
            //Guardar el cuadrito
            console.log("antes de la query");
            connection.query("select ac.idActividadesAsignadas as idAsignada, ac.fecha as date, a.nombre as title, ac.idSectores as idSectores, s.numeroSector, a.idActividad as idActividad FROM Actividades as a, ActividadesAsignadas as ac, Sectores as s WHERE ac.idModulos = " + idModulo + " AND a.idActividad = ac.idActividades AND s.idSector = ac.idSectores", function (err, rows) {
                //Funcion callback del query
                console.log("despues de la query");
                if (!err) {
                    //Si no ocurrio un error al realizar la query
                    console.log(rows);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(rows));
                    return;
                    //return rows.insertId;
                }
                //Error al ejecutar el query
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify([]));
                return;
            });
            //Termina la conexion
            connection.end();
        } else {
            console.log("Error connecting database ... \n");
        }
    });
};

var listarActividadesPosibles = function (callback) {
  var credenciales = require('../database/credencialesbd.json');
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //Crea la coneccion
  var connection = mysql.createConnection(credenciales);
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function (err) {
    if (!err) {
      console.log("Database is connected ... \n");
      connection.query("SELECT idActividad, nombre FROM Actividades  WHERE ACTIVO = 1", function (err, rows) {
        //Funcion callback del query
        if (!err) {
          //Si no ocurrio un error al realizar la query
          return callback(null, rows);
        }
        //Error al ejecutar el query
        console.log(err);
        return callback(err, []);
      });
      //Termina la conexion
      connection.end();
    } else {
      console.log("Error connecting database ... \n");
    }
  });
};

var listarSectoresPosibles = function (idModulo, callback) {
  var credenciales = require('../database/credencialesbd.json');
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //Crea la coneccion
  var connection = mysql.createConnection(credenciales);
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function (err, rows) {
    if (!err) {
      console.log("Database is connected ... \n");
      connection.query("SELECT DISTINCT S.idSector, S.numeroSector FROM qzardb.Sectores  as S, Cuadritos as C WHERE C.idSectores = S.idSector AND S.idModulos = " + idModulo + " ORDER BY S.numeroSector", function (err, rows) {
        //Funcion callback del query
        if (!err) {
          //Si no ocurrio un error al realizar la query
          return callback(null, rows);
        }
        //Error al ejecutar el query
        console.log(err);
        return callback(err, []);
      });
      //Termina la conexion
      connection.end();
    } else {
      console.log("Error connecting database ... \n");
    }
  });
};

var asignarActividad = function (idModulo, idSector, idActividad, fecha, res) {
  var credenciales = require('../database/credencialesbd.json');
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //Crea la coneccion
  var connection = mysql.createConnection(credenciales);
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function (err, rows) {
    if (!err) {
      console.log("Database is connected ... \n");
      connection.query("INSERT INTO ActividadesAsignadas (idModulos,idActividades,idSectores,fecha) VALUES (" + idModulo + ", " + idActividad + ", " + idSector + ", '" + fecha + "');", function (err, rows) {
        //Funcion callback del query
        if (!err) {
          //Si no ocurrio un error al realizar la query
          console.log(rows);
          return;
        }
        //Error al ejecutar el query
        console.log(err);
        return;
      });
      //Termina la conexion
      connection.end();
    } else {
      console.log("Error connecting database ... \n");
    }
  });
};

var obtenerFecha = function (caracter, idModulo, idActividad, idSector, fecha, callback){
  console.log(caracter);
  var credenciales = require('../database/credencialesbd.json');
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //Crea la coneccion
  var connection = mysql.createConnection(credenciales);
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function (err, rows) {
    var query = "SELECT distinct DATE_FORMAT(AA.fecha, '%m-%d-%Y') as fecha FROM qzardb.ActividadesAsignadas AA WHERE AA.fecha "+ caracter +" STR_TO_DATE('"+fecha+"', '%m-%d-%Y') AND AA.idModulos = '"+idModulo+"' AND AA.idActividades = '"+idActividad+"' AND AA.idSectores = '"+idSector+"' AND (exists (select 1 from qzardb.ActividadesAsignadas AA2 where AA2.fecha = AA.fecha + interval 1 day) or exists (select 1 from qzardb.ActividadesAsignadas AA2 where AA2.fecha = AA.fecha - interval 1 day) ) ORDER BY AA.fecha ";
    if(caracter==">=") query+= "desc";
    else query += "asc";
    console.log(query);
    connection.query(query, function (err, rows){
      if(!err){
        console.log(rows);
        if(!rows[0] || typeof rows[0]==='undefined'){
          callback(null, undefined);
        }
        else{
          callback(null, rows[0].fecha);
        }
      }
      console.log(err);
      return;
    });
    connection.end();
  });
}

var eliminarActividades = function(idActividad, idSector, idModulo, fechaInicio, fechaFin, callback){
  var credenciales = require('../database/credencialesbd.json');
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //Crea la coneccion
  var connection = mysql.createConnection(credenciales);
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function (err, rows) {
    if (!err) {
      console.log("Función eliminar actividades");
      console.log("Database is connected ... \n");
      var query = "DELETE from qzardb.ActividadesAsignadas where idActividades= '"+idActividad+"' and idSectores ='"+idSector+"' and idModulos = '"+idModulo+"' and fecha>=STR_TO_DATE('"+fechaInicio+"', '%m-%d-%Y') and fecha<=STR_TO_DATE('"+fechaFin+"', '%m-%d-%Y');";
      console.log(query);
      connection.query (query, function (err, rowsActividadesAsignadas){
        if(!err){
          callback(1);
        }
        else{
          console.log("noooooo");
          callback(-1);
        }
      });
    }
  });
};

var edicionAsignaciones = function(idActividadesAsignadas, res, action){
  var credenciales = require('../database/credencialesbd.json');
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //Crea la coneccion
  var connection = mysql.createConnection(credenciales);
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function (err, rows) {
    if (!err) {
      console.log("Database is connected ... \n");
      connection.query ("SELECT idActividadesAsignadas, idModulos, idActividades, idSectores, DATE_FORMAT(fecha, '%m-%d-%Y') as fecha FROM qzardb.ActividadesAsignadas where idActividadesAsignadas= "+idActividadesAsignadas, function (err, rowsActividadesAsignadas){
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
                if (action === 'ver'){
                  res.send(JSON.stringify(respuesta));
                  return;
                }
                else if (action === 'eliminar' || action === 'editar'){
                  eliminarActividades(idActividad, idSector, idModulo, fechaInicio, fechaFin, function (err, result){
                    if(result === -1){
                      console.log("error :(");
                      res.send("Error");
                      return;
                    }
                    else{
                      console.log("Éxito!");
                      res.send("Éxito");
                      return;
                    }
                  });
                }

              });
            });
          });
        }
        console.log(err);
        return;
      });
      connection.end();
    } else {
      console.log("Error connecting database ... \n");
    }
  });
};

function listarAsignacionesPorDia(idModulo, fecha, callback) {
    var credenciales = require('../database/credencialesbd.json');
    var mysql = require('mysql');
    var connection = mysql.createConnection(credenciales);
    var sql = "SELECT * FROM ActividadesAsignadas AS AA INNER JOIN Actividades AS A INNER JOIN Sectores AS S ON AA.idActividades = A.idActividad AND AA.idSectores = S.idSector WHERE fecha = ? AND AA.idModulos = ?";
    var params = [fecha, idModulo];

    connection.connect(function (err) {
        if (!err) {
            sql = mysql.format(sql, params);
            connection.query(sql, function (err, actividades) {
                connection.end();
                if (!err) {
                    callback(null, actividades);
                    return;
                }
                console.log(err);
                callback(err);
                return;
            });
        } else {
            console.log(err);
            callback(err);
        }
    });
}

function cancelarConfirmacionesHoy(idModulo, callback) {
    var credenciales = require('../database/credencialesbd.json');
    var mysql = require('mysql');
    var connection = mysql.createConnection(credenciales);
    var sql = "UPDATE ActividadesAsignadas SET cumplido = 0 WHERE idModulos = ? AND fecha = ?";
    var params = [idModulo, moment().tz('America/Mexico_City').format('YYYY-MM-DD')];

    connection.connect(function (err) {
        if (!err) {
            sql = mysql.format(sql, params);
            connection.query(sql, function (err) {
                connection.end();
                if (err) {
                    callback(err);
                }
            });
        }
    });
}

function confirmarActividadAsignada(idActividadesAsignadas, callback) {
    var credenciales = require('../database/credencialesbd.json');
    var mysql = require('mysql');
    var connection = mysql.createConnection(credenciales);
    var sql = "UPDATE ActividadesAsignadas SET cumplido = 1 WHERE idActividadesAsignadas = ?";
    var params = [idActividadesAsignadas];

    connection.connect(function (err) {
        if (!err) {
            sql = mysql.format(sql, params);
            connection.query(sql, function (err) {
                connection.end();
                if (err) {
                    callback(err);
                }
            });
        }
    });
}

module.exports = {
    'listarActividadesAsignadas': listarActividadesAsignadas,
    'listarPorDia': listarAsignacionesPorDia,
    'actividadesPosibles': listarActividadesPosibles,
    'sectoresPosibles': listarSectoresPosibles,
    'asignar': asignarActividad,
    'edicionAsignaciones': edicionAsignaciones,
    'cancelarConfirmacionesHoy': cancelarConfirmacionesHoy,
    'confirmar': confirmarActividadAsignada
};
