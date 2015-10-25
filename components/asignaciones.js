/* globals require: true, console: true, module: true */
'use strict';

var credenciales = require('../database/credencialesbd.json');
var mysql = require('mysql');

var listarAsignaciones = function (idModulo, res, callback) {
    var connection = mysql.createConnection(credenciales);
    connection.connect(function (err) {
        if(err) {
            console.log(err);
            callback(err);
            return;
        }
        connection.query('SELECT ac.fecha AS date, a.nombre as title, ac.idSectores, s.numeroSector FROM Actividades as a, ActividadesAsignadas as ac, Sectores as s WHERE ac.idModulos = ' + idModulo + ' AND a.idActividad = ac.idActividades AND s.idSector = ac.idSectores', function (err, rows) {
            if(err) {
                console.log(err);
                callback(err);
                return;
            }
            callback([]);
            return;
        });
        connection.end();
    });
};

module.exports = {
    'listarAsignaciones': listarAsignaciones
};
