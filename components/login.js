'use strict';
/*jslint
    indent: 4
*/

var mysql = require('mysql');
var sha1 = require('hash-anything').sha1;
var Sesion = require('node-session');
var Registro = require('log');
var observador = new Registro('info');

/**
 * @private
 * @constructor
 * @param usuario {string} Nombre del usuario a ser creado.
 */
var ORMUsuario = function (copia) {
    var dato;
    for (dato in copia) {
        if (copia.hasOwnProperty(dato)) {
            this[dato] = copia[dato];
        }
    }
};

/**
 * A Luis Eduardo Espinosa le gusta debuggear cosas.
 * @private
 * @param usuario {string} Nombre del usuario a validar.
 * @param contrasenia {string} Contrasena del usuario a validar.
 * @return {boolean} Regresa 'true' si el usuario y contrasenia son correctos.
 *                   Regresa 'false' en cualquier otro caso.
 */
var validarCredenciales = function (usuario, contrasenia) {
    // TODO: Esto es temporal.
    if (usuario === 'qzar' && contrasenia === 'qzar') { return true; }
    return false;
};

/*
 * @private
 * @param usuario {string} Nombre del usuario a validar.
 * @callback callback Un callback.
 * @return {boolean} Regresa 'true' si el usuario y contrasenia son correctos.
 *                   Regresa 'false' en cualquier otro caso.
 */
var cargarUsuario = function (nombre, callback) {
    // FIXME: No hardcodear estos valores.
    var conexion = mysql.createConnection({
        host : 'localhost',
        user : 'qzar',
        password : 'qzar',
        database : 'qzar'
    });

    conexion.connect();

    // TODO: Agregar, además, los roles, permisos, etc.
    conexion.query('SELECT `nombre`,`activo` FROM `Usuarios` WHERE `nombre` LIKE ' + nombre, function (err, renglones) {
        if (err) { throw err; }
        var usuario = {};

        usuario.nombre = renglones[0].nombre;
        usuario.activo = renglones[0].activo;

        callback(usuario);
    });
    conexion.end();
};

/**
 * @public
 * @param req {Object} El http request.
 * @param res {Object} El http response.
 * @param usuario {string} Nombre del usuario a validar
 * @param contrasenia {string} Contrasenia del usuario a validar.
 * @callback callback Pues, el callback que le quieras pasar.
 * @return {boolean} Regresa 'true' si la sesion fue abierta exitosamente.
 *                   Regresa 'false' en cualquier otro caso.
 */
var abrirSesion = function (req, res, usuario, contrasenia, callback) {
    // Toda request debe de tener un objeto 'sesion'.
    var sesion;
    if (req.session === null) {
        observador.info('Creando sesion nueva para una request.');

        sesion = new Sesion({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});
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
    if (!validarCredenciales(usuario, contrasenia)) {
        observador.error('Usuario y/o contrasenia incorrectos.');

        return false;
    }

    observador.info('A esta request se le asignará el \'usuario\' que pidio.');
    cargarUsuario(usuario, ORMUsuario); // FIXME
    sesion.put('usuario', 'value');
    return true;
};

/**
 * @public
 * @param usuario {string} Nombre del usuario a validar.
 * @param contrasenia {string} Contrasena del usuario a validar.
 * @return {boolean} Regresa 'true' si la sesion cerrada exitosamente.
 *                   Regresa 'false' en cualquier otro caso.
 */
var cerrarSesion = function (req) {
    if (req.session === null) { return true; }
    delete req.session;
    return true;
};

module.exports = {
    abrirSesion: abrirSesion,
    cerrarSesion: cerrarSesion,
};