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
      connection.query("select ac.idActividadesAsignadas as idAsignada, ac.fecha as date, a.nombre as title, ac.idSectores as idSectores, s.numeroSector, a.idActividad as idActividad FROM Actividades as a, ActividadesAsignadas as ac, Sectores as s WHERE ac.idModulos = " + idModulo + " AND a.idActividad = ac.idActividades AND s.idSector = ac.idSectores", function (err, rows) {
        //Funcion callback del query
        if (!err) {
          //Si no ocurrio un error al realizar la query
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
    query = "SELECT distinct DATE_FORMAT(AA.fecha, '%m-%d-%Y') as fecha FROM qzardb.ActividadesAsignadas AA WHERE AA.fecha "+ caracter +" STR_TO_DATE('"+fecha+"', '%m-%d-%Y') AND AA.idModulos = '"+idModulo+"' AND AA.idActividades = '"+idActividad+"' AND AA.idSectores = '"+idSector+"' AND (exists (select 1 from qzardb.ActividadesAsignadas AA2 where AA2.fecha = AA.fecha + interval 1 day) or exists (select 1 from qzardb.ActividadesAsignadas AA2 where AA2.fecha = AA.fecha - interval 1 day) ) ORDER BY AA.fecha ";
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

var verDetallesActividadAsignada = function (idActividadesAsignadas, res) {
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
            idActividadAsignada = row.idActividadesAsignadas;
            idModulo = row.idModulos;
            idActividad = row.idActividades;
            idSector = row.idSectores;
            fecha = row.fecha;
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
                respuesta = {
                  "idActividad" : idActividad,
                  "idSector" : idSector,
                  "idModulo" : idModulo,
                  "fechaInicio" : fechaInicio,
                  "fechaFin" : fechaFin,
                };
                res.send(JSON.stringify(respuesta));
                return;
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
      /*connection.query("SELECT * FROM qzardb.ActividadesAsignadas AA WHERE AA.fecha > "+fecha+" AND AA.idModulos = "+idModulo+" AND AA.idActividades = "+idActividades+" AND AA.idSectores = "+idSector+" ORDER BY AA.fecha ", function (err, rows) {
        //Funcion callback del query
        if (!err) {
          //Si no ocurrio un error al realizar la query
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(rows));
          return;
        }
        //Error al ejecutar el query
        console.log(err);
        return;
      });
      *///Termina la conexion
  });
};


module.exports = {
  'listarActividadesAsignadas': listarActividadesAsignadas,
  'actividadesPosibles': listarActividadesPosibles,
  'sectoresPosibles': listarSectoresPosibles,
  'asignar': asignarActividad,
  'detalles': verDetallesActividadAsignada
};