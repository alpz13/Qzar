'use strict';
/*jslint
    indent: 4, unparam: true
*/
var express = require('express');

var controlador = require('../components/login.js');
var router = express.Router();
var Registro = require('log');
var observador = new Registro('info');

/* GET pantalla de inicio de sesión. */
router.get('/', function (req, res, next) {
    observador.info('req.session:');
    observador.info(req.session);
    res.render('index', { title: 'Express' });
});

/* POST datos de inicio de sesión. */
router.post('/', function (req, res, next) {
    var callback = function (err) {
        if (err) { observador.error(err); }
        observador.info('Proceso de sesiones completado.');
        res.end();
    };

    controlador.abrirSesion(req, res, callback);
});

module.exports = router;