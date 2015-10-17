/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var multiparty = require('multiparty');
var router = express.Router();
var modulos = require('../components/modulos.js');
var usuarios = require('../components/usuarios.js');
var retroalimentaciones = require('../components/retroalimentaciones.js');

// Para administrador general: lista de retroalimentaciones.
// Para administrador de módulo: sus retroalimentaciones.
router.get('/', function (req, res, next) {

    if (req.session.usuario.idRoles !== 1) {
        res.redirect('/retroalimentacion/' + req.session.usuario.idModulo);
        return;
    }

    modulos.listar(function (err, modulos) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.render('retroalimentaciones', { titulo: 'Retroalimentaciones', usuario: req.session.usuario, modulos: modulos, barraLateral: "retroalimentacion"});
        }
    });
});

// Petición de crear nueva retroalimentación.
router.post('/nuevo', function (req, res, next) {
    var formulario = new multiparty.Form(),
        retroalimentación = {
            'idModulo' : req.session.usuario.idModulo
        };

    // Valida permisos para agregar retroalimentación.
    // Que no cheque tan chacamente.
    if (req.session.usuario.idRoles !== 2) {
        res.send("No tienes permiso para enviar retroalimentación.");
        return;
    }

    // Para leer el archivo.
    formulario.parse(req, function(err, campos, archivos) {
        if (err) {
            console.log(err);
            res.send('Hubo un error al agregar la retroalimentación. Inténtelo más tarde.');
        } else {
            retroalimentación.descripción = campos.descripcion;
            if (archivos.archivo[0].size > 0) {
                if (archivos.archivo[0].headers['content-type'].match(/^image/)) {
                    retroalimentación.archivo = archivos.archivo[0];
                } else {
                    console.log(archivos.archivo[0].headers);
                    res.send('La foto de retroalimentación debe ser una imagen.');
					return;
				}
            }

            // Intenta agregar retro.
            retroalimentaciones.agregar(retroalimentación, function(err) {
                if (err) {
                    console.log(err);
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.send('Ya se agregó una retroalimentación para este día.');
                    } else {
                        res.send('Hubo un error al agregar la retroalimentación. Inténtelo más tarde.');
                    }
                } else {
                    res.redirect('/retroalimentacion/' + req.session.usuario.idModulo);
                }
            });
        }
    });
});

// Ver retroalimentaciones del módulo.
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

        if (req.session.usuario.idRoles !== 1 && req.session.usuario.idModulo !== modulos[0].idModulo) {
            err = new Error('No puedes.');
            err.status = 403;
            next(err);
            return;
        }

        res.render('verretroalimentacion', { titulo: 'Retroalimentación', usuario:req.session.usuario, barraLateral: "retroalimentacion", modulo: modulos[0]});
    });
});

router.post('/verRetroalimentacion', function (req, res, next) {
    retroalimentaciones.listarRetroalimentaciones(req.body.modulo, res);
});

module.exports = router;
