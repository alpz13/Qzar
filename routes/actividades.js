'use strict';

var express = require('express');
var router = express.Router();

var listar = require('../components/listarActividades.js');
var agrega = require('../components/agregaActividad.js');
var elimina = require('../components/eliminaActividad.js');
var modifica = require('../components/modificarActividad.js');

/*
 * Todo este componente requiere del rol con id 1.
 * En caso de que el usuario no cuente con este rol, se despliega un error.
 */
router.get(/.*/, function(req, res, next) {
    if (req.session.usuario.idRoles !== 1) {
        res.render('menu', {usuario: req.session.usuario, barraLateral: 'actividades', titulo: "###", aviso: {tipo: 'danger', icono: 'fa fa-ban', mensaje: 'No tienes suficiente permisos para hacer esta acción.'}});
        return;
    }
	next();
});

router.post(/.*/, function(req, res, next) {
    if (req.session.usuario.idRoles !== 1) {
        res.render('menu', {usuario: req.session.usuario, barraLateral: 'actividades', titulo: "###", aviso: {tipo: 'danger', icono: 'fa fa-ban', mensaje: 'No tienes suficiente permisos para hacer esta acción.'}});
        return;
    }
	next();
});

/* Se crea la ruta a la página de actividades
    - No se requiere request.
    - Solo se recibe un response
    + A partir de la variable listar, se manda llamar a la funcion: listarActividades(res)
*/
router.get('/', function (req, res, next) {
    listar.listaractividades(req, res, function(err, rows) {
        if(err) {
            err.status = 401;
            next(err);
            return;
        }
        res.render('actividades', {
            title: 'Actividades',
            actividades: rows,
            usuario: req.session.usuario,
            barraLateral: 'actividades'
        });
    });
});

router.post('/agregaactividad', function (req, res, next) {
    agrega.agrega(req, res);
});

router.post('/modificar', function(req, res){
	modifica.modifica(req, res);
});

router.post('/eliminaactividad', function(req, res){
	elimina.elimina(req, res);
});

module.exports = router;
