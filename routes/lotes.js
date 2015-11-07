/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();
var usuarios = require('../components/usuarios.js');
var lotes = require('../components/lotes.js');

// Página principal de lote
router.get('/', function (req, res, next) {
    if (req.session.usuario.idRoles !== 1) {
        res.redirect('/lotes/' + req.session.usuario.idModulo);
        return;
    }
    lotes.listar(function (err, lotes) {
        if (err) {
            console.log(err);
        }
        usuarios.listarAdminsGenerales(function (err, usuarios) {
            if (err) {
                console.log(err);
            }
            res.render('lotes', { titulo: 'Lotes', lotes: lotes, usuario: req.session.usuario, listaAdmins: usuarios, barraLateral: 'lotes' });
        });
    });
});


//eliminar lote
router.get('/eliminar/:id(\\d+)', function (req, res, next) {
    var idLote = req.params.id;

    // Valida permisos para eliminar módulo.
    if (req.session.usuario.idRoles !== 1) {
        res.sendStatus(403);
        return;
    }

    lotes.eliminar(idLote, function (err, modulos) {
        res.redirect('/lotes');
    });
});



module.exports = router;