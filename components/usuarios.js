/* globals require: true, module: true, console: true, console: true*/
'use strict';

var mysql = require('mysql');
var credenciales = require('../database/credencialesbd.json');

function listarUsuariosModulo(id, callback) {
    var conexion = mysql.createConnection(credenciales),
        consulta = 'SELECT nombre, idRoles, activo FROM Usuarios WHERE idModulo = ? AND activo = 1;',
        params = [id];

    consulta = mysql.format(consulta, params);

    conexion.query(consulta, function (err, resultados) {
        if (err) {
            console.log(err);
            callback(err, []);
        } else {
            callback(null, resultados);
        }
    });

    conexion.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function listarUsuarios(callback) {
    var conexion = mysql.createConnection(credenciales),
        consulta = '(Select u.idUsuario, u.nombre as nombreUsuario, r.nombre as nombreRol, m.nombre as nombreModulo from Usuarios as u, Roles as r, Modulos as m where u.idRoles = r.idRol and u.idModulo = m.idModulo and u.activo = 1 order by m.nombre) UNION (Select u.idUsuario, u.nombre as nombreUsuario, r.nombre as nombreRol, u.idModulo as nombreModulo from Usuarios as u, Roles as r where u.idRoles = r.idRol and u.activo = 1 and idModulo IS NULL);';

    conexion.query(consulta, function (err, resultados) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, resultados);
        }
    });

    conexion.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function listarAdminsGenerales(callback) {
    var conexion = mysql.createConnection(credenciales),
        consulta = 'SELECT * FROM Usuarios WHERE idRoles = 1 AND activo = 1;';

    conexion.query(consulta, function (err, resultados) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, resultados);
        }
    });

    conexion.end(function(err) {
        console.log(err);
    });
}


function mostrarUsuarios(id, callback) {
    var conexion = mysql.createConnection(credenciales),
        consulta ='Select u.nombre as nombreUsuario, r.nombre as nombreRol, m.nombre as nombreModulo, u.idModulo, u.idRoles, idUsuario from Usuarios as u, Roles as r, Modulos as m where u.idRoles = r.idRol and u.idModulo = m.idModulo and idUsuario= ?',
        params= [id];

    consulta = mysql.format(consulta, params);

    conexion.query(consulta, function (err, resultados) {
        if (err) {
            console.log(err);
            callback(err, []);
        } else {
            callback(null, resultados);
        }
    });

    conexion.end(function(err) {
        console.log(err);
    });
}

function listarRoles(callback) {
    var conexion = mysql.createConnection(credenciales),
        consulta = 'SELECT * FROM Roles;';

    conexion.query(consulta, function (err, resultados) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, resultados);
        }
    });

    conexion.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function listarModulos(callback) {
    var conexion = mysql.createConnection(credenciales),
        consulta = 'SELECT idModulo, nombre FROM Modulos;';

    conexion.query(consulta, function (err, resultados) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, resultados);
        }
    });

    conexion.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function eliminarUsuario(id, callback) {
    var conexion = mysql.createConnection(credenciales),
        consulta = 'UPDATE Usuarios SET activo=0 WHERE idUsuario=?;',
        params= [id];

    consulta = mysql.format(consulta, params);

    conexion.query(consulta, function (err, resultados) {
        if (err) {
            console.log(err);
            callback(err, []);
        } else {
            callback(null, resultados);
        }
    });

    conexion.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

var agregar = function (NuevoUsuario, callback) {
    var conexion = mysql.createConnection(credenciales),
        consulta = 'INSERT INTO Usuarios(idRoles, nombre, contrasena, idModulo, activo) VALUES(?, ?, ?, ?, 1);',
        params = [NuevoUsuario.idRoles, NuevoUsuario.nombre, NuevoUsuario.contrasenia, NuevoUsuario.idModulo];
    
    consulta = mysql.format(consulta, params);

    conexion.query(consulta, function (err) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log('Usuario creado');
            callback(null);
        }
    });

    conexion.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
};

var modificar = function (NuevoUsuario, callback) {
    var conexion = mysql.createConnection(credenciales),
        consulta = "UPDATE `Usuarios` SET `idRoles`= ?,`nombre`= ?,`contrasena`= ?,`idModulo`= ? WHERE Usuarios.idUsuario = ?",
        params = [NuevoUsuario.idRoles, NuevoUsuario.nombre, NuevoUsuario.contrasenia, NuevoUsuario.idModulo, NuevoUsuario.idUsuario];
    
    consulta = mysql.format(consulta, params);

    conexion.query(consulta, function (err) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log('Usuario modificado');
            callback(null);
        }
    });

    conexion.end(function(err) {
        if (err) {
            console.log(err);
        }
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
