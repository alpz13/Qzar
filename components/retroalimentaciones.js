/*jslint
    indent: 4, unparam: true
*/
'use strict';

var mysql = require('mysql');
var path = require('path');
var fs = require('fs');
var moment = require('moment-timezone');

var credenciales = require('../database/credencialesbd.json');

function agregarRetroalimentación(retro, callback) {
    // El archivo tiene como nombre el idModulo y la fecha.
    var hoy = moment().tz('America/Mexico_City').format('YYYY-MM-DD'),
        bd = mysql.createConnection(credenciales),
        nombreArchivo = retro.idModulo + '_' + hoy + path.extname(retro.archivo.originalFilename),
        sql = "INSERT INTO Retroalimentaciones(fecha, idModulos, descripcion, contenidoMultimedia) VALUES(?,?,?,?);",
        params = [hoy, retro.idModulo, retro.descripción, nombreArchivo];

    bd.connect();

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultado) {
        if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        
        fs.readFile(retro.archivo.path, function (err, contenidoArchivo) {
            if (err) {
                return callback(err);
            }

            fs.writeFile("./public/images/retros/" + nombreArchivo, contenidoArchivo, function (err) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }

                return callback(null, resultado.insertId);
            });
        });
    });
}

var listarRetroalimentaciones = function (idModulo, res) {
  var credenciales = require('../database/credencialesbd.json');
  var mysql = require('mysql');
  var connection = mysql.createConnection(credenciales);
  connection.connect(function (err) {
    if (!err) {
      console.log("Database is connected ... \n");
      connection.query("select ret.fecha as date, ret.descripcion as descripcion FROM Retroalimentaciones as ret WHERE ret.idModulos = " + idModulo, function (err, rows) {
        if (!err) {
          console.log(rows);
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(rows));
          return;
        }
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
        return;
      });
      connection.end();
    } else {
      console.log("Error connecting database ... \n");
    }
  });
};

module.exports = {
  'agregar' : agregarRetroalimentación,
  'listarRetroalimentaciones': listarRetroalimentaciones
};
