var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');



//Crear nuevo Sector
function crearSector(nuevoPoste, callback)
{
	var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO contenidocuadritos(nombre, color) VALUES (?,?);',
        params = [nuevoPoste.nombre, nuevoPoste.escogerColor];

        bd.connect();

        // Prepara consulta y la ejecuta.
    	sql = mysql.format(sql, params);
    	bd.query(sql, function (err, resultados) {
    		if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        return callback(null, resultados.insertId);
    });
}


//Listar sectores
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

//Eliminar sectores
function eliminarSector(id, callback){
	var bd = mysql.createConnection(credenciales),
		sql = 'DELETE FROM contenidocuadritos WHERE idContenidoCuadritos = ?',
		params = [id];

		sql = mysql.format(sql,params);
		console.log("aqui estoy"+sql);

		bd.connect();

		bd.query(sql, function (err, resultados) {
        if (err) {
            bd.end();
            return callback(err, []);
        }
        bd.end();
        return callback(null, resultados);
    });
}








module.exports = {
	'crear' : crearSector,
	'listar' : listarSector,
	'eliminar': eliminarSector
};


