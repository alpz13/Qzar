"strict"

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var mysql = require('mysql');

var conexion = mysql.createConnection({
	host: 'localhost',
	user: 'marc',
	password: 'Lacontraseñaesultrasecreta',
	database: 'qzardb'
});

router.get('/', function(req, res, next) {
	// wtf, manda 403 cuando pongo la vista en otra carpetita.
	res.sendFile('creamodulo.html', {root: __dirname});
});

router.post('/', function(req, res, next) {
	// Prepara consulta y la ejecuta.
	var sql = 'INSERT INTO Modulos(usuarioAdministrador, nombre, numeroModulo) VALUES(2,?,?);';
	var params = [req.body.nombre, req.body.codigo];
	sql = mysql.format(sql, params);
	conexion.query(sql, function(err) {
		if(err) {
			console.log(err);
			res.end('Error: No se pudo crear Módulo.');
		} else {
			res.end('Felicidades: Módulo ' + req.body.nombre + " creado exitosamente.");
		}
	});
});

module.exports = router;


//Nueva linea 4