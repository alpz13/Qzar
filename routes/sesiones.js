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

    res.render('iniciodesesion');
});

/* POST datos de inicio de sesión. */
router.post('/iniciar', function (req, res, next) {
    controlador.abrirSesion(req, res, function (err, usuario) {
        observador.info('Proceso de sesiones completado.');
        if (err) {
            observador.error(err);
            res.render('index', {mensaje: err, titulo: "Im sexy and I know it"});
        } else {
            res.render('index', {mensaje: 'Iniciaste sesión, biatch', titulo: "Im sexy and I know it", usuario: req.session.usuario });
        }
    });
});

router.get('/cerrar', function (req, res, next) {
    res.render('index', {mensaje: 'Sesión cerrada'});
    res.end();
    controlador.cerrarSesion(req);
});


module.exports = router;