var mysql = require('mysql');

var credenciales = require('../database/credenciales.json');

function crearTipoPoste(nuevoPoste, callback)
{
	var bd = mysql.createConnection(credenciales),
-        sql = 'ISERT INTO contenidocuadritos(nombre, color) VALUES (?,?);',
        params = [nuevoPoste.nombre, nuevoPoste.color];

        bd.connect();

        // Prepara consulta y la ejecuta.
    	sql = mysql.format(sql, params);
    	bd.query(sql, function (err, resultado) {
    		if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        return callback(null, resultado.insertId);
    });
}


module.exports = {
	'crearPoste' :crearTipoPoste
};


