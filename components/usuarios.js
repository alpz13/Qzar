/*jslint
  indent: 4, unparam: true
*/
'use strict';

var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var credenciales = require('../database/credencialesbd.json');

// Regresa la lista de usuarios de un módulo.
// SELECT nombre, idRoles, activo FROM Usuarios WHERE idModulo = ? AND activo = 1;
function listarUsuariosModulo(id, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT nombre, idRoles, activo FROM Usuarios WHERE idModulo = ? AND activo = 1;',
        params = [id];
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
//listar usuarios
function listarUsuarios(callback) {
    var bd = mysql.createConnection(credenciales),
        sql = '(Select u.idUsuario, u.nombre as nombreUsuario, r.nombre as nombreRol, m.nombre as nombreModulo from usuarios as u, roles as r, modulos as m where u.idRoles = r.idRol and u.idModulo = m.idModulo order by m.nombre) UNION (Select u.idUsuario, u.nombre as nombreUsuario, r.nombre as nombreRol, u.idModulo as nombreModulo from usuarios as u, roles as r where u.idRoles = r.idRol and  idModulo IS NULL);';
        //sql = '(Select u.nombre as nombreUsuario, r.nombre as nombreRol, m.nombre as nombreModulo from usuarios as u, roles as r, modulos as m where u.idRoles = r.idRol and u.idModulo = m.idModulo) UNION (Select u.nombre as nombreUsuario, r.nombre as nombreRol, u.idModulo as nombreModulo from usuarios as u, roles as r where u.idRoles = r.idRol and  idModulo IS NULL);';
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


function mostrarUsuarios(id, callback) {
    var bd = mysql.createConnection(credenciales),
        //sql = 'SELECT idRoles, nombre, idUsuario FROM usuarios where idUsuario = ?',
        sql ='Select u.nombre as nombreUsuario, r.nombre as nombreRol, m.nombre as nombreModulo, u.idModulo, u.idRoles, idUsuario from usuarios as u, roles as r, modulos as m where u.idRoles = r.idRol and u.idModulo = m.idModulo and idUsuario= ?',
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

function listarRoles(callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT * FROM roles;';
    bd.connect();
    bd.query(sql, function (err, resultados) {
        if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        return callback(null, resultados);
    });
}

function listarModulos(callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT idModulo, nombre FROM modulos;';
    bd.connect();
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
    'listarAdminsGenerales' : listarAdminsGenerales,
    'listarUsuarios' : listarUsuarios,
    'mostrarUsuarios' : mostrarUsuarios,
    'listarRoles': listarRoles,
    'listarModulos' : listarModulos
};
