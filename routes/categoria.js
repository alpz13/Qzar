/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();
var categoria = require('../components/categoria.js');

router.get('/', function(req, res){
	res.render('categoria',{ titulo: 'Categorias', usuario: req.session.usuario, barraLateral: 'categorias'});
});

router.post('/agregacategoria', function(req, res) {

})

module.exports = router;