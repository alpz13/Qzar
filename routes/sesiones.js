'use strict';
/*jslint
    indent: 4, unparam: true
*/
var express = require('express');

var controlador = require('../components/login.js');
var router = express.Router();
var Registro = require('log');
var observador = new Registro('info');

/* POST datos de inicio de sesión. */
router.post('/iniciar', function (req, res, next) {
    controlador.abrirSesion(req, res, function (err, usuario) {
        if (req.session.usuario && req.session.usuario.nombre === req.body.nombreUsuario) {
            res.redirect('/');
            return;
        }
        //TODO cuando hay sesión abierta y se intenta iniciar con otra sesión
        observador.info('Proceso de sesiones completado.');
        if (err) {
            observador.error(err);
            if (err.code === 'ECONNREFUSED') {
                res.render('index', {mensaje: err, titulo: "###", aviso: {tipo: 'danger', icono: 'fa fa-plug', mensaje: 'Error al conectarse a la base de datos.'}});
            } else {
                res.render('index', {mensaje: err, titulo: "###", aviso: {tipo: 'danger', icono: 'fa fa-exclamation-triangle', mensaje: 'Usuario y/o contraseña incorrectos.'}});
            }
        } else {
            res.redirect('/');
            res.render('index', {usuario: req.session.usuario });
        }
    });
});

router.get('/cerrar', function (req, res, next) {
    res.redirect('/');
	//Este ya no hace nada porque ya se mandó es repsonse en el redirect.
    //res.render('index', {mensaje: 'Sesión cerrada'});
    controlador.cerrarSesion(req);
});


module.exports = router;
