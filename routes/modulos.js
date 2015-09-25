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

// Formulario para crear un nuevo módulo.
router.get('/nuevo', function (req, res, next) {
    res.render('crearmodulos', { titulo: 'Nuevo módulo' });
});

// Petición de crear nuevo módulo.
router.post('/nuevo', function (req, res, next) {
    var mensaje;

    // Verifica que el nombre y el número de módulo no sean vacíos.
    if (req.body.nombre.match(/^\s*$/) || req.body.numero.match(/^\s$/)) {
        res.render('crearmodulos', { titulo: 'Nuevo módulo', error: 'Los campos no pueden estar vacíos.' });
        return;
    }

    // Intenta crear módulo.
    modulos.crear(req.body.nombre, req.body.numero, function (err) {
        // Si hubo error, regresa al formulario de nuevo módulo con el mensaje de error correspondiente.
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                mensaje = 'Un módulo con este nombre o con este número ya existe.';
            } else {
                mensaje = 'Hubo un error al crear el nuevo módulo. Inténtelo más tarde.';
            }
            res.render('crearmodulos', { titulo: 'Nuevo módulo', error: mensaje });

        } else {
            res.redirect('/modulos');
        }
    });
});

module.exports = router;
