var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var credenciales = require('../database/credencialesBD.json');

function crearModulo(nombre, codigo) {

	var bd = mysql.createConnection(credenciales);
	bd.connect();

	// Prepara consulta y la ejecuta.
	// POR HACER:
	//	Que el usuario no esté jarcodeado.
	//	Que haga las validaciones.
	var sql = 'INSERT INTO Modulos(usuarioAdministrador, nombre, numeroModulo) VALUES(2,?,?);';
	var params = [nombre, codigo];
	sql = mysql.format(sql, params);
	bd.query(sql, function(err) {
		if(err) {
			bd.end();
			console.log(err);
			return false;
		} else {
			bd.end();
			return true;
		}
	});
}

module.exports = {
	'crear' : crearModulo
};
