/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();

var usuarios = require('../components/usuarios.js');

router.get('/', function (req, res, next) {
	if (req.session.usuario.idRoles !== 1) {
        res.redirect('/usuarios/' + req.session.usuario.idUsuario);
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



// Página ver usuario a detalle
router.get('/:id(\\d+)', function (req, res, next) {
    var idUsuario = req.params.id;
    usuarios.mostrarUsuarios(idUsuario, function (err, usuarios) {
        if (err) {
            console.log(err);
        } else if (!usuarios[0]) {
            err = new Error('Not Found');
            err.status = 404;
            next(err);
            return;
        }

        if (req.session.usuario.idRoles !== 1 && req.session.usuario.idUsuario !== usuarios[0].idUsuario) {
            err = new Error('No puedes.');
            err.status = 403;
            next(err);
            return;
        }else 
        {
        	res.render('verusuarios', { titulo: 'Usuario: ', usuarios: usuarios[0], usuario: req.session.usuario, barraLateral: 'usuarios'});
        }
        
     
        //res.render('verusuarios', { titulo: 'Usuario: ', us: usuarios[0], usuario: req.session.usuario, listaAdmins: usuarios, barraLateral: 'usuarios'});
        
    });
});

module.exports = router;