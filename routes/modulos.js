var express = require('express');
var router = express.Router();

var modulos = require('../components/modulos.js');

router.get('/nuevo', function(req, res, next) {
	res.render('crearmodulos', { title: 'Nuevo módulo' });
});

router.post('/nuevo', function(req, res, next) {
	modulos.crear(req.body.nombre, req.body.codigo, function(err) {
		if (err) {
			console.log(err);
			res.end('Error: No se puedo crear módulo.');
		} else {
			res.end('Felicidades: Módulo ' + req.body.nombre + ' creado exitosamente.');
		}
	});
});

module.exports = router;
