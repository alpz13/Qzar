var express = require('express');
var router = express.Router();
var listar = require('./Actividades/listarActividades.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/actividades', function(req, res, next){
	listar.listarActividades(res);
});

module.exports = router;
