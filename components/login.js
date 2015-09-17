'use strict';
/*jslint
    indent: 4, unparam: true
*/

var mysql = require('mysql');
var sha1 = require('hash-anything').sha1;
var Sesion = require('node-session');
var Registro = require('log');
var observador = new Registro('info');

var ORMUsuario = function (copia) {
    var dato;
    for (dato in copia) {
        if (copia.hasOwnProperty(dato)) {
            this[dato] = copia[dato];
        }
    }
};

var validarCredenciales = function (usuario, contrasenia) {
    // TODO: Esto es temporal.
    if (usuario === 'qzar' && contrasenia === 'qzar') { return true; }
    return false;
};

var cargarUsuario = function (nombreUsuario, callback) {
    // FIXME: No hardcodear estos valores.
    var conexion = mysql.createConnection({
        host : 'localhost',
        user : 'qzar',
        password : 'qzar',
        database : 'qzar'
    });

    conexion.connect();

    // TODO: Agregar, además, los roles, permisos, etc.
    conexion.query('SELECT `nombre`,`activo` FROM `Usuarios` WHERE `nombre` LIKE ' + nombreUsuario, function (err, renglones) {
        if (err) { throw err; }
        var usuario = {};

        usuario.nombre = renglones[0].nombre;
        usuario.activo = renglones[0].activo;

        callback(usuario);
    });
    conexion.end();
};

var abrirSesion = function (req, res, callback) {
    // Toda request debe de tener un objeto 'sesion'.
    var nombreUsuario = req.body.nombreUsuario;
    var contrasenia = req.body.contrasenia;
    var sesion;
    if (req.session === null || req.session === undefined) {
        observador.info('Creando sesion nueva para una request.');
        sesion = new Sesion({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});
        observador.info(sesion.startSession);
        sesion.startSession(req, res, callback);
    }

    // Si la request ya tiene un usuario asignado.
    if (req.session.usuario !== null) {
        observador.info('Esta request ya cuenta con un \'usuario\'.');
        observador.debug(req.session);

        req.session.regenerate();
        return false;
    }

    // Existe?
    if (!validarCredenciales(nombreUsuario, contrasenia)) {
        observador.error('Usuario y/o contrasenia incorrectos.');

        return false;
    }

    observador.info('A esta request se le asignará el \'usuario\' que pidió.');
    cargarUsuario(nombreUsuario, ORMUsuario); // FIXME
    sesion.put('usuario', 'value');
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