/*jslint
  indent: 4, unparam: true
 */
'use strict';

var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var credenciales = require('../database/credencialesbd.json');

function crearModulo(nombre, codigo, callback) {

    //  POR HACER:
    //  Que el usuario no esté jarcodeado.
    var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO Modulos(usuarioAdministrador, nombre, numeroModulo) VALUES(2,?,?);',
        params = [nombre, codigo];

    bd.connect();

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err) {
        if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        return callback(null);
    });
}

function listarModulos(callback) {

    // Que el usuario no esté jarcodeado.
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT * FROM Modulos;';

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
    'crear' : crearModulo,
    'listar' : listarModulos
};
