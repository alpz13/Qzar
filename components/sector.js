var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');



//Crear nuevo Sector
function crearSector(nuevoPoste, callback)
{
	var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO ContenidoCuadritos(nombre, color) VALUES (?,?);',
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
		sql = 'SELECT * FROM ContenidoCuadritos';

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
		sql = 'DELETE FROM ContenidoCuadritos WHERE idContenidoCuadritos = ?',
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


//Modificar nuevo Sector
function modificarSector(nuevoPoste, callback)
{
	var bd = mysql.createConnection(credenciales),
        sql = 'UPDATE ContenidoCuadritos SET nombre= ?, color= ? WHERE idContenidoCuadritos= ?;',
        params = [nuevoPoste.nombre, nuevoPoste.escogerColor, nuevoPoste.idContenidoCuadritos];

        console.log("YOLEROOO!!:" + nuevoPoste.escogerColor);
        console.log("YOLEROOO!!:" + nuevoPoste.idContenidoCuadritos);
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








module.exports = {
	'crear' : crearSector,
	'listar' : listarSector,
	'eliminar': eliminarSector,
	'modificar': modificarSector
};


