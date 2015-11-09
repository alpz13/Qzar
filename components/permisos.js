'use strict';

var mysql = require('mysql');

//////////

var obtenerPermisos = function (nombreUsuario, callback) {
    console.log('SELECT P.`idPermiso` ,P.`nombre` FROM `qzardb`.`Permisos` as P ,`qzardb`.`RolesPermisos` as RP ,`qzardb`.`Usuarios` as U WHERE U.`nombre` = \'' + nombreUsuario + '\' AND U.`idRoles` = RP.`idRoles` AND P.`idPermiso` = RP.`idPermisos`;');

    var credenciales = require('../database/credencialesbd.json');
    var conexion = mysql.createConnection(credenciales);

    var consulta = 'SELECT P.`idPermiso` ,P.`nombre` FROM `qzardb`.`Permisos` as P ,`qzardb`.`RolesPermisos` as RP ,`qzardb`.`Usuarios` as U WHERE U.`nombre` = ? AND U.`idRoles` = RP.`idRoles` AND P.`idPermiso` = RP.`idPermisos`;';
    var valores = [nombreUsuario];
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

//////////

module.exports = {
    obtenerPermisos: obtenerPermisos,
};