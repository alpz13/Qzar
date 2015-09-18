var express = require('express');
var router = express.Router();

var modulos = require('../components/modulos.js');

function isEmpty(str) {
    return (!str || 0 === str.length);
}

router.get('/nuevo', function(req, res, next) {
	res.render('crearmodulos', { title: 'Nuevo módulo' });
});

router.post('/nuevo', function(req, res, next) 
{
	if(isEmpty(req.body.nombre) || isEmpty(req.body.codigo) ) 
	{
		res.end('Los campos no pueden estar vacios.');
	}
	modulos.crear(req.body.nombre, req.body.codigo, function(err) {
		if (err) {
			//res.end(err);
			//res.render(err);
			//console.log(err.code);

			if (err.code == 'ER_DUP_ENTRY') {
				res.end('El Módulo/código ya existe.');
			}
			
			//res.end('Error: No se puedo crear módulo.');
		} else {
			res.end('Felicidades: Módulo ' + req.body.nombre + ' creado exitosamente.');
		}
	});
});

module.exports = router;