/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();

router.get('/*', function (req, res, next) {
    res.render('menu', {usuario: req.session.usuario, barraLateral: 'lotes', titulo: "###", aviso: {tipo: 'danger', icono: 'fa fa-frown-o', mensaje: 'Este componente aún no ha sido implementado.'}});
});

module.exports = router;