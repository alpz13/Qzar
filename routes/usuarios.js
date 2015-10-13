/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();
var agregausuario = require('../components/agregaUsuario.js');

router.get('/*', function (req, res, next) {
    res.render('menu', {usuario: req.session.usuario, barraLateral: 'usuarios', titulo: "###", aviso: {tipo: 'danger', icono: 'fa fa-frown-o', mensaje: 'Este componente aún no ha sido implementado.'}});
});

router.post('/agregausuario', function (req, res, next) {
    var NuevoUsuario = {
        "nombre" : req.body.nombreusuario,
        "contrasenia" : req.body.contrasenausuario,
        "recontrasenia" : req.body.recontrasenausuario,
        "activo" : 1,
        "idUsuario" : 99999,
        "idRoles" : 99999,
        "idModulo" : 99999
    };

    // Valida permisos para crear módulo.
    if (req.session.usuario.idRoles !== 1) {
        res.send("No tienes permiso para crear un usuario.");
        return;
    }

    // Verifica que el nombre, la constraseña y re-contraseña no sean vacíos.
    // Segunda verificacion, la primera esta del lado del cliente.
    if (NuevoUsuario.nombre.match(/^\s*$/) || NuevoUsuario.contrasenia.match(/^\s*$/) || NuevoUsuario.recontrasenia.match(/^\s*$/)) {
        res.send('Hubo un error: Verifique que el nombre y contraseña no sea vacío o las contraseñas coincidan.');
        return;
    }

    //Intenta crear usuario
    agregausuario.agregar(NuevoUsuario, function (err) {
        if (err) {
            console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.send('Un usuario con este nombre ya existe');
            } else {
                res.send('Hubo un error al crear un nuevo usuario. Inténtelo más tarde');
            }
        } else {
            console.log("usuario creado con exito");
        }
    });
});

module.exports = router;