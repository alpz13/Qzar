'use strict';
/*jslint
    indent: 4, unparam: true
*/

var mysql = require('mysql');
var bcrypt = require('bcrypt');
var Registro = require('log');
var observador = new Registro('info');

/*
*/
var __validarCredenciales = function (nombreUsuario, contrasenia, callback) {
    var credenciales = require('../database/credencialesbd.json');
    var conexion = mysql.createConnection(credenciales);

    conexion.connect();

    var consulta = 'SELECT `contrasena` FROM `Usuarios` WHERE `nombre` = ?;';
    var valores = [nombreUsuario];

    conexion.query({sql: consulta, values: valores}, function (err, renglones) {
        conexion.end();
        if (err) {
            callback(err);
            return;
        }

		for (var i in renglones) {
			if (bcrypt.compareSync(contrasenia, renglones[i].contrasena || ' ')) {
				callback(null, true);
				return;
			}
		}
		callback(new Error('Usuario y/o contraseña incorrectos.'));
		return;
    });
};

/*
*/
var __cargarUsuario = function (nombreUsuario, callback) {
    var credenciales = require('../database/credencialesbd.json');
    var conexion = mysql.createConnection(credenciales);

    conexion.connect();

    // TODO: Agregar, además, los roles, permisos, etc.  
    var consulta = 'SELECT `nombre`, `idRoles`, `idModulo`, `activo` FROM `Usuarios` WHERE `nombre` = ?;';
    var valores = [nombreUsuario];
    conexion.query({sql: consulta, values: valores}, function (err, renglones) {
        conexion.end();
        if (err) {
            callback(err);
            return;
        }
        if (renglones.length === 0) {
            callback(new Error('Usuario no existe.'));
            return;
        }

        var usuario = {};
        usuario.nombre = renglones[0].nombre;
        usuario.activo = renglones[0].activo;
        usuario.idRoles = renglones[0].idRoles;
        usuario.idModulo = renglones[0].idModulo;
        callback(null, usuario);
    });
};

/*
*/
var abrirSesion = function (req, res, callback) {
    var nombreUsuario = req.body.nombreUsuario;
    var contrasenia = req.body.contrasenia;

    if (req.session.usuario) {
        callback(new Error('La sesión ya cuenta con un usuario.'));
        return;
    }

    __validarCredenciales(nombreUsuario, contrasenia, function (err, resultado) {
        if (err) {
            callback(err);
            return;
        }

        __cargarUsuario(nombreUsuario, function (err, usuario) {
            if (err) {
                callback(err);
                return;
            }

            req.session.usuario = usuario;
            callback(null, usuario);
        });
    });
};

/*
*/
var cerrarSesion = function (req) {
    req.session.destroy();
    return true;
};

module.exports = {
    abrirSesion : abrirSesion,
    cerrarSesion : cerrarSesion,
};
