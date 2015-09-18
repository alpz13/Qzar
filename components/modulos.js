'use strict';

var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var credenciales = require('../database/credencialesbd.json');

function crearModulo(nombre, codigo, callback) {

    //  POR HACER:
    //  Que el usuario no esté jarcodeado.
    //  Que haga las validaciones.
    var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO Modulos(usuarioAdministrador, nombre, numeroModulo) VALUES(2,?,?);',
        params = [nombre, codigo];

    //  Prepara consulta y la ejecuta.
    bd.connect();
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

module.exports = {
    'crear' : crearModulo
};
