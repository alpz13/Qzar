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
    if (req.session.usuario) {
        observador.info('req.session.usuario: ' + req.session.usuario);
    } else {
        observador.info('No hay req.session.usuario');
    }

    res.render('index', { title: 'Express' });
});

/* POST datos de inicio de sesión. */
router.post('/iniciar', function (req, res, next) {
    var callback = function (err) {
        res.end();
        observador.info('Proceso de sesiones completado.');
        if (err) {
            observador.error(err);
            return false;
        }
        return true;
    };

    controlador.abrirSesion(req, res, callback);
});

router.get('/cerrar', function (req, res, next) {
    res.end();
    controlador.cerrarSesion(req);
});


module.exports = router;