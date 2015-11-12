/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();
/*  Se incluye el archivo listarActividades.js como parte de la variable listar*/
var listar = require('../components/listarActividades.js');
var agrega = require('../components/agregaActividad.js');
var elimina = require('../components/eliminaActividad.js');
var modifica = require('../components/modificarActividad.js');
var categoria = require('../components/categoria');

// Checa tus prvilegios
router.get(/.*/, function(req, res, next) {
    if (req.session.usuario.idRoles !== 1) {
        /*
        err = new Error('No puedes.');
        err.status = 403;
        next(err);
        return;
        */
        // res.redirect('/');
        res.render('menu', {usuario: req.session.usuario, barraLateral: 'actividades', titulo: "###", aviso: {tipo: 'danger', icono: 'fa fa-ban', mensaje: 'No tienes suficiente permisos para hacer esta acción.'}});
        return;
    }
	next();
});

router.post(/.*/, function(req, res, next) {
    if (req.session.usuario.idRoles !== 1) {
        // err = new Error('No puedes.');
        // err.status = 403;
        // next(err);
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
router.get('/', function (req, res) {
    listar.listaractividades(req, res);
    
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
