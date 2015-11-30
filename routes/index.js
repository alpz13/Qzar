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
        res.render('index');
    } else {
		//console.log(req.session.usuario);
        res.render('inicio', {usuario: req.session.usuario, aviso: {mensaje:'', tipo:'danger'}});
    }
});

module.exports = router;
