/*jslint
    indent: 4, unparam: true
*/
'use strict';

// crea variable para la base de datos
var mysql = require('mysql');
/* incluye el archivo que contiene las credenciales de la conexión a la BD: credencialesdb.json */
var credenciales = require('../database/credencialesbd.json');
var bcrypt = require('bcrypt');

var agregar = function (NuevoUsuario, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO Usuarios(idRoles, nombre, contrasena, idModulo, activo) VALUES(?, ?, ?, ?, 1);',
        params;

	bcrypt.genSalt(10, function(err, salt) {
		if (err) {
			console.log(err);
			callback(err);
			return;
		}

		bcrypt.hash(NuevoUsuario.contrasenia, salt, function(err, hash) {
			if (err) {
				console.log(err);
				callback(err);
				return;
			}

			params = [NuevoUsuario.idRoles, NuevoUsuario.nombre, hash, NuevoUsuario.idModulo];
			sql = mysql.format(sql, params);
			bd.connect();
			bd.query(sql, function (err, resultado) {
				if (err) {
		            bd.end();
				    callback(err);
					return;
				}
				bd.end();
				console.log("Usuario creado");
				callback(null);
				return;
			});
		});
	});
};

module.exports = {
    'agregar' : agregar
};
