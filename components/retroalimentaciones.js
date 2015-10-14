/*jslint
  indent: 4, unparam: true
*/
'use strict';

var mysql = require('mysql');
var path = require('path');
var fs = require('fs');

var credenciales = require('../database/credencialesbd.json');

function agregarRetroalimentación(retro, callback) {
	// El archivo tiene como nombre el idModulo y la fecha.
    var bd = mysql.createConnection(credenciales),
		//nombre_archivo = retro.idModulo + ' ' + 
        sql = "INSERT INTO Retroalimentaciones(fecha, idModulos, descripcion, contenidoMultimedia) VALUES(NOW(), ?,?,CONCAT(?, ' ', DATE_FORMAT(NOW(), '%Y-%m-%d')));",
        params = [retro.idModulo, retro.descripción, retro.idModulo];

    bd.connect();

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultado) {
        if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
		
		//console.log(retro.archivo);
		fs.readFile(retro.archivo.path, function (err, contenidoArchivo) {
			if (err) {
				return callback(err);
			}

			fs.writeFile("./public/images/retros/" + resultado.insertId, contenidoArchivo, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("SI");
				}
			});
		});

        return callback(null, resultado.insertId);
    });
}

module.exports = {
    'agregar' : agregarRetroalimentación
};
