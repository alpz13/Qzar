/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();
/*  Se incluye el archivo listarActividades.js como parte de la variable listar*/
var listar = require('../components/listarActividades.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.usuario) {
        res.render('index');
    } else {
        console.log(req.session.usuario);
        res.render('menu', {usuario: req.session.usuario});
    }
  // next();
});


module.exports = router;