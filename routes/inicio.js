'use strict';

var express = require('express');
var router = express.Router();

/* 
 * Si el usuario ya inició sesión, es llevado a la pantalla principal, que
 *  actualmente no contiene nada.
 * Si el usuario no inició sesión, es llevado a la pantalla de inicio de
 *  sesión.
 */
router.get('/', function (req, res, next) {
    if (!req.session.usuario) {
        res.render('index', {titulo: 'Iniciar sesión'});
    } else {
        res.render('menu', {titulo: 'Bienvenido', usuario: req.session.usuario});
    }
});

module.exports = router;
