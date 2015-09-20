/*jslint
    indent: 4, unparam: true
 */
'use strict';

var express = require('express');
var router = express.Router();

var modulos = require('../components/modulos.js');

// Página principal de módulos
router.get('/', function (req, res, next) {
    modulos.listar(function (err, modulos) {
        if (err) {
            console.log(err);
        }
        res.render('modulos', { titulo: 'Módulos', modulos: modulos });
    });
});

module.exports = router;
