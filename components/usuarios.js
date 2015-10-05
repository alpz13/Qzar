/*jslint
  indent: 4, unparam: true
*/
'use strict';

var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');

// Regresa la lista de usuarios de un módulo.
function listarUsuariosModulo(idModulo, callback) {

    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT * FROM Usuarios WHERE idModulo = ? AND activo = 1;',
        params = [idModulo];

    bd.connect();

    // Ejecuta consulta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultados) {
        if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        return callback(null, resultados);
    });
}

// Regresa la lista de administradores generales.
function listarAdminsGenerales(callback) {

    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT * FROM Usuarios WHERE idRoles = 1 AND activo = 1;';

    bd.connect();

    // Ejecuta consulta.
    bd.query(sql, function (err, resultados) {
        if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        return callback(null, resultados);
    });
}

module.exports = {
    'listarUsuariosModulo' : listarUsuariosModulo,
    'listarAdminsGenerales' : listarAdminsGenerales
};
