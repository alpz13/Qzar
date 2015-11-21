/* globals require: true, module: true, console: true*/
'use strict';

var mysql = require('mysql');
var credenciales = require('../database/credencialesbd.json');

/*
*/
var __obtenerPermisos = function (idUsuario, callback) {

    var conexion = mysql.createConnection(credenciales);

    var consulta = 'SELECT P.`idPermiso` ,P.`nombre` FROM `qzardb`.`Permisos` as P ,`qzardb`.`RolesPermisos` as RP ,`qzardb`.`Usuarios` as U WHERE U.`idUsuario` = ? AND U.`idRoles` = RP.`idRoles` AND P.`idPermiso` = RP.`idPermisos`;';
    var valores = [idUsuario];
    conexion.query({sql: consulta, values: valores}, function (err, renglones) {
        conexion.end();
        if (err) {
            callback(err);
            return;
        }
        var permisos = [];
        for(var v in renglones) {
            permisos.push(renglones[v]['nombre']);
        }
        callback(null, permisos);
    });
}

var __validarCredenciales = function (nombreUsuario, contrasenia, callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta = 'SELECT idUsuario FROM Usuarios WHERE activo = 1 AND `nombre` = ? AND `contrasena` = ? AND activo = 1;';
    var valores = [nombreUsuario, contrasenia];
    consulta = mysql.format(consulta, valores);

    conexion.connect();
    conexion.query(consulta, function (err, renglones) {
        conexion.end();
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        if (renglones.length === 0) {
            callback(new Error('Usuario y/o contraseña incorrectos.'));
        } else {
            callback(null, renglones[0].idUsuario);
        }
    });
};

var __cargarUsuario = function (idUsuario, callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta = 'SELECT nombre, idRoles, idModulo FROM Usuarios WHERE idUsuario = ? AND activo = 1;';
    var valores = [idUsuario];
    consulta = mysql.format(consulta, valores);
	
    conexion.connect();
    conexion.query(consulta, function (err, renglones){
        conexion.end();
        if (err) {
            console.log(err);
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

var abrirSesion = function (req, res, callback) {
    var nombreUsuario = req.body.nombreUsuario;
    var contrasenia = req.body.contrasenia;

    if (req.session.usuario) {
        callback(new Error('La sesión ya cuenta con un usuario.'));
        return;
    }

    __validarCredenciales(nombreUsuario, contrasenia, function (err, idUsuario) {
        if (err) {
            callback(err);
            return;
        }

        __cargarUsuario(idUsuario, function (err, usuario) {
            if (err) {
                callback(err);
                return;
            }

            req.session.usuario = usuario;
            __obtenerPermisos(idUsuario, function (err, permisos) {
                req.session.usuario.permisos = permisos;    
                callback(null, usuario);
            });
        });
    });
};

var cerrarSesion = function (req) {
    req.session.destroy();
    return true;
};

module.exports = {
    'abrirSesion' : abrirSesion,
    'cerrarSesion' : cerrarSesion
};
