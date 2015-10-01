/*jslint
  indent: 4, unparam: true
 */
'use strict';

var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var credenciales = require('../database/credencialesbd.js');

function crearModulo(adminModulo, nombre, numeroModulo, callback) {

    //  POR HACER:
    //  Que el usuario no esté jarcodeado.
    var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO Modulos(usuarioAdministrador, nombre, numeroModulo) VALUES(?,?,?);',
        params = [adminModulo, nombre, numeroModulo];

    bd.connect();

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultado) {
        if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        return callback(null, resultado.insertId);
    });
}

function listarModulos(callback) {

    // Que el usuario no esté jarcodeado.
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT m.idModulo, m.nombre, m.numeroModulo, m.usuarioAdministrador, u.nombre AS admin FROM Modulos AS m INNER JOIN Usuarios AS u ON m.usuarioAdministrador = u.idUsuario;';

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

function mostrarModulos(id, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT m.idModulo, m.nombre, m.numeroModulo, m.usuarioadministrador, u.nombre AS admin FROM Modulos AS m INNER JOIN Usuarios AS u ON m.usuarioAdministrador = u.idUsuario WHERE idModulo=?;',
        params= [id];
    
    sql = mysql.format(sql, params);

    bd.connect();

    bd.query(sql, function (err, resultados) {
        if (err) {
            bd.end();
            return callback(err, []);
        }
        bd.end();
        return callback(null, resultados);
    });
}

module.exports = {
    'crear' : crearModulo,
    'listar' : listarModulos,
    'mostrar' : mostrarModulos
};
