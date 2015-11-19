
var express = require('express');
var router = express.Router();
var listar = require('../components/listarActividades.js');
var agrega = require('../components/agregaActividad.js');
var elimina = require('../components/eliminaActividad.js');
var modifica = require('../components/modificarActividad.js');
var categoria = require('../components/categoria');

/* Se crea la ruta a la página de actividades
    - No se requiere request.
    - Solo se recibe un response
    + A partir de la variable listar, se manda llamar a la funcion: listarActividades(res)
*/
    
router.get('/', function (req, res, next) {
	if (req.session.usuario.permisos.indexOf("ver actividad") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
	} else {
		listar.listaractividades(req, res);
	}
});

router.post('/agregaactividad', function (req, res, next) {
	if (req.session.usuario.permisos.indexOf("crear actividad") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
	} else {
		agrega.agrega(req, res);
	}
});

router.post('/modificar', function(req, res, next){
	if (req.session.usuario.permisos.indexOf("modificar actividad") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
	} else {
		modifica.modifica(req, res);
	}
});

router.post('/eliminaactividad', function(req, res, next){
	if (req.session.usuario.permisos.indexOf("eliminar actividad") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
	} else {
		elimina.elimina(req, res);
	}
});

module.exports = router;
