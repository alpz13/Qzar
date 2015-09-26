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


module.exports = router;