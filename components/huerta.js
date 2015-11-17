'use strict';
/*jslint
    indent: 4, unparam: true
*/

var sectoresPosibles = function (callback) {
  var credenciales = require('../database/credencialesbd.json');
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //Crea la coneccion
  var connection = mysql.createConnection(credenciales);
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function (err) {
    if (!err) {
      console.log("Database is connected ... \n");
      connection.query("SELECT * FROM ContenidoCuadritos", function (err, rows) {
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

module.exports = {
    sectoresPosibles : sectoresPosibles
};
