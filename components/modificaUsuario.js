/*jslint
    indent: 4, unparam: true
*/
'use strict';
// crea variable para la base de datos
var mysql = require('mysql');
/* incluye el archivo que contiene las credenciales de la conexión a la BD: credencialesdb.json */
var credenciales = require('../database/credencialesbd.json');

var modificar = function (NuevoUsuario, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'UPDATE `usuarios` SET `idRoles`= "' + NuevoUsuario.idRoles + '",`nombre`= "' + NuevoUsuario.nombre + '",`contrasena`= "'+ NuevoUsuario.contrasenia +'",`idModulo`= "'+ NuevoUsuario.idModulo + '" WHERE usuarios.idUsuario = ' + NuevoUsuario.idUsuario + '';
    console.log(sql);
    bd.connect();
    bd.query(sql, function (err, resultado) {
        if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        console.log("Usuario modificado");
        return callback(null);
    });
};

module.exports = {
    'modificar' : modificar
};