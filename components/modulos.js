/*jslint
  indent: 4, unparam: true
 */
'use strict';

var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');

function crearModulo(moduloNuevo, callback) {

    var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO Modulos(usuarioAdministrador, nombre, numeroModulo, activo) VALUES(?,?,?,1);',
        params = [moduloNuevo.usuarioAdministrador, moduloNuevo.nombre, moduloNuevo.numeroModulo];

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
        sql = 'SELECT m.idModulo, m.nombre, m.numeroModulo, m.usuarioAdministrador, u.nombre AS admin FROM Modulos AS m INNER JOIN Usuarios AS u ON m.usuarioAdministrador = u.idUsuario WHERE m.activo = 1 and u.activo = 1;';

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
        sql = 'SELECT m.idModulo, m.nombre, m.numeroModulo, m.usuarioAdministrador, u.nombre AS admin, m.ancho, m.alto FROM Modulos AS m INNER JOIN Usuarios AS u ON m.usuarioAdministrador = u.idUsuario WHERE m.idModulo = ?;',
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

function actualizarModulo(modulo, callback) {

    var bd = mysql.createConnection(credenciales),
        sql = 'UPDATE Modulos SET usuarioAdministrador = ?, nombre = ?, numeroModulo = ? WHERE idModulo = ?;',
        params = [modulo.usuarioAdministrador, modulo.nombre, modulo.numeroModulo, modulo.idModulo];

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

function eliminarModulo(id, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'UPDATE Modulos SET activo=0 WHERE idModulo=?;',
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



function desplegarCuadritos(idModulo, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = "Select ContenidoCuadritos.color, ContenidoCuadritos.nombre, Cuadritos.x, Cuadritos.y, Sectores.numeroSector from Sectores, Cuadritos, ContenidoCuadritos where Sectores.idModulos = ? AND Sectores.idSector = Cuadritos.idSectores AND Cuadritos.idContenidoCuadritos = ContenidoCuadritos.idContenidoCuadritos",
        params= [idModulo];
    
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


//Borra el tamaño de la huerta
function borraHuerta(idModulo, alto, ancho, callback){
    var bd = mysql.createConnection(credenciales),
        sql = "UPDATE Modulos SET Modulos.alto = ?, Modulos.ancho = ? WHERE Modulos.idModulo = ? ",
        params= [alto, ancho, idModulo];
    
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
    'mostrar' : mostrarModulos,
    'actualizar' : actualizarModulo,
    'eliminar' : eliminarModulo,
    'desplegar': desplegarCuadritos,
    'borraHuerta': borraHuerta
};
