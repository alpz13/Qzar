'use strict';
/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var controlador = require('../components/login.js');
var router = express.Router();

/* GET pantalla de inicio de sesión. */
router.get('/', function (req, res, next) {
    console.log(controlador);
    res.render('index', { title: 'Express' });
    // Pantalla de inicio de sesión.
});

/* POST datos de inicio de sesión. */
router.post('/', function (req, res, next) {
    console.log(controlador.abrirSesion(req, res, function () {console.log('oli'); }));
    console.log('Recibido un POST.');
    console.log(req.body.nombreUsuario);
    console.log(req.body.contrasenia);
    res.end();
    // Pantalla de inicio de sesión.
});

module.exports = router;

// A continuación, la lógica del controlador
