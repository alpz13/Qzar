/*jslint
  indent: 4, unparam: true
*/
'use strict';

var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var credenciales = require('../database/credencialesbd.json');

function agregar (nombre, callback) {

}

module.exports = {
    'agregar' : agregar
};
