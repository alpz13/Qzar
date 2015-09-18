/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();
/*  Se incluye el archivo listarActividades.js como parte de la variable listar*/
var listar = require('../components/listarActividades.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

/* Se crea la ruta a la página de actividades
    - No se requiere request.
    - Solo se recibe un response
    + A partir de la variable listar, se manda llamar a la funcion: listarActividades(res)
*/
router.get('/', function (req, res) {
    listar.listaractividades(res);
});

module.exports = router;