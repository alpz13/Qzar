'use strict';
/*jslint
    indent: 4, unparam: true
*/

var mysql = require('mysql');
var sha1 = require('hash-anything').sha1;
var Registro = require('log');
var observador = new Registro('info');

var validarCredenciales = function (nombreUsuario, contrasenia) {
    // TODO: Esto es temporal.
    if (nombreUsuario === 'adminMatriz' && contrasenia === 'adminMatriz') {
        return true;
    }
    if (nombreUsuario === 'adminModulo' && contrasenia === 'adminModulo') {
        return true;
    }
    if (nombreUsuario === 'usuario' && contrasenia === 'usuario') {
        return true;
    }
    return false;
};

var cargarUsuario = function (nombreUsuario, callback) {
    var conexion = require('../database/credencialesbd.json');
    observador.info('Conexion:');
    observador.info(conexion);
    conexion.connect();

    // TODO: Agregar, además, los roles, permisos, etc.
    conexion.query('SELECT `nombre`,`activo` FROM `Usuarios` WHERE `nombre` LIKE ' + nombreUsuario, function (err, renglones) {
        if (err) { throw err; }
        var usuario = {};

        usuario.nombre = renglones[0].nombre;
        usuario.activo = renglones[0].activo;

        callback(null, usuario);
    });
    conexion.end();
};

var abrirSesion = function (req, res, callback) {
    var nombreUsuario = req.body.nombreUsuario;
    var contrasenia = req.body.contrasenia;

    if (req.session.usuario) {
        return callback(new Error('La sesión ya cuenta con un usuario.'));
    }

    if (!validarCredenciales(nombreUsuario, contrasenia)) {
        return callback(new Error('Usuario y/o contraseña incorrectos.'));
    }

    req.session.usuario = req.body.nombreUsuario;
    req.session.save();

    callback(null);
    return true;
};

var cerrarSesion = function (req) {
    req.session.destroy();
    return true;
};

module.exports = {
    abrirSesion : abrirSesion,
    cerrarSesion : cerrarSesion,
};