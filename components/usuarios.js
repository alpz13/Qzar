/* globals require: true, module: true, console: true, console: true*/
'use strict';

var mysql = require('mysql');
var credenciales = require('../database/credencialesbd.json');

function listarUsuariosModulo(id, callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta = 'SELECT nombre, idRoles, activo FROM Usuarios WHERE idModulo = ? AND activo = 1;',
        params = [id];
    consulta = mysql.format(consulta, params);
    conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        conexion.end();
        if (err) {
            console.log(err);
            return callback(err, []);
        }
        return callback(null, resultados);
    });
}

function listarUsuarios(callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta = '(Select u.idUsuario, u.nombre as nombreUsuario, r.nombre as nombreRol, m.nombre as nombreModulo from Usuarios as u, Roles as r, Modulos as m where u.idRoles = r.idRol and u.idModulo = m.idModulo and u.activo = 1 order by m.nombre) UNION (Select u.idUsuario, u.nombre as nombreUsuario, r.nombre as nombreRol, u.idModulo as nombreModulo from Usuarios as u, Roles as r where u.idRoles = r.idRol and u.activo = 1 and idModulo IS NULL);';
    conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        conexion.end();
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(null, resultados);
    });
}

function listarAdminsGenerales(callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta = 'SELECT * FROM Usuarios WHERE idRoles = 1 AND activo = 1;';
    conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        conexion.end();
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(null, resultados);
    });
}


function mostrarUsuarios(id, callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta ='Select u.nombre as nombreUsuario, r.nombre as nombreRol, m.nombre as nombreModulo, u.idModulo, u.idRoles, idUsuario from Usuarios as u, Roles as r, Modulos as m where u.idRoles = r.idRol and u.idModulo = m.idModulo and idUsuario= ?',
        params= [id];
    consulta = mysql.format(consulta, params);
    conexion.connect();

    conexion.query(consulta, function (err, resultados) {
        conexion.end();
        if (err) {
            console.log(err);
            return callback(err, []);
        }
        return callback(null, resultados);
    });
}

function listarRoles(callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta = 'SELECT * FROM Roles WHERE activo = 1;';
    conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        conexion.end();
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(null, resultados);
    });
}

function listarModulos(callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta = 'SELECT idModulo, nombre FROM Modulos WHERE activo = 1;';
    conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        conexion.end();
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(null, resultados);
    });
}

function eliminarUsuario(id, callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta = 'UPDATE Usuarios SET activo=0 WHERE idUsuario=?;',
        params= [id];
    consulta = mysql.format(consulta, params);
    conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        conexion.end();
        if (err) {
            console.log(err);
            return callback(err, []);
        }
        return callback(null, resultados);
    });
}

var agregar = function (NuevoUsuario, callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta = 'INSERT INTO Usuarios(idRoles, nombre, contrasena, idModulo, activo) VALUES(?, ?, ?, ?, 1);',
        params = [NuevoUsuario.idRoles, NuevoUsuario.nombre, NuevoUsuario.contrasenia, NuevoUsuario.idModulo];
    conexion.connect();
    consulta = mysql.format(consulta, params);
    conexion.query(consulta, function (err) {
        conexion.end();
        if (err) {
            console.log(err);
            return callback(err);
        }
        console.log('Usuario creado');
        return callback(null);
    });
};

var modificar = function (NuevoUsuario, callback) {
	var conexion = mysql.createConnection(credenciales);
    var consulta = 'UPDATE `Usuarios` SET `idRoles`= ?, `nombre`= ?, `contrasena`= ?, `idModulo`= ? WHERE Usuarios.idUsuario = ?';
	var params = [NuevoUsuario.idRoles, NuevoUsuario.nombre, NuevoUsuario.contrasenia, NuevoUsuario.idModulo, NuevoUsuario.idUsuario];

    conexion.connect();
	consulta = mysql.format(consulta, params);
    conexion.query(consulta, function (err) {
        conexion.end();
        if (err) {
            console.log(err);
            return callback(err);
        }
        console.log('Usuario modificado');
        return callback(null);
    });
};

module.exports = {
    'listarUsuariosModulo' : listarUsuariosModulo,
    'listarAdminsGenerales' : listarAdminsGenerales,
    'listarUsuarios' : listarUsuarios,
    'mostrarUsuarios' : mostrarUsuarios,
    'listarRoles': listarRoles,
    'listarModulos' : listarModulos,
    'eliminarUsuario' : eliminarUsuario,
    'agregar' : agregar,
    'modificar' : modificar
};
