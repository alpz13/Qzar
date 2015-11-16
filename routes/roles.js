'use strict';

var express = require('express');
var router = express.Router();
var mysql = require('mysql');   

/* */
router.get('/', function (req, res, next) {
    var conexion = require('mysql').createConnection(require('../database/credencialesbd.json'));
    /*
    var consulta = 'SELECT P.idPermiso ,P.nombre FROM qzardb.Permisos as P ,qzardb.RolesPermisos as RP ,qzardb.Usuarios as U WHERE U.nombre = ? AND U.idRoles = RP.idRoles AND P.idPermiso = RP.idPermisos;';
    var valores = [nombreUsuario];
    */
    var consulta = 'SELECT R.idRol, R.nombre FROM qzardb.Roles as R WHERE R.activo = 1';

    conexion.query({sql: consulta, values: []}, function (err, renglones) {
        conexion.end();
        if (err) {
            // TODO: manejar el error!
            res.render('index', {usuario: req.session.usuario, mensaje: err, titulo: '###', aviso: {tipo: 'danger', icono: 'fa fa-exclamation-triangle', mensaje: err}});
            return;
        }

        res.render('roles', {usuario: req.session.usuario, barraLateral: 'roles', titulo: 'Roles', roles: renglones});
    });
});

/* */
router.post('/crear', function (req, res, next) {
    if(!(req.body['permisos[]'] instanceof Array)) {
        req.body['permisos[]'] = [req.body['permisos[]']];
    }
    var conexion = require('mysql').createConnection(require('../database/credencialesbd.json'));
    var consulta = 'INSERT INTO qzardb.Roles (nombre) VALUES (?);';
    var valores = [req.body.nombre];

    conexion.query({sql: consulta, values: valores}, function (err, renglones) {
        if (err) {
            console.log(err);
            conexion.end();
            res.send('Error:' + err);
            return;
        }
        var id = renglones['insertId'];
        var error = null;

        for(var v in req.body['permisos[]']) {
            consulta = 'INSERT INTO qzardb.RolesPermisos (idRoles,idPermisos) VALUES (?, ?);'
            valores = [id, req.body['permisos[]'][v]];
            conexion.query({sql: consulta, values: valores}, function (err) {
                if(err) {
                    console.log(err);
                    error = err;
                }
            });
            if(error) {
                break;
            }
        }
        conexion.end();

        if(error) {
            // TODO: manejar el error!
            res.send('Error:' + error);
            return;
        }
        res.send('1');
    });
});

/* */
router.post('/modificar/:id(\\d+)', function (req, res, next) {

    if (!(req.body['permisos[]'] instanceof Array)) {
        req.body['permisos[]'] = [req.body['permisos[]']];
    }
    var conexion = require('mysql').createConnection(require('../database/credencialesbd.json'));
    var consulta = 'UPDATE Roles SET nombre = ? WHERE idRol = ?;';
    var valores = [req.body.nombre, req.params.id];

    conexion.query({sql: consulta, values: valores}, function (err, renglones) {
        if (err) {
            console.log(err);
            conexion.end();
            res.send('Error: ' + err);
            return;
        }
        var error = null;

		// Resetra todos los permisos.
		consulta = 'DELETE FROM RolesPermisos WHERE idRoles = ?;';
		valores = [req.params.id];

		conexion.query({sql: consulta, values: valores}, function (err, renglones) {
			if(err) {
				console.log(err);
				error = err;
			} else {

				// Agrega los nuevos permisos.
				for(var v in req.body['permisos[]']) {
					consulta = 'INSERT INTO RolesPermisos (idRoles,idPermisos) VALUES (?, ?);'
					valores = [req.params.id, req.body['permisos[]'][v]];
					conexion.query({sql: consulta, values: valores}, function (err) {
					    if(err) {
					        console.log(err);
					        error = err;
					    }
					});
				}
				conexion.end();

				if(error) {
					// TODO: manejar el error!
					res.send('Error:' + error);
					return;
				}
				res.send('1');
			}
		});
	});
});

/*
    TODO: Esto deberia de ser un POST, no???
*/
router.get('/eliminar/:id(\\d+)', function (req, res, next) {
    var conexion = require('mysql').createConnection(require('../database/credencialesbd.json'));
    var id = req.params.id;
    var consulta = 'UPDATE Roles as R SET R.activo = 0 WHERE R.idRol = ?';

    conexion.query({sql: consulta, values: [id]}, function (err, renglones) {
        conexion.end();
        if (err) {
            // TODO: manejar el error!
            res.render('menu', {usuario: req.session.usuario, mensaje: err, titulo: '###', aviso: {tipo: 'danger', icono: 'fa fa-exclamation-triangle', mensaje: err}});
            return;
        }

        res.redirect('/roles');
    });
});

// Consulta rol.
router.get('/:id(\\d+)', function (req, res, next) {
    var conexion = require('mysql').createConnection(require('../database/credencialesbd.json'));
    var id = req.params.id;
	var permisos = [];
    var consulta = 'SELECT R.nombre, P.idPermisos FROM Roles AS R LEFT JOIN RolesPermisos AS P ON R.idRol = P.idRoles WHERE R.idRol = ?';

    conexion.query({sql: consulta, values: [id]}, function (err, renglones) {
        conexion.end();
        if (err) {
			console.log(err);
			res.send(JSON.stringify({error: "Hubo un errror interno."}));
        } else if (renglones.length === 0) {
			res.send(JSON.stringify({error: "No se encontró el rol en el sistema."}));
		} else {
			for (var i in renglones) {
				permisos.push(renglones[i].idPermisos);
			}
			res.send(JSON.stringify({nombre: renglones[0].nombre, permisos: permisos}));
		}
    });
});

module.exports = router;
