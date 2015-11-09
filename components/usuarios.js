/* globals require: true, module: true, console: true, console: true*/
'use strict';

var mysql = require('mysql');
var credenciales = require('../database/credencialesbd.json');
var conexion = mysql.createConnection(credenciales);

function listarUsuariosModulo(id, callback) {
    var consulta = 'SELECT nombre, idRoles, activo FROM Usuarios WHERE idModulo = ? AND activo = 1;',
        params = [id];
    consulta = mysql.format(consulta, params);
    //conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        if (err) {
            //conexion.end();
            console.log(err);
            return callback(err, []);
        }
        //conexion.end();
        return callback(null, resultados);
    });
}

function listarUsuarios(callback) {
    var consulta = '(Select u.idUsuario, u.nombre as nombreUsuario, r.nombre as nombreRol, m.nombre as nombreModulo from Usuarios as u, Roles as r, Modulos as m where u.idRoles = r.idRol and u.idModulo = m.idModulo and u.activo = 1 order by m.nombre) UNION (Select u.idUsuario, u.nombre as nombreUsuario, r.nombre as nombreRol, u.idModulo as nombreModulo from Usuarios as u, Roles as r where u.idRoles = r.idRol and u.activo = 1 and idModulo IS NULL);';
    //conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        if (err) {
            //conexion.end();
            console.log(err);
            return callback(err);
        }
        //conexion.end();
        return callback(null, resultados);
    });
}

function listarAdminsGenerales(callback) {
    var consulta = 'SELECT * FROM Usuarios WHERE idRoles = 1 AND activo = 1;';
    //conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        if (err) {
            //conexion.end();
            console.log(err);
            return callback(err);
        }
        //conexion.end();
        return callback(null, resultados);
    });
}


function mostrarUsuarios(id, callback) {
    var consulta ='Select u.nombre as nombreUsuario, r.nombre as nombreRol, m.nombre as nombreModulo, u.idModulo, u.idRoles, idUsuario from Usuarios as u, Roles as r, Modulos as m where u.idRoles = r.idRol and u.idModulo = m.idModulo and idUsuario= ?',
        params= [id];
    consulta = mysql.format(consulta, params);
    //conexion.connect();

    conexion.query(consulta, function (err, resultados) {
        if (err) {
            //conexion.end();
            console.log(err);
            return callback(err, []);
        }
        //conexion.end();
        return callback(null, resultados);
    });
}

function listarRoles(callback) {
    var consulta = 'SELECT * FROM Roles;';
    //conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        if (err) {
            //conexion.end();
            console.log(err);
            return callback(err);
        }
        //conexion.end();
        return callback(null, resultados);
    });
}

function listarModulos(callback) {
    var consulta = 'SELECT idModulo, nombre FROM Modulos;';
    //conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        if (err) {
            //conexion.end();
            console.log(err);
            return callback(err);
        }
        //conexion.end();
        return callback(null, resultados);
    });
}

function eliminarUsuario(id, callback) {
    var consulta = 'UPDATE Usuarios SET activo=0 WHERE idUsuario=?;',
        params= [id];
    consulta = mysql.format(consulta, params);
    //conexion.connect();
    conexion.query(consulta, function (err, resultados) {
        if (err) {
            //conexion.end();
            console.log(err);
            return callback(err, []);
        }
        //conexion.end();
        return callback(null, resultados);
    });
}

var agregar = function (NuevoUsuario, callback) {
    var consulta = 'INSERT INTO Usuarios(idRoles, nombre, contrasena, idModulo, activo) VALUES(?, ?, ?, ?, 1);',
        params = [NuevoUsuario.idRoles, NuevoUsuario.nombre, NuevoUsuario.contrasenia, NuevoUsuario.idModulo];
    //conexion.connect();
    consulta = mysql.format(consulta, params);
    conexion.query(consulta, function (err) {
        if (err) {
            //conexion.end();
            console.log(err);
            return callback(err);
        }
        //conexion.end();
        console.log('Usuario creado');
        return callback(null);
    });
};

var modificar = function (NuevoUsuario, callback) {
    var consulta = 'UPDATE `usuarios` SET `idRoles`= "' + NuevoUsuario.idRoles + '",`nombre`= "' + NuevoUsuario.nombre + '",`contrasena`= "'+ NuevoUsuario.contrasenia +'",`idModulo`= "'+ NuevoUsuario.idModulo + '" WHERE usuarios.idUsuario = ' + NuevoUsuario.idUsuario + '';
    //conexion.connect();
    conexion.query(consulta, function (err) {
        if (err) {
            //conexion.end();
            console.log(err);
            return callback(err);
        }
        //conexion.end();
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
