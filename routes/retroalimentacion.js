/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var multiparty = require('multiparty');
var router = express.Router();
var moment = require('moment-timezone');
var modulos = require('../components/modulos.js');
var usuarios = require('../components/usuarios.js');
var retroalimentaciones = require('../components/retroalimentaciones.js');
var actividadesAsignadas = require('../components/actividadesAsignadas.js');

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
        retroalimentacion = {
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
            for (var campo in campos) {
				retroalimentacion[campo] = campos[campo];
			}
            if (archivos.foto[0].size > 0) {
                if (archivos.foto[0].headers['content-type'].match(/^image/)) {
                    retroalimentacion.archivo = archivos.foto[0];
                } else {
                    console.log(archivos.foto[0].headers);
                    res.send('La foto de retroalimentación debe ser una imagen.');
					return;
				}
            }

            // Intenta agregar retro.
            retroalimentaciones.agregar(retroalimentacion, function(err) {
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

// Petición de actualizar retroalimentación del día.
router.post('/actualizar', function (req, res, next) {
    var formulario = new multiparty.Form(),
        retroalimentacion = {
            'idModulo' : req.session.usuario.idModulo
        };

    // Valida permisos para actualizar retroalimentación.
    // Que no cheque tan chacamente.
    if (req.session.usuario.idRoles !== 2) {
        res.send("No tienes permiso para actualizar la retroalimentación.");
        return;
    }

    // Para leer el archivo.
    formulario.parse(req, function(err, campos, archivos) {
        if (err) {
            console.log(err);
            res.send('Hubo un error al actualizar la retroalimentación. Inténtelo más tarde.');
        } else {
            for (var campo in campos) {
				retroalimentacion[campo] = campos[campo];
			}
            if (archivos.foto[0].size > 0) {
                if (archivos.foto[0].headers['content-type'].match(/^image/)) {
                    retroalimentacion.archivo = archivos.foto[0];
                } else {
                    console.log(archivos.foto[0].headers);
                    res.send('La foto de retroalimentación debe ser una imagen.');
					return;
				}
            }

            // Intenta agregar retro.
            retroalimentaciones.actualizar(retroalimentacion, function(err) {
                if (err) {
                    console.log(err);
                    res.send('Hubo un error al actualizar la retroalimentación. Inténtelo más tarde.');
                } else {
                    res.redirect('/retroalimentacion/' + req.session.usuario.idModulo);
                }
            });
        }
    });
});

// Ver retroalimentaciones del módulo.
router.get('/:id(\\d+)', function (req, res, next) {
    var idModulo = req.params.id,
	    hoy = moment().tz('America/Mexico_City').format('YYYY-MM-DD');

    modulos.mostrar(idModulo, function (err, modulos) {
        if (err) {
            console.log(err);
            err = new Error('Hubo un error interno.');
            err.status = 500;
            next(err);
            return;
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

		actividadesAsignadas.listarPorDia(idModulo, hoy, function(err, actividades) {
			if (err) {
				console.log(err);
			}

			retroalimentaciones.hoy(idModulo, function(err, retroalimentacionHoy) {
				if (err) {
					console.log(err);
				}
				res.render('verretroalimentacion', { titulo: 'Retroalimentaciones', usuario:req.session.usuario, barraLateral: "retroalimentacion", modulo: modulos[0], actividades: actividades, retroalimentacionHoy: retroalimentacionHoy});
			});
		});
    });
});

router.post('/verRetroalimentacion', function (req, res, next) {
    retroalimentaciones.listarRetroalimentaciones(req.body.modulo, function(err, filasCompletas, retroalimentaciones) {
		// Lo que se tiene que hacer por vivir en un mundo asíncrono.
		if (filasCompletas === retroalimentaciones.length) {
			console.log(retroalimentaciones);
		    res.setHeader('Content-Type', 'application/json');
		    if (err) {
			    console.log(err);
			    res.send(JSON.stringify([]));
		    } else {
			    res.send(JSON.stringify(retroalimentaciones));
		    }
		}
	});
});

module.exports = router;
