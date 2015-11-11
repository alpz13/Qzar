'use strict';

var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');

function listarLotes(callback) {

    // Que el usuario no esté jarcodeado.
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT lotes.idLote, usuarios.nombre as nombre, lotes.idSector as sector, DATE_FORMAT(lotes.fecha, \'%Y-%m-%d\') AS fecha, modulos.nombre as modulo, lotes.contenido from lotes, cosechas, usuarios, modulos where cosechas.idCosecha = lotes.idCosechador and cosechas.idUsuario = usuarios.idUsuario and lotes.idModulo = modulos.idModulo;';

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

//Modificar Lote
function modificarLote(nuevoLote, callback)
{
    var bd = mysql.createConnection(credenciales),
        sql = 'UPDATE Lotes SET numeroCosechador= ?, numeroSector= ?, fecha= ?,numeroModulo= ?, contenido= ? WHERE idLote= ?;',
        params = [nuevoLote.cosechador, nuevoLote.sector, nuevoLote.fecha, nuevoLote.modulo, nuevoLote.contenido, nuevoLote.idlote ];
        console.log(nuevoLote.fecha);
        // Prepara consulta y la ejecuta.
        sql = mysql.format(sql, params);
        bd.query(sql, function (err, resultados) {
            if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        return callback(null, resultados.insertId);
    });
}


module.exports = {
    'listar' : listarLotes,
    'eliminar' : eliminarLote,
    'modificar' : modificarLote
};
