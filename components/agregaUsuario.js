/*jslint
    indent: 4, unparam: true
*/
'use strict';
// crea variable para la base de datos
var mysql = require('mysql');
/* incluye el archivo que contiene las credenciales de la conexión a la BD: credencialesdb.json */
var credenciales = require('../database/credencialesbd.json');
/* crea la referencia al caso de uso listar actividades*/
var agregar = function (NuevoUsuario, callback) {
    //idUsuario
    //idRoles
    //Nombre
    //Contraseña
    //ReContraseña
    //Activo
    //idModulo
    var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO usuarios(idUsuario, idRoles, nombre, contrasena, activo, idModulo) VALUES(?,?,?,?,1,?);',
        params = [NuevoUsuario.idUsuario, NuevoUsuario.idRoles, NuevoUsuario.nombre, NuevoUsuario.contrasenia, NuevoUsuario.idModulo];
    bd.connect();
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultado) {
        if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        console.log("Usuario creado");
        return callback(null);
    });
};

module.exports = {
    'agregar' : agregar
};