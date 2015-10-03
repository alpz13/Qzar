/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();
/*  Se incluye el archivo listarActividades.js como parte de la variable listar*/
var listar = require('../components/listarActividades.js');
var agrega = require('../components/agregaActividad.js');

/* Se crea la ruta a la página de actividades
    - No se requiere request.
    - Solo se recibe un response
    + A partir de la variable listar, se manda llamar a la funcion: listarActividades(res)
*/
router.get('/', function (req, res) {
    listar.listaractividades(req, res);
});

/* Se crea la ruta para iniciar el caso de uso agregar las actividades
    + se requiere el request para mandar la informacion de la forma
    + A partir de la variable agrega manda a llamar la funcion: agregar(req, res)
*/
router.post('/agregaactividad', function (req, res, next) {
    agrega.agrega(req, res);
});

module.exports = router;