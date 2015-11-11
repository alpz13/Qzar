/*jslint
  indent: 4, unparam: true
*/
'use strict';

var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var credenciales = require('../database/credencialesbd.json');

function agregar (nombre, callback) {
	var sql = 'INSERT INTO categorias(nombreCategoria) VALUES (?);';
	var bd = mysql.createConnection(credenciales);
	bd.connect();
	sql = mysql.format(sql, nombre);
	bd.query(sql, function (err, resultado) {
		if(err) {
			bd.end();
			return callback(err);
		}
		bd.end();
		console.log("Categoria creada");
		return callback(null);
	});
};

function listar(callback) {
	var sql = 'SELECT * FROM categorias;';
	var bd = mysql.createConnection(credenciales);
	bd.connect();
	bd.query(sql, function (err, resultados) {
		if(err) {
			bd.end();
			return callback(err);
		}
		bd.end();
		console.log("Listando Categorias");
		return callback(null, resultados);
	});
};

function modificar(infomodificar, callback) {
	var sql = 'UPDATE categorias SET nombreCategoria = ? WHERE idCategoria = ?';
	var bd = mysql.createConnection(credenciales);
	var params = [infomodificar.nombre, infomodificar.id];
	sql= mysql.format(sql, params);
	bd.connect();
	bd.query(sql, function (err, resultado) {
		if(err) {
			bd.end();
			return callback(err);
		}
		bd.end();
		console.log("Categoria Modificada");
		return callback(null);
	});
};

module.exports = {
    'agregar' : agregar,
    'listar' : listar,
    'modificar' : modificar	
};
