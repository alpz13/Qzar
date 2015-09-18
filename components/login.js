'use strict';
/*jslint
    indent: 4, unparam: true
*/

var mysql = require('mysql');
var sha1 = require('hash-anything').sha1;
var Sesion = require('node-session');
var Registro = require('log');
var observador = new Registro('info');

var validarCredenciales = function (nombreUsuario, contrasenia) {
    // TODO: Esto es temporal.
    if (nombreUsuario === 'qzar' && contrasenia === 'qzar') { return true; }
    return false;
};

var cargarUsuario = function (nombreUsuario, callback) {
    var conexion = require('../database/credencialesbd.json');
    observador.debug('Conexion:');
    observador.debug(conexion);
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
    var sesion;

    observador.info(req.session);

    // Existe una sesión abierta?
    if (typeof req.session !== 'undefined') {
        observador.debug('Ya existe una sesión abierta.');
        return callback(new Error('Ya existe una sesión abierta.'));
    }
    observador.debug('Creando sesión nueva para una request.');
    sesion = new Sesion({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});  // TODO
    // sesion.startSession(req, res, callback);

    // Existe un usuario con los datos proporcionados?
    if (!validarCredenciales(nombreUsuario, contrasenia)) {
        observador.debug('Usuario y/o contraseña incorrectos.');
        return callback(new Error('Ya existe una sesión abierta.'));
    }
    observador.debug('A esta request se le asignará el \'usuario\' que pidió.');
    cargarUsuario(nombreUsuario, function (err, usuario) {
        sesion.put('usuario', usuario);
    }); // FIXME

    // callback(err);

    return true;
};

var cerrarSesion = function (req) {
    if (req.session === null) { return true; }
    delete req.session;
    return true;
};

module.exports = {
    abrirSesion : abrirSesion,
    cerrarSesion : cerrarSesion,
};