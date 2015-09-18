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
    var sesion;

    // Existe una sesión abierta?
    if (req.session) {
        return callback(new Error('Ya existe una sesión abierta.'));
    }

    // Existe un usuario con los datos proporcionados?
    if (!validarCredenciales(nombreUsuario, contrasenia)) {
        return callback(new Error('Usuario y/o contraseña incorrectos.'));
    }

    observador.info('Creando sesión nueva para una request.');
    sesion = new Sesion({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});  // TODO
    sesion.startSession(req, res, callback);
    cargarUsuario(nombreUsuario, function (err, usuario) {
        sesion.put('usuario', usuario);
    });

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