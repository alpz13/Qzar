'use strict';

var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');

function listarLotes(callback) {

    // Que el usuario no esté jarcodeado.
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT lotes.idLote, usuarios.nombre as nombre, lotes.idSector as sector, lotes.fecha, modulos.nombre as modulo, lotes.contenido from lotes, cosechas, usuarios, modulos where cosechas.idCosecha = lotes.idCosechador and cosechas.idUsuario = usuarios.idUsuario and lotes.idModulo = modulos.idModulo;';

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

function eliminarLote(id, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'DELETE FROM lotes WHERE idLote = ? ;',
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
    'listar' : listarLotes,
    'eliminar' : eliminarLote
};
