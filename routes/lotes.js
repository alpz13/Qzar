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

//Modificar lotes
router.post('/modificar', function (req, res, next) {
    

    var nuevoLote = {
        "cosechador" : req.body.cosechador,
        "sector" : req.body.sector,
        "fecha" : req.body.modulo,
        "modulo" : req.body.modulo,
        "contenido" : req.body.contenido,
        "idlote" : req.body.idlote

    };

    lotes.modificar(nuevoLote, function (err) {
        if (err) {
            console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.send('Ya esxiste');
            } else {
                res.send('Hubo un error al crear un nuevo lote. Inténtelo más tarde');
            }
        } else {
            console.log("lote modificado con exito");
            res.redirect("/lotes");
        }
    });
});


module.exports = router;