var moment = require('moment-timezone');

var listarActividadesAsignadas = function (idModulo, res) {
    var credenciales = require('../database/credencialesbd.json');
    //Carga el modulo de mySQL
    var mysql = require('mysql');
    //Crea la coneccion
    var connection = mysql.createConnection(credenciales);
    //Prueba si se conecto correctamente a la base de datos
    connection.connect(function (err) {
        if (!err) {
            console.log("Database is connected ... \n");
            //Guardar el cuadrito
            console.log("antes de la query");
            connection.query("select ac.fecha as date, a.nombre as title, ac.idSectores, s.numeroSector FROM Actividades as a, ActividadesAsignadas as ac, Sectores as s WHERE ac.idModulos = " + idModulo + " AND a.idActividad = ac.idActividades AND s.idSector = ac.idSectores", function (err, rows) {
                //Funcion callback del query
                console.log("despues de la query");
                if (!err) {
                    //Si no ocurrio un error al realizar la query
                    console.log(rows);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(rows));
                    return;
                    //return rows.insertId;
                }
                //Error al ejecutar el query
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify([]));
                return;
            });
            //Termina la conexion
            connection.end();
        } else {
            console.log("Error connecting database ... \n");
        }
    });
};

function listarAsignacionesPorDia(idModulo, fecha, callback) {
    var credenciales = require('../database/credencialesbd.json');
    var mysql = require('mysql');
    var connection = mysql.createConnection(credenciales);
    var sql = "SELECT * FROM ActividadesAsignadas AS AA INNER JOIN Actividades AS A INNER JOIN Sectores AS S ON AA.idActividades = A.idActividad AND AA.idSectores = S.idSector WHERE fecha = ? AND AA.idModulos = ?";
    var params = [fecha, idModulo];

    connection.connect(function (err) {
        if (!err) {
            sql = mysql.format(sql, params);
            connection.query(sql, function (err, actividades) {
                connection.end();
                if (!err) {
                    callback(null, actividades);
                    return;
                }
                console.log(err);
                callback(err);
                return;
            });
        } else {
            console.log(err);
            callback(err);
        }
    });
}

function cancelarConfirmacionesHoy(idModulo, callback) {
    var credenciales = require('../database/credencialesbd.json');
    var mysql = require('mysql');
    var connection = mysql.createConnection(credenciales);
    var sql = "UPDATE ActividadesAsignadas SET cumplido = 0 WHERE idModulos = ? AND fecha = ?";
    var params = [idModulo, moment().tz('America/Mexico_City').format('YYYY-MM-DD')];

    connection.connect(function (err) {
        if (!err) {
            sql = mysql.format(sql, params);
            connection.query(sql, function (err) {
                connection.end();
                if (err) {
                    callback(err);
                }
			});
		}
	});
}

function confirmarActividadAsignada(idActividadesAsignadas, callback) {
    var credenciales = require('../database/credencialesbd.json');
    var mysql = require('mysql');
    var connection = mysql.createConnection(credenciales);
    var sql = "UPDATE ActividadesAsignadas SET cumplido = 1 WHERE idActividadesAsignadas = ?";
    var params = [idActividadesAsignadas];

    connection.connect(function (err) {
        if (!err) {
            sql = mysql.format(sql, params);
            connection.query(sql, function (err) {
                connection.end();
                if (err) {
                    callback(err);
                }
			});
		}
	});
}

module.exports = {
    'listarActividadesAsignadas': listarActividadesAsignadas,
    'listarPorDia': listarAsignacionesPorDia,
	'cancelarConfirmacionesHoy': cancelarConfirmacionesHoy,
	'confirmar': confirmarActividadAsignada
};
