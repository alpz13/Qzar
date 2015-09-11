var express = require('express');
var mysql = require('mysql');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('Modulos/crearModulos', { title: 'Agrega Módulo' });
});

router.post('/', function(req, res) {
	var nombre = req.body.nombre;
	var codigo = req.body.codigo;

	// Prepara consulta y la ejecuta.
	var sql = 'INSERT INTO Modulos(usuarioAdministrador, nombre, numeroModulo) VALUES(2,?,?);';
	var params = [nombre, codigo];
	sql = mysql.format(sql, params);
	req.bd.query(sql, function(err) {
		if(err) {
			console.log(err);
			res.end('Error: No se pudo crear módulo ' + nombre + '.');
		} else {
			res.end('Felicidades: Módulo ' + nombre + " se ha creado exitosamente.");
		}
	});
});

module.exports = router;
