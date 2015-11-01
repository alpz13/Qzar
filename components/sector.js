var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');

function crearSector(nuevoPoste, callback)
{
	var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO contenidocuadritos(nombre, color) VALUES (?,?);',
        params = [nuevoPoste.nombre, nuevoPoste.color];

        bd.connect();

        // Prepara consulta y la ejecuta.
    	sql = mysql.format(sql, params);
    	bd.query(sql, function (err, resultados) {
    		if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        return callback(null, resultado.insertId);
    });
}



function listarSector(callback)
{
	var bd = mysql.createConnection(credenciales),
		sql = 'SELECT * FROM contenidocuadritos';

	bd.connect();

	bd.query(sql, function (err, resultados){
		if(err){
			bd.end();
			return callback(err);
		}
		bd.end();
		return callback(null, resultados);
	});
}








module.exports = {
	'crear' :crearSector,
	'listar' : listarSector
};


