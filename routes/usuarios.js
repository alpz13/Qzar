/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();

var usuarios = require('../components/usuarios.js');
var modulos 

router.get('/', function (req, res, next) {
	if (req.session.usuario.idRoles !== 1) {
        res.redirect('/usuarios/' + req.session.usuario.idModulo);
        return;
    }

    usuarios.listarUsuarios(function (err, usuarios1) {
        if (err) {
            console.log(err);
        }
        usuarios.listarAdminsGenerales(function (err, usuarios2) {
            if (err) {
                console.log(err);
            }
            res.render('usuarios', { titulo: 'Usuarios', usuarios: usuarios1, usuario: req.session.usuario, listaAdmins: usuarios2, barraLateral: 'usuarios' });
        });
    });
    
});

module.exports = router;