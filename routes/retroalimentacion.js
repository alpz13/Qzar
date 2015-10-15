/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();
var modulos = require('../components/modulos.js');
var usuarios = require('../components/usuarios.js');
var retroalimentaciones = require('../components/retroalimentaciones.js');

/* GET home page. */
router.get('/', function (req, res, next) {
	if (req.session.usuario.idRoles !== 1) {
        res.redirect('/retroalimentacion/' + req.session.usuario.idModulo);
        return;
    }
    modulos.listar(function (err, modulos) {
        if (err) {
            console.log(err);
        }
        usuarios.listarAdminsGenerales(function (err, usuarios) {
            if (err) {
                console.log(err);
            }
            res.render('retroalimentaciones', { titulo: 'Retroalimentaciones de los módulos', modulos: modulos, usuario: req.session.usuario, listaAdmins: usuarios, barraLateral: "retroalimentacion"});
        });
    });
  // next();
});


// Página ver modulo
router.get('/:id(\\d+)', function (req, res, next) {
    var idModulo = req.params.id;
        modulos.mostrar(idModulo, function (err, modulos) {
        if (err) {
            console.log(err);
        } else if (!modulos[0]) {
            err = new Error('Not Found');
            err.status = 404;
            next(err);
            return;
        }

        if (req.session.usuario.idRoles !== 1 && req.session.usuario.idModulo !== modulos[0].idModulo) {
            err = new Error('No puedes.');
            err.status = 403;
            next(err);
            return;
        }

        usuarios.listarUsuariosModulo(idModulo, function (err, usuarios) {
            if (err) {
                console.log(err);
            }
    		res.render('verretroalimentacion', { titulo: 'Retroalimentación', idModulo: idModulo, usuario:req.session.usuario, barraLateral: "retroalimentacion", modulo: modulos[0], listaAdmins: usuarios,});
        });
    });

});

router.post('/verRetroalimentacion', function (req, res, next) {
    retroalimentaciones.listarRetroalimentaciones(req.body.modulo, res);
});



module.exports = router;