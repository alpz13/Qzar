'use strict';

var mysql = require('mysql');
var path = require('path');
var fs = require('fs');
var moment = require('moment-timezone');

var actividadesAsignadas = require('./actividadesAsignadas.js');
var credenciales = require('../database/credencialesbd.json');

function agregarRetroalimentacion(retro, callback) {
    // El archivo tiene como nombre el idModulo y la fecha.
    var hoy = moment().tz('America/Mexico_City').format('YYYY-MM-DD'),
        bd = mysql.createConnection(credenciales),
        sql = "INSERT INTO Retroalimentaciones(fecha, idModulos, descripcion, contenidoMultimedia) VALUES(?,?,?,?);",
        nombreArchivo,
        params;

    // Confirma las actividades que se completaron.
    for (var actividad in retro) {
        // Un parámetro se identifica como actividad porque su nombre es un numéro (el id de la actividad asignada).
        if (actividad.match(/^\d+$/)) {
            actividadesAsignadas.confirmar(actividad, function(err) {
                console.log(err);
            });
        }
    }

    if (retro.archivo) {
        nombreArchivo = retro.idModulo + '_' + hoy + path.extname(retro.archivo.originalFilename);
    }
    params = [hoy, retro.idModulo, retro.descripcion, nombreArchivo];

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultado) {
		bd.end(function(err) {
			if (err) {
				console.log(err);
			}
		});
        if (err) {
            callback(err);
			return;
        }
        
        // Si subió foto intenta guardarla.
        if (!retro.archivo) {
            callback(null, resultado.insertId);
        } else {
            fs.readFile(retro.archivo.path, function (err, contenidoArchivo) {
                if (err) {
                    callback(err);
					return;
                }

                fs.writeFile("./public/images/retros/" + nombreArchivo, contenidoArchivo, function (err) {
                    if (err) {
                        console.log(err);
                        callback(err);
                    } else {
						callback(null, resultado.insertId);
					}
                });
            });
        }
    });
}

function actualizarRetroalimentacion(retro, callback) {
    // El archivo tiene como nombre el idModulo y la fecha.
    var hoy = moment().tz('America/Mexico_City').format('YYYY-MM-DD'),
        bd = mysql.createConnection(credenciales),
        sql = "UPDATE Retroalimentaciones SET descripcion = ? WHERE fecha = ? AND idModulos = ?;",
        nombreArchivo,
        params;

    // Confirma las actividades que se completaron.
    actividadesAsignadas.cancelarConfirmacionesHoy(retro.idModulo, function(err) {
        if (err) {
            console.log(err);
        }
    });
    for (var actividad in retro) {
        // Un parámetro se identifica como actividad porque su nombre es un numéro (el id de la actividad asignada).
        if (actividad.match(/^\d+$/)) {
            actividadesAsignadas.confirmar(actividad, function(err) {
                console.log(err);
            });
        }
    }

    // Para saber si también debe reemplazar la foto o no.
    if (retro.archivo) {
        sql = "UPDATE Retroalimentaciones SET descripcion = ?, contenidoMultimedia = ? WHERE fecha = ? AND idModulos = ?;";
        nombreArchivo = retro.idModulo + '_' + hoy + path.extname(retro.archivo.originalFilename);
        params = [retro.descripcion, nombreArchivo, hoy, retro.idModulo];
    } else {
        params = [retro.descripcion, hoy, retro.idModulo];
    }

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultado) {
		bd.end(function(err) {
			if (err) {
				console.log(err);
			}
		});
        if (err) {
            callback(err);
			return;
        }
        
        // Si subió foto intenta guardarla.
        if (!retro.archivo) {
            callback(null, resultado.insertId);
        } else {
            fs.readFile(retro.archivo.path, function (err, contenidoArchivo) {
                if (err) {
                    callback(err);
					return;
                }

                fs.writeFile("./public/images/retros/" + nombreArchivo, contenidoArchivo, function (err) {
                    if (err) {
                        console.log(err);
                        callback(err);
                    } else {
						callback(null, resultado.insertId);
					}
                });
            });
        }
    });
}

function listarRetroalimentaciones(idModulo, mes, callback) {
    // A quien tenga que mantener esto: Perdón.
    var connection = mysql.createConnection(credenciales),
        sql = "SELECT A.nombre, S.numeroSector, DATE_FORMAT(AA.fecha, '%Y-%m-%d') as fecha, AA.cumplido, R.descripcion, R.contenidoMultimedia as ruta "
            + "FROM ActividadesAsignadas as AA LEFT JOIN Retroalimentaciones as R ON AA.idModulos = R.idModulos AND AA.fecha = R.fecha "
            + "INNER JOIN Actividades as A ON A.idActividad = AA.idActividades "
            + "INNER JOIN Sectores as S ON S.idSector = AA.idSectores "
            + "WHERE AA.idModulos = ? AND MONTH(AA.fecha) = MONTH(?) "
            + "UNION SELECT null AS nombre, null AS numeroSector, DATE_FORMAT(R.fecha, '%Y-%m-%d') as fecha, null AS cumplido, R.descripcion, R.contenidoMultimedia as ruta "
            + "FROM Retroalimentaciones as R "
            + "WHERE R.idModulos = ? AND MONTH(R.fecha) = MONTH(?) "
            + "AND R.fecha NOT IN (SELECT fecha FROM ActividadesAsignadas WHERE idModulos = ? AND MONTH(fecha) = ?)",
        params = [idModulo, mes, idModulo, mes, idModulo, mes];

    sql = mysql.format(sql, params);
    connection.query(sql, function (err, filas) {
        if (!err) {
            callback(null, filas);
        } else {
            callback(err);
        }
    });

    connection.end(function(err) {
        if (err) {
			console.log(err);
		}
	});
};

function verRetroalimentacionHoy(idModulo, callback) {

    var hoy = moment().tz('America/Mexico_City').format('YYYY-MM-DD'),
        bd = mysql.createConnection(credenciales),
        sql = "SELECT * from Retroalimentaciones WHERE fecha = ? AND idModulos = ?;",
        params = [hoy, idModulo];

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultado) {
        if (err) {
            callback(err);
        } else {
			callback(null, resultado[0]);
		}
    });

    bd.end(function(err) {
        if (err) {
			console.log(err);
		}
	});
}

module.exports = {
  'agregar' : agregarRetroalimentacion,
  'actualizar' : actualizarRetroalimentacion,
  'hoy' : verRetroalimentacionHoy,
  'listarRetroalimentaciones': listarRetroalimentaciones
};
