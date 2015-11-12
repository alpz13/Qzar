'use strict';

var express = require('express');
var router = express.Router();

var actividades = require('../components/actividades.js');

/*
 * Todo este componente requiere del rol con id 1.
 * En caso de que el usuario no cuente con este rol, se despliega un error.
 */
router.get(/.*/, function(req, res, next) {
    if (req.session.usuario.idRoles !== 1) {
        var err = new Error('No tienes suficiente permisos para hacer esta acción.');
        err.status = 403;
        next(err);
    } else {
	    next();
    }
});
router.post(/.*/, function(req, res, next) {
    if (req.session.usuario.idRoles !== 1) {
        var err = new Error('No tienes suficiente permisos para hacer esta acción.');
        err.status = 403;
        next(err);
    } else {
	    next();
    }
});

/* Se crea la ruta a la página de actividades
    - No se requiere request.
    - Solo se recibe un response
    + A partir de la variable listar, se manda llamar a la funcion: listarActividades(res)
*/
router.get('/', function (req, res, next) {
    actividades.listaractividades(function(err, rows) {
        if(err) {
            err.status = 401;
            next(err);
            return;
        }
        res.render('actividades', {
            title: 'Actividades',
            titulo: 'Actividades',
            actividades: rows,
            usuario: req.session.usuario,
            barraLateral: 'actividades'
        });
    });
});

router.post('/agregaactividad', function (req, res, next) {
    actividades.agrega(req, function(err) {
		if (err) {
			console.log(err);
		}
		res.redirect('/actividades');
	});
});

router.post('/modificar', function(req, res){
	actividades.modifica(req, function(err) {
		if (err) {
			console.log(err);
		}
		res.redirect('/actividades');
	});
});

router.post('/eliminaactividad', function(req, res){
	actividades.elimina(req, function(err) {
		if (err) {
			console.log(err);
		}
		res.redirect('/actividades');
	});
});

module.exports = router;
