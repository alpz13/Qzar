var express = require('express');
var router = express.Router();

var app = express();
var crearModulos = require('./crearModulos');

//app.use('/', );
app.use('/nuevo', crearModulos);

module.exports = app;
