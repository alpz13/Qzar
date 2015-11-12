'use strict';

var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');

//Crear nuevo Sector
function crearSector(nuevoPoste, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO ContenidoCuadritos(nombre, color) VALUES (?,?);',
        params = [nuevoPoste.nombre, nuevoPoste.escogerColor];

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultados) {
        if (err) {
            callback(err);
        } else {
            callback(null, resultados.insertId);
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

//Listar sectores
function listarSector(callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT * FROM ContenidoCuadritos';

    bd.query(sql, function (err, resultados) {
        if(err){
            callback(err);
        } else {
            callback(null, resultados);
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

//Eliminar sectores
function eliminarSector(id, callback){
    var bd = mysql.createConnection(credenciales),
        sql = 'DELETE FROM ContenidoCuadritos WHERE idContenidoCuadritos = ?',
        params = [id];

    sql = mysql.format(sql,params);

    bd.query(sql, function (err, resultados) {
        if (err) {
            callback(err, []);
        } else {
            callback(null, resultados);
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}


//Modificar nuevo Sector
function modificarSector(nuevoPoste, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'UPDATE ContenidoCuadritos SET nombre= ?, color= ? WHERE idContenidoCuadritos= ?;',
        params = [nuevoPoste.nombre, nuevoPoste.escogerColor, nuevoPoste.idContenidoCuadritos];

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultados) {
        if (err) {
            callback(err);
        } else {
            callback(null, resultados.insertId);
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
	'crear' : crearSector,
	'listar' : listarSector,
	'eliminar': eliminarSector,
	'modificar': modificarSector
};
