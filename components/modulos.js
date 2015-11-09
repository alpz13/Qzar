/* globals require: true, console: true, module: true */
'use strict';

var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');
var bd = mysql.createConnection(credenciales);

function crearModulo(moduloNuevo, callback) {

    var bd = mysql.createConnection(credenciales),
        //sql = 'INSERT INTO Modulos(nombre, numeroModulo, activo) VALUES(?,?,1);',
	    // Jarcodeado temporalmente en lo que se actualiza bd y se quita constraint (problema del huevo y la gallina).
        sql = 'INSERT INTO Modulos(nombre, numeroModulo, activo, usuarioAdministrador) VALUES(?,?,1,1);',
        params = [moduloNuevo.nombre, moduloNuevo.numeroModulo];

    //bd.connect();

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultado) {
        if (err) {
            //bd.end();
            callback(err);
			return;
        }
        //bd.end();
        callback(null, resultado.insertId);
		return;
    });
}

function listarModulos(callback) {

    // Que el usuario no esté jarcodeado.
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT m.idModulo, m.nombre, m.numeroModulo, m.usuarioAdministrador, u.nombre AS admin FROM Modulos AS m INNER JOIN Usuarios AS u ON m.usuarioAdministrador = u.idUsuario WHERE m.activo = 1 and u.activo = 1;';

    //bd.connect();

    // Ejecuta consulta.
    bd.query(sql, function (err, resultados) {
        if (err) {
            //bd.end();
            callback(err);
			return;
        }
        //bd.end();
        callback(null, resultados);
		return;
    });
}

function mostrarModulos(id, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT m.idModulo, m.nombre, m.numeroModulo, m.usuarioAdministrador, u.nombre AS admin, m.ancho, m.alto FROM Modulos AS m INNER JOIN Usuarios AS u ON m.usuarioAdministrador = u.idUsuario WHERE m.idModulo = ?;',
        params= [id];
    
    sql = mysql.format(sql, params);

    //bd.connect();

    bd.query(sql, function (err, resultados) {
        if (err) {
            //bd.end();
            callback(err, []);
			return;
        }
        //bd.end();
        callback(null, resultados);
		return;
    });
}

function actualizarModulo(modulo, callback) {

    var bd = mysql.createConnection(credenciales),
        sql = 'UPDATE Modulos SET nombre = ?, numeroModulo = ? WHERE idModulo = ?;',
        params = [modulo.nombre, modulo.numeroModulo, modulo.idModulo];

    //bd.connect();

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err) {
        if (err) {
            //bd.end();
            callback(err);
			return;
        }
        //bd.end();
        callback(null);
		return;
    });
}

function eliminarModulo(id, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'UPDATE Modulos SET activo=0 WHERE idModulo=?;',
        params= [id];
    
    sql = mysql.format(sql, params);

    //bd.connect();

    bd.query(sql, function (err, resultados) {
        if (err) {
            //bd.end();
            callback(err, []);
			return;
        }
        //bd.end();
        callback(null, resultados);
		return;
    });
}

module.exports = {
    'crear' : crearModulo,
    'listar' : listarModulos,
    'mostrar' : mostrarModulos,
    'actualizar' : actualizarModulo,
    'eliminar' : eliminarModulo
};
