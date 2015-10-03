/*jslint
    indent: 4, unparam: true
*/
'use strict';

var express = require('express');
var router = express.Router();

var modulos = require('../components/modulos.js');
var usuarios = require('../components/usuarios.js');

// Página principal de módulos
router.get('/', function (req, res, next) {
    modulos.listar(function (err, modulos) {
        if (err) {
            console.log(err);
        }
        usuarios.listarAdminModulos(function (err, usuarios) {
            if (err) {
                console.log(err);
            }
        res.render('modulos', { titulo: 'Módulos', modulos: modulos, usuario: req.session.usuario, usuarios: usuarios });
        });
        
    });
});

// Formulario para crear un nuevo módulo.
router.get('/nuevo', function (req, res, next) {
    // Valida permisos para crear módulo.
    if (req.session.usuario.idRoles !== 1) {
        res.render('error', { message: 'No puedes.', error: {status: null, stack: null} });
        return;
    }

    usuarios.listarAdminModulos(function (err, usuarios) {
        if (err) {
            console.log(err);
        }
        res.render('crearmodulos', { titulo: 'Nuevo módulo', usuarios: usuarios, usuario: req.session.usuario});
    });
});

// Petición de crear nuevo módulo.
router.post('/nuevo', function (req, res, next) {
    var mensaje,
        adminModulo = req.body.admin,
        nombre = req.body.nombre,
        numero = req.body.numero;

    // Valida permisos para crear módulo.
    if (req.session.usuario.idRoles !== 1) {
        res.render('error', { message: 'No puedes.', error: {status: null, stack: null} });
        return;
    }

    // Verifica que el nombre y el número de módulo no sean vacíos.
    if (nombre.match(/^\s*$/) || !numero.match(/^\d{3}$/)) {
        res.render('crearmodulos', { titulo: 'Nuevo módulo', error: 'Los campos no pueden estar vacíos.' });
        return;
    }

    // Intenta crear módulo.
    modulos.crear(adminModulo, nombre, numero, function (err, idModulo) {
        // Si hubo error, regresa al formulario de nuevo módulo con el mensaje de error correspondiente.
        if (err) {
			console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                mensaje = 'Un módulo con este nombre o con este número ya existe.';
            } else {
                mensaje = 'Hubo un error al crear el nuevo módulo. Inténtelo más tarde.';
            }
            res.render('crearmodulos', { titulo: 'Nuevo módulo', error: mensaje });

        } else {
            res.redirect('/modulos/' + idModulo);
        }
    });
});

// Página ver modulo
router.get('/:id(\\d+)', function (req, res, next) {
    var idModulo = req.params.id;
    modulos.mostrar(idModulo, function (err, modulos) {
        if (err) {
            console.log(err);
        } else if (!modulos[0]) {
            err = new Error('Not Found');
            err.status = 404;
            next(err);
            return;
        }

        // Por ahora lo puse por nombre porque la galleta no tiene idUsuario.
        // POR HACER: Que no cheque por nombre (¿qué pasa si hay tocallos').
        if (req.session.usuario.idRoles !== 1 && modulos[0].admin !== req.session.usuario.nombre) {
            res.render('error', { message: 'No puedes.', error: {status: null, stack: null} });
            return;
        }
        usuarios.listarAdminModulos(function (err, usuarios) {
            if (err) {
                console.log(err);
            }
            res.render('vermodulos', { titulo: 'Módulo ', modulo: modulos[0], usuario: req.session.usuario, usuarios: usuarios});
        });
    });
});

router.post('/:id(\\d+)/actualizar', function (req, res, next) {

    var moduloActualizado = {
        "idModulo": req.params.id,
        "nombre": req.body.nombre,
        "numeroModulo": req.body.numero,
        "usuarioAdministrador": req.body.admin
    };

    // Valida permisos para actualizar módulo.
    if (req.session.usuario.idRoles !== 1) {
        res.send("No tienes permiso para actualizar módulo.");
        return;
    }

    // Verifica que el nombre y el número de módulo no sean vacíos.
    if (moduloActualizado.nombre.match(/^\s*$/) || !moduloActualizado.numeroModulo.match(/^\d{1,3}$/)) {
        res.send('Hubo un error: Verifique que el nombre sea vacío y el número sea de 3 dígitos.');
        return;
    }

    // Intenta actualizar módulo.
    modulos.actualizar(moduloActualizado, function (err) {
        if (err) {
			console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.send('Un módulo con este nombre o con este número ya existe.');
            } else {
                res.send('Hubo un error al actualizar el módulo. Inténtelo más tarde.');
            }

        } else {
            res.send('Correcto');
		}
	});
});

//eliminar modulo
router.get('/eliminar/:id(\\d+)', function (req, res, next) {
    var idModulo = req.params.id;
    modulos.eliminar(idModulo, function (err, modulos) {
        res.redirect('/modulos');
    });
});

module.exports = router;
