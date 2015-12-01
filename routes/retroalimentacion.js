'use strict';

var express = require('express');
var multiparty = require('multiparty');
var router = express.Router();
var moment = require('moment-timezone');
var modulos = require('../components/modulos.js');
var usuarios = require('../components/usuarios.js');
var retroalimentaciones = require('../components/retroalimentaciones.js');
var actividadesAsignadas = require('../components/actividadesAsignadas.js');

router.get('/', function (req, res, next) {

    if (req.session.usuario.permisos.indexOf("ver modulo") < 0) {
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
	    hoy = moment().tz('America/Mexico_City').format('YYYY-MM-DD'),
        retroalimentacion = {
            'idModulo' : req.session.usuario.idModulo
        };

    // Valida permisos para agregar retroalimentación.
    if (req.session.usuario.permisos.indexOf("crear retroalimentacion") < 0) {
        //res.send("No tienes permiso para enviar retroalimentación.");
		var err = new Error();
		err.status = 403;
		next(err);
        return;
    }

    // Para leer el archivo.
    formulario.parse(req, function(err, campos, archivos) {
        if (err) {
            console.log(err);
		    var err = new Error('Hubo un error al agregar la retroalimentación. Inténtelo más tarde.');
		    err.status = 500;
		    next(err);
        } else {
            for (var campo in campos) {
				retroalimentacion[campo] = campos[campo];
			}

			// Ya pasó la fecha.
			if (retroalimentacion.dia != hoy) {
		        var err = new Error('Ya pasó la fecha para modificar la retroalimentación de ese día.');
		        err.status = 500;
		        next(err);
				return;
			}

            if (archivos.foto[0].size > 0) {
                if (archivos.foto[0].headers['content-type'].match(/^image/)) {
                    retroalimentacion.archivo = archivos.foto[0];
                } else {
                    console.log(archivos.foto[0].headers);
		            var err = new Error('La foto de retroalimentación debe ser una imagen.');
		            err.status = 500;
		            next(err);
					return;
				}
            }

            // Intenta agregar retro.
            retroalimentaciones.agregar(retroalimentacion, function(err) {
                if (err) {
                    console.log(err);
                    if (err.code === 'ER_DUP_ENTRY') {
		                var err = new Error('Ya se agregó una retroalimentación para este día.');
		                err.status = 500;
		                next(err);
                    } else {
		                var err = new Error('Hubo un error al agregar la retroalimentación. Inténtelo más tarde.');
		                err.status = 500;
		                next(err);
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
	    hoy = moment().tz('America/Mexico_City').format('YYYY-MM-DD'),
        retroalimentacion = {
            'idModulo' : req.session.usuario.idModulo
        };

    // Valida permisos para actualizar retroalimentación.
    if (req.session.usuario.permisos.indexOf("modificar retroalimentacion") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
        return;
    }

    // Para leer el archivo.
    formulario.parse(req, function(err, campos, archivos) {
        if (err) {
            console.log(err);
            //res.send('Hubo un error al actualizar la retroalimentación. Inténtelo más tarde.');
		    var err = new Error('Hubo un error al actualizar la retroalimentación. Inténtelo más tarde.');
		    err.status = 500;
		    next(err);
        } else {
            for (var campo in campos) {
				retroalimentacion[campo] = campos[campo];
			}

			// Ya pasó la fecha.
			if (retroalimentacion.dia != hoy) {
		        var err = new Error('Ya pasó la fecha para modificar la retroalimentación de ese día.');
		        err.status = 500;
		        next(err);
				return;
			}

            if (archivos.foto[0].size > 0) {
                if (archivos.foto[0].headers['content-type'].match(/^image/)) {
                    retroalimentacion.archivo = archivos.foto[0];
                } else {
                    console.log(archivos.foto[0].headers);
		            var err = new Error('La foto de retroalimentación debe ser una imagen.');
		            err.status = 500;
		            next(err);
					return;
				}
            }

            // Intenta agregar retro.
            retroalimentaciones.actualizar(retroalimentacion, function(err) {
                if (err) {
                    console.log(err);
		            var err = new Error('Hubo un error al actualizar la retroalimentación. Inténtelo más tarde.');
		            err.status = 500;
		            next(err);
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
            err = new Error('El módulo buscado no existe.');
            err.status = 404;
            next(err);
            return;
        }

        if (req.session.usuario.permisos.indexOf("ver retroalimentacion") < 0 && req.session.usuario.permisos.indexOf("crear retroalimentacion") < 0 && req.session.usuario.permisos.indexOf("modificar retroalimentacion") < 0) {
            err = new Error();
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
					retroalimentacionHoy = [];
				}
				res.render('verretroalimentacion', { titulo: 'Retroalimentaciones', usuario:req.session.usuario, barraLateral: "retroalimentacion", modulo: modulos[0], actividades: actividades, retroalimentacionHoy: retroalimentacionHoy, hoy: hoy});
			});
		});
    });
});

router.post('/verRetroalimentacion', function (req, res, next) {
	var retros = {},
		listaRetros = [],
		mes = moment().tz('America/Mexico_City').format('YYYY-MM-DD');

	if (req.body.mes) {
		mes = req.body.mes;
	}

        if (req.session.usuario.permisos.indexOf("ver retroalimentacion") < 0 && req.session.usuario.permisos.indexOf("crear retroalimentacion") < 0 && req.session.usuario.permisos.indexOf("modificar retroalimentacion") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
		return;
	}

    retroalimentaciones.listarRetroalimentaciones(req.body.modulo, mes, function(err, filas) {
		res.setHeader('Content-Type', 'application/json');
		if (err) {
			console.log(err);
		    res.send(JSON.stringify([]));
	    } else {
			// Construye retroalimentaciones por día con su lista de actividades.
			for (var i in filas) {
				if (!retros[filas[i].fecha]) {
					retros[filas[i].fecha] = {
						"date": filas[i].fecha,
						"descripcion": filas[i].descripcion,
						"ruta": filas[i].ruta,
						"actividades": []
					};
				}
				if (filas[i].nombre) {
					retros[filas[i].fecha].actividades.push({
						"nombre": filas[i].nombre,
						"numeroSector": filas[i].numeroSector,
						"cumplido": filas[i].cumplido
					});
				}
			}
			for (var llave in retros) {
				listaRetros.push(retros[llave]);
			}
			//console.log(listaRetros);

		    res.send(JSON.stringify(listaRetros));
		}
	});
});

module.exports = router;
