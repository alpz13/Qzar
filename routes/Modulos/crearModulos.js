var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.send('Módulo POST.');
	res.render('agregamodulo', { title: 'Agrega Módulo' });
});

router.post('/', function(req, res) {
	//var nombre = req
	res.send('Módulo POST.');
});

module.exports = router;
