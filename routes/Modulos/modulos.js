var express = require('express');
var router = express.Router();

var modulos = require('../../components/modulos.js');

router.get('/nuevo', function(req, res, next) {
	res.render('Modulos/crearModulos', { title: 'Nuevo módulo' });
});

router.post('/nuevo', function(req, res, next) {
	if ( modulos.crear(req.body.nombre, req.body.codigo) ) {
		res.end('Felicidades: Módulo ' + req.body.nombre + ' creado exitosamente.');
	} else {
		res.end('Error: No se puedo crear módulo.');
	}
});

module.exports = router;
