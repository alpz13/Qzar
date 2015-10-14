/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var multiparty = require('multiparty');
var router = express.Router();

var retroalimentaciones = require('../components/retroalimentaciones.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.usuario.idRoles !== 1) {
        //res.redirect('/retroalimentacion/' + req.session.usuario.idModulo);
        res.render('retroalimentaciones', {usuario: req.session.usuario });
        return;
    } else{
        res.render('menu', {usuario: req.session.usuario });
    }
  // next();
});

// Petición de crear nueva retroalimentación.
router.post('/nuevo', function (req, res, next) {
    var formulario = new multiparty.Form(),
        retroalimentación = {};

    // Valida permisos para agregar retroalimentación.
    // Que no cheque tan chacamente.
    if (req.session.usuario.idRoles !== 2) {
        res.send("No tienes permiso para enviar retroalimentación.");
        return;
    }

    // Para leer el archivo.
    formulario.parse(req, function(err, campos, archivos) {
        if (err) {
            console.log(err);
            res.send('Hubo un error al agregar la retroalimentación. Inténtelo más tarde.');
        } else {
            retroalimentación.idModulo = req.session.usuario.idModulo,
            retroalimentación.descripción = campos.descripcion
            if (archivos) {
                retroalimentación.archivo = archivos.archivo[0]; // :(
            }

			// Intenta agregar retro.
            retroalimentaciones.agregar(retroalimentación, function(err) {
                if (err) {
					console.log(err);
                    res.send('Hubo un error al agregar la retroalimentación. Inténtelo más tarde.');
                } else {
                    res.send('OK');
                }
            });
        }
    });
});

module.exports = router;
