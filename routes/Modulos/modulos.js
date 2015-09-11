var express = require('express');
var router = express.Router();

var app = express();
var crearModulos = require('./crearModulos');

router.get('/', function(req, res) {
  //res.render('agregamodulo', { title: 'Agrega Módulo' });
  res.send('Módulo de módulos.');
});

//router.get('/crear', crearModulos.get);

app.use('/crear', crearModulos);

module.exports = router;
