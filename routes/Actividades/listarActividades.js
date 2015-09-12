var mysql = require('mysql');
var credenciales = require('../../database/credencialesdb.js')

var listarActividades = function(res){
	var db =mysql.createConnection(credenciales);
	db.connect();
	db.query('Select * from actividades', function(err, rows){
		if(err){
			console.log("Sucedio el error" + err);
			db.end();
		}
		db.end();
		res.render('actividades', {
			title: 'Actividades',
			actividades: rows
		});
	});
}

module.exports = {
	'listarActividades' : listarActividades
};