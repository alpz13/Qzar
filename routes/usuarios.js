'use strict';

var express = require('express');
var router = express.Router();

var usuarios = require('../components/usuarios.js');
var us = require('../components/usuarios.js');
var categoria = require('../components/categoria.js');

router.get('/', function (req, res, next) {
    if (req.session.usuario.permisos.indexOf("ver usuario") < 0) {
        //res.redirect('/usuarios/' + req.session.usuario.idUsuario);
		var err = new Error();
		err.status = 403;
		next(err);
        return;
    }

    usuarios.listarUsuarios(function (err, usuarios1) {
        if (err) {
            console.log(err);
			err = new Error();
			next(err);
        }
        usuarios.listarAdminsGenerales(function (err, usuarios2) {
            if (err) {
                console.log(err);
				err = new Error();
				next(err);
            }
            usuarios.listarRoles(function (err, qroles) {
                if (err) {
                    console.log(err);
					err = new Error();
					next(err);
                }
                usuarios.listarModulos(function (err, qmodulos) {
                    if (err) {
                        console.log(err);
						err = new Error();
						next(err);
                    }
                    res.render('usuarios', { titulo: 'Usuarios', usuarios: usuarios1, usuario: req.session.usuario, listaAdmins: usuarios2, barraLateral: 'usuarios', roles: qroles, modulos: qmodulos });
                });
            });
        });
    });
});

router.post('/agregausuario', function (req, res, next) {
    var NuevoUsuario = {
        "nombre" : req.body.nombreUsuario,
        "contrasenia" : req.body.contrasenaUsuario,
        "recontrasenia" : req.body.recontrasenaUsuario,
        "activo" : 1,
        "idRoles" : req.body.roles,
        "idModulo" : req.body.modulo
    };

    // Valida permisos para crear módulo.
    if (req.session.usuario.permisos.indexOf("crear usuario") < 0) {
        res.send("No tienes permiso para crear un usuario.");
        return;
    }

    // Verifica que el nombre, la constraseña y re-contraseña no sean vacíos.
    // Segunda verificacion, la primera esta del lado del cliente.
    if (NuevoUsuario.nombre.match(/^\s*$/) || NuevoUsuario.contrasenia.match(/^\s*$/) || NuevoUsuario.recontrasenia.match(/^\s*$/)) {
        res.send('Hubo un error: Verifique que el nombre y contraseña no sea vacío o las contraseñas coincidan.');
        return;
    }

    //Intenta crear usuario
    usuarios.agregar(NuevoUsuario, function (err) {
        if (err) {
            console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.send('Un usuario con este nombre ya existe');
            } else {
                res.send('Hubo un error al crear un nuevo usuario. Inténtelo más tarde');
            }
        } else {
            console.log("usuario creado con exito");
            res.redirect("/usuarios");
        }
    });
});

router.post('/modificarusuario', function (req, res, next) {
    // Valida permisos para crear módulo.
    if (req.session.usuario.permisos.indexOf("modificar usuario") < 0) {
        res.send("No tienes permiso para crear un usuario.");
        return;
    }

    var NuevoUsuario = {
        "nombre" : req.body.nombreUsuario,
        "contrasenia" : req.body.contrasenaUsuario,
        "recontrasenia" : req.body.recontrasenaUsuario,
        "activo" : 1,
        "idRoles" : req.body.roles,
        "idModulo" : req.body.modulo,
        "idUsuario" : req.body.nombreidUsuario
    };

    // Verifica que el nombre, la constraseña y re-contraseña no sean vacíos.
    // Segunda verificacion, la primera esta del lado del cliente.
    if (NuevoUsuario.nombre.match(/^\s*$/) || NuevoUsuario.contrasenia.match(/^\s*$/) || NuevoUsuario.recontrasenia.match(/^\s*$/)) {
        res.send('Hubo un error: Verifique que el nombre y contraseña no sea vacío o las contraseñas coincidan.');
        return;
    }

    //Intenta crear usuario
    usuarios.modificar(NuevoUsuario, function (err) {
        if (err) {
            console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.send('Un usuario con este nombre ya existe');
            } else {
                res.send('Hubo un error al modificar un usuario. Inténtelo más tarde');
            }
        } else {
            console.log("usuario ha sido modificado con exito");
            res.redirect("/usuarios");
        }
    });
});



// Página ver usuario a detalle
router.get('/:id(\\d+)', function (req, res, next) {
    var idUsuario = req.params.id;
    usuarios.mostrarUsuarios(idUsuario, function (err, usuarios) {
        if (err) {
            console.log(err);
        } else if (!usuarios[0]) {
            err = new Error('Not Found');
            err.status = 404;
            next(err);
            return;
        }

        if (req.session.usuario.permisos.indexOf("ver usuario") < 0 && req.session.usuario.idUsuario !== usuarios[0].idUsuario) {
            err = new Error();
            err.status = 403;
            next(err);
            return;
        } else {
            us.listarRoles(function (err, qroles) {
                if (err) {
                    console.log(err);
					err = new Error();
					next(err);
					return;
                }
                us.listarModulos(function (err, qmodulos) {
                    if (err) {
                        console.log(err);
						err = new Error();
						next(err);
						return;
                    }
                    console.log(usuarios[0]);
                    res.render('verusuarios', { titulo: 'Usuario: ', usuarios: usuarios[0], usuario: req.session.usuario, barraLateral: 'usuarios', roles : qroles, modulos : qmodulos});
                });
            });
        } 
    });
});


//eliminar modulo
router.get('/eliminar/:id(\\d+)', function (req, res, next) {
    var idUsuario = req.params.id;

    // Valida permisos para eliminar módulo.
    if (req.session.usuario.idRoles !== 1) {
        res.sendStatus(403);
        return;
    }

    usuarios.eliminarUsuario(idUsuario, function (err, modulos) {
        res.redirect('/usuarios');
    });
});


module.exports = router;
