/*jslint
    indent: 4, unparam: true
*/
'use strict';
// crea variable para la base de datos
var mysql = require('mysql');
/* incluye el archivo que contiene las credenciales de la conexión a la BD: credencialesdb.json */
var credenciales = require('../database/credencialesbd.json');

var agregar = function (NuevoUsuario, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO Usuarios(idRoles, nombre, contrasena, idModulo, activo) VALUES(?, ?, ?, ?, 1);',
        params = [NuevoUsuario.idRoles, NuevoUsuario.nombre, NuevoUsuario.contrasenia, NuevoUsuario.idModulo];
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
